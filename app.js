const cards = document.querySelectorAll('.station-card');
const audio = document.getElementById('audio-stream');
const playState = document.getElementById('play-state');
const nowPlaying = document.getElementById('now-playing');

let currentIndex = 0;
let isPlaying = false;

function updateFocus() {
    cards.forEach((card, idx) => {
        if (idx === currentIndex) {
            card.classList.add('focus');
        } else {
            card.classList.remove('focus');
        }
    });
}

function togglePlay() {
    const activeCard = cards[currentIndex];
    const streamUrl = activeCard.getAttribute('data-url');
    const stationName = activeCard.querySelector('h3').textContent;

    if (isPlaying && audio.src === streamUrl) {
        audio.pause();
        isPlaying = false;
        playState.textContent = '⏸️ Paused';
        activeCard.classList.remove('playing');
        nowPlaying.textContent = `Paused: ${stationName}`;
    } else {
        audio.src = streamUrl;
        audio.play().then(() => {
            isPlaying = true;
            playState.textContent = '▶️ Playing';
            cards.forEach(c => c.classList.remove('playing'));
            activeCard.classList.add('playing');
            nowPlaying.textContent = `Now Playing: ${stationName}`;
        }).catch(err => {
            console.error("Playback error:", err);
            playState.textContent = '❌ Error Loading Stream';
        });
    }
}

document.addEventListener('keydown', (e) => {
    switch(e.keyCode) {
        case 38: // Up
            currentIndex = (currentIndex - 2 + cards.length) % cards.length;
            updateFocus();
            break;
        case 40: // Down
            currentIndex = (currentIndex + 2) % cards.length;
            updateFocus();
            break;
        case 37: // Left
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateFocus();
            break;
        case 39: // Right
            currentIndex = (currentIndex + 1) % cards.length;
            updateFocus();
            break;
        case 13: // Enter / OK
            togglePlay();
            break;
        case 10009: // Tizen Return Key
            if (typeof tizen !== 'undefined') {
                tizen.application.getCurrentApplication().exit();
            }
            break;
    }
});

updateFocus();
