const Session = require('../models/Session');
const { generateSessionCode } = require('../utils/helpers');

const sessions = new Map();

function setupSocketHandlers(io) {
    io.on('connection', (socket) => {
        console.log(`New client connected: ${socket.id}`);

        socket.on('create_session', (data) => {
            const { duration } = data;
            const sessionCode = generateSessionCode();

            const session = new Session(sessionCode, duration, socket.id);
            const result = session.addPlayer(socket.id);

            if (!result.success) {
                socket.emit('error', { message: result.error });
                return;
            }

            sessions.set(sessionCode, session);
            socket.join(sessionCode);

            socket.emit('session_created', {
                sessionCode,
                player: result.player,
                sessionData: session.getSessionData()
            });
        });

        socket.on('join_session', (data) => {
            const { sessionCode } = data;
            const session = sessions.get(sessionCode);

            if (!session) {
                socket.emit('error', { message: 'Session not found' });
                return;
            }

            const result = session.addPlayer(socket.id);

            if (!result.success) {
                socket.emit('error', { message: result.error });
                return;
            }

            socket.join(sessionCode);

            socket.emit('session_joined', {
                sessionCode,
                player: result.player,
                sessionData: session.getSessionData()
            });

            socket.to(sessionCode).emit('player_joined', {
                player: result.player,
                sessionData: session.getSessionData()
            });
        });

        socket.on('start_session', (data) => {
            const { sessionCode } = data;
            const session = sessions.get(sessionCode);

            if (!session) {
                socket.emit('error', { message: 'Session not found' });
                return;
            }

            if (session.creatorSocketId !== socket.id) {
                socket.emit('error', { message: 'Only the host can start the session' });
                return;
            }

            const result = session.startSession();

            if (!result.success) {
                socket.emit('error', { message: result.error });
                return;
            }

            io.to(sessionCode).emit('session_started', {
                sessionData: session.getSessionData()
            });

            setTimeout(() => {
                if (session.status === 'active') {
                    const results = session.finishSession();
                    io.to(sessionCode).emit('session_finished', results);
                }
            }, session.duration * 1000);
        });

        socket.on('update_zone', (data) => {
            const { sessionCode, zone } = data;
            const session = sessions.get(sessionCode);

            if (!session) {
                socket.emit('error', { message: 'Session not found' });
                return;
            }

            const player = session.updatePlayerZone(socket.id, zone);

            if (!player) {
                socket.emit('error', { message: 'Player not found in session' });
                return;
            }

            io.to(sessionCode).emit('zone_updated', {
                playerId: player.playerId,
                playerName: player.playerName,
                zone: zone
            });
        });

        socket.on('update_score', (data) => {
            const { sessionCode, greenZoneTime } = data;
            const session = sessions.get(sessionCode);

            if (!session) {
                socket.emit('error', { message: 'Session not found' });
                return;
            }

            const player = session.updatePlayerScore(socket.id, greenZoneTime);

            if (!player) {
                socket.emit('error', { message: 'Player not found in session' });
                return;
            }

            io.to(sessionCode).emit('score_updated', {
                playerId: player.playerId,
                playerName: player.playerName,
                greenZoneTime: greenZoneTime,
                score: player.score
            });
        });

        socket.on('leave_session', (data) => {
            const { sessionCode } = data;
            const session = sessions.get(sessionCode);

            if (!session) return;

            const result = session.removePlayer(socket.id);
            socket.leave(sessionCode);

            if (session.players.size === 0) {
                sessions.delete(sessionCode);
            } else {
                io.to(sessionCode).emit('player_left', {
                    sessionData: session.getSessionData(),
                    newHost: result.newHost
                });
            }

            socket.emit('left_session', { sessionCode });
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);

            sessions.forEach((session, sessionCode) => {
                if (session.players.has(socket.id)) {
                    const result = session.removePlayer(socket.id);

                    if (session.players.size === 0) {
                        sessions.delete(sessionCode);
                    } else {
                        io.to(sessionCode).emit('player_left', {
                            sessionData: session.getSessionData(),
                            newHost: result.newHost
                        });
                    }
                }
            });
        });
    });
}

module.exports = { setupSocketHandlers };