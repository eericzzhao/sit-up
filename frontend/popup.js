// Page navigation
const pages = {
    mainMenu: document.getElementById('mainMenuPage'),
    duration: document.getElementById('durationPage')
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
        console.log('Selected duration:', duration, 'seconds');
        // TODO: Create session with selected duration
    });
});

// Cancel button
document.getElementById('cancelDurationBtn').addEventListener('click', () => {
    showPage('mainMenu');
});