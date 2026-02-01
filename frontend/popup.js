const SOCKET_URL = 'http://localhost:3000';
let socket = null;
let currentSession = null;
let currentPlayer = null;

const pages = {
    mainMenu: document.getElementById('mainMenuPage'),
    duration: document.getElementById('durationPage'),
    lobby: document.getElementById('lobbyPage')
};

function showPage(pageName) {
    Object.values(pages).forEach(page => page.classList.remove('active'));
    pages[pageName].classList.add('active');
}

function initSocket() {
    if (socket) return;

    socket = io(SOCKET_URL);

    socket.on('connect', () => {
        console.log('Connected to server:', socket.id);
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });

    socket.on('session_created', (data) => {
        console.log('Session created:', data);
        currentSession = data.sessionData;
        currentPlayer = data.player;

        document.getElementById('lobbySessionCode').textContent = data.sessionCode;
        updateLobbyUI(data.sessionData);
        showPage('lobby');
    });

    socket.on('session_joined', (data) => {
        console.log('Joined session:', data);
        currentSession = data.sessionData;
        currentPlayer = data.player;

        document.getElementById('lobbySessionCode').textContent = data.sessionCode;
        updateLobbyUI(data.sessionData);
        showPage('lobby');
    });

    socket.on('player_joined', (data) => {
        console.log('Player joined:', data);
        currentSession = data.sessionData;
        updateLobbyUI(data.sessionData);
    });

    socket.on('player_left', (data) => {
        console.log('Player left:', data);
        currentSession = data.sessionData;
        updateLobbyUI(data.sessionData);

        if (data.newHost && data.newHost.socketId === socket.id) {
            currentPlayer.isHost = true;
            showHostControls();
        }
    });

    socket.on('session_started', (data) => {
        console.log('Session started:', data);
        currentSession = data.sessionData;
        alert('Session started! (Active session page coming soon)');
    });

    socket.on('session_finished', (data) => {
        console.log('Session finished:', data);
        alert(`Session finished! Winner: ${data.winner.playerName} with ${data.winner.greenZoneTime}s in green zone`);
    });

    socket.on('error', (data) => {
        console.error('Socket error:', data.message);
        alert(data.message);
    });
}

function updateLobbyUI(sessionData) {
    document.getElementById('playerCount').textContent = sessionData.playerCount;

    const playersList = document.getElementById('playersList');
    playersList.innerHTML = '';

    sessionData.players.forEach(player => {
        const playerItem = document.createElement('div');
        playerItem.className = 'player-item';

        playerItem.innerHTML = `
      <span class="player-name">${player.playerName}${player.isHost ? ' (Host)' : ''}</span>
      <span class="player-ready">${player.isReady ? '✓' : ''}</span>
    `;

        playersList.appendChild(playerItem);
    });

    if (currentPlayer && currentPlayer.isHost) {
        showHostControls();
    } else {
        hideHostControls();
    }
}

function showHostControls() {
    document.getElementById('startSessionBtn').style.display = 'block';
    document.getElementById('waitingMessage').style.display = 'none';
}

function hideHostControls() {
    document.getElementById('startSessionBtn').style.display = 'none';
    document.getElementById('waitingMessage').style.display = 'block';
}

// Main Menu
document.getElementById('createSessionBtn').addEventListener('click', () => {
    initSocket();
    showPage('duration');
});

document.getElementById('joinSessionBtn').addEventListener('click', () => {
    initSocket();
    const sessionCode = prompt('Enter session code:');
    if (sessionCode && sessionCode.length === 6) {
        socket.emit('join_session', { sessionCode });
    } else if (sessionCode) {
        alert('Session code must be 6 digits');
    }
});

// Duration Selection
document.querySelectorAll('.duration-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const duration = parseInt(btn.dataset.duration);
        const minutes = duration / 60;

        document.getElementById('lobbyDuration').textContent = `${minutes} minutes`;

        socket.emit('create_session', { duration });
    });
});

document.getElementById('cancelDurationBtn').addEventListener('click', () => {
    showPage('mainMenu');
});

// Lobby Actions
document.getElementById('copyLinkBtn').addEventListener('click', () => {
    const sessionCode = document.getElementById('lobbySessionCode').textContent;
    navigator.clipboard.writeText(sessionCode);

    const btn = document.getElementById('copyLinkBtn');
    const originalText = btn.textContent;
    btn.textContent = '[Copied!]';
    setTimeout(() => {
        btn.textContent = originalText;
    }, 2000);
});

document.getElementById('startSessionBtn').addEventListener('click', () => {
    if (currentSession) {
        socket.emit('start_session', { sessionCode: currentSession.sessionId });
    }
});

document.getElementById('leaveLobbyBtn').addEventListener('click', () => {
    if (currentSession) {
        socket.emit('leave_session', { sessionCode: currentSession.sessionId });
        currentSession = null;
        currentPlayer = null;
    }
    showPage('mainMenu');
});

// Cleanup on close
window.addEventListener('beforeunload', () => {
    if (socket && currentSession) {
        socket.emit('leave_session', { sessionCode: currentSession.sessionId });
    }
});