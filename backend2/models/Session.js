class Session {
    constructor(sessionId, duration, creatorSocketId) {
        this.sessionId = sessionId;
        this.duration = duration;
        this.players = new Map();
        this.status = 'waiting';
        this.startTime = null;
        this.endTime = null;
        this.creatorSocketId = creatorSocketId;
        this.playerCounter = 0;
    }

<<<<<<< HEAD
    addPlayer(socketId, playerName = null) {
=======
    addPlayer(socketId, customPlayerName = null) {
>>>>>>> dadca22 (rough version of the code up)
        if (this.players.size >= 4) {
            return { success: false, error: 'Session is full (max 4 players)' };
        }

        // Allow rejoining active session for disconnected players
        if (this.status === 'active' && this.players.has(socketId)) {
            // Player reconnecting - update their socket but keep their data
            const existingPlayer = this.players.get(socketId);
            return { success: true, player: existingPlayer };
        }

        if (this.status !== 'waiting') {
            return { success: false, error: 'Session already started' };
        }

        this.playerCounter++;
<<<<<<< HEAD
        
        // Use provided name or fallback to default names
        const defaultNames = ['Alice', 'Bob', 'Charlie', 'Diana'];
        const finalName = playerName || defaultNames[this.playerCounter - 1] || `Player ${this.playerCounter}`;
=======
        const names = ['Alice', 'Bob', 'Charlie', 'Diana'];
        const playerName = customPlayerName || names[this.playerCounter - 1];
>>>>>>> dadca22 (rough version of the code up)

        const player = {
            socketId,
            playerId: `player_${this.playerCounter}`,
<<<<<<< HEAD
            playerName: finalName,
=======
            playerName: playerName,
>>>>>>> dadca22 (rough version of the code up)
            isHost: socketId === this.creatorSocketId,
            isReady: true,
            score: 0,
            greenZoneTime: 0,
            currentZone: 'green',
            joinedAt: Date.now()
        };

        this.players.set(socketId, player);
        return { success: true, player };
    }

    removePlayer(socketId) {
        this.players.delete(socketId);

        if (socketId === this.creatorSocketId && this.players.size > 0) {
            const newHost = Array.from(this.players.values())[0];
            this.creatorSocketId = newHost.socketId;
            newHost.isHost = true;
            return { newHost };
        }

        return { newHost: null };
    }

    startSession() {
        if (this.status !== 'waiting') {
            return { success: false, error: 'Session already started' };
        }

        this.status = 'active';
        this.startTime = Date.now();
        this.endTime = this.startTime + (this.duration * 1000);

        return { success: true };
    }

    finishSession() {
        this.status = 'finished';

        const playerScores = Array.from(this.players.values())
            .map(p => ({
                playerId: p.playerId,
                playerName: p.playerName,
                greenZoneTime: p.greenZoneTime,
                score: p.score
            }))
            .sort((a, b) => b.greenZoneTime - a.greenZoneTime);

        return {
            status: 'finished',
            duration: this.duration,
            players: playerScores,
            winner: playerScores[0]
        };
    }

    updatePlayerZone(socketId, zone) {
        const player = this.players.get(socketId);
        if (!player) return null;
        player.currentZone = zone;
        return player;
    }

    updatePlayerScore(socketId, greenZoneTime) {
        const player = this.players.get(socketId);
        if (!player) return null;
        player.greenZoneTime = greenZoneTime;
        player.score = greenZoneTime;
        return player;
    }

    getSessionData() {
        return {
            sessionId: this.sessionId,
            duration: this.duration,
            status: this.status,
            startTime: this.startTime,
            endTime: this.endTime,
            players: Array.from(this.players.values()).map(p => ({
                playerId: p.playerId,
                playerName: p.playerName,
                isHost: p.isHost,
                isReady: p.isReady,
                currentZone: p.currentZone,
                greenZoneTime: p.greenZoneTime,
                score: p.score
            })),
            playerCount: this.players.size
        };
    }
}

module.exports = Session;