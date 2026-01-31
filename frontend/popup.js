const pages = {
    mainMenu: document.getElementById('mainMenuPage'),
    duration: document.getElementById('durationPage'),
    lobby: document.getElementById('lobbyPage')
};

function showPage(pageName) {
    Object.values(pages).forEach(page => page.classList.remove('active'));
    pages[pageName].classList.add('active');
}

// Main Menu buttons
document.getElementById('createSessionBtn').addEventListener('click', () => {
    showPage('duration');
});

document.getElementById('joinSessionBtn').addEventListener('click', () => {
    console.log('Join Session clicked');
    // TODO: Add join session page
});

// Duration selection
document.querySelectorAll('.duration-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const duration = parseInt(btn.dataset.duration);
        const minutes = duration / 60;
        console.log('Selected duration:', duration, 'seconds');

        // Update lobby page with selected duration
        document.getElementById('lobbyDuration').textContent = `${minutes} minutes`;

        // Go to lobby page
        showPage('lobby');
    });
});

// Cancel button
document.getElementById('cancelDurationBtn').addEventListener('click', () => {
    showPage('mainMenu');
});

// Lobby page actions
document.getElementById('copyLinkBtn').addEventListener('click', () => {
    const sessionCode = document.getElementById('lobbySessionCode').textContent;
    navigator.clipboard.writeText(`Join session: ${sessionCode}`);
    console.log('Link copied to clipboard');
});

document.getElementById('shareBtn').addEventListener('click', () => {
    console.log('Share clicked');
    // TODO: Implement share functionality
});

document.getElementById('startSessionBtn').addEventListener('click', () => {
    console.log('Starting session...');
    // TODO: Navigate to active session page
});

document.getElementById('leaveLobbyBtn').addEventListener('click', () => {
    showPage('mainMenu');
});