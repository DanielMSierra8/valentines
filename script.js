// ===== STATE =====
let currentScreen = 'landing';
let keyListenerActive = false; // starts false, enabled after delay

// ===== FALLING HEARTS (Screen 1) =====
function createFallingHearts() {
    const container = document.getElementById('hearts-container');
    const hearts = ['\u2764', '\u2665', '\u2763', '\u{1F493}', '\u{1F497}', '\u{1F496}'];
    const colors = ['#FF1744', '#FF69B4', '#FFD700', '#FF4081', '#E91E63', '#FFB6C1'];

    function spawnHeart() {
        if (currentScreen !== 'landing') return;

        const heart = document.createElement('div');
        heart.classList.add('falling-heart');
        heart.classList.add(Math.random() > 0.5 ? 'sway-left' : 'sway-right');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
        heart.style.color = colors[Math.floor(Math.random() * colors.length)];
        heart.style.animationDuration = (Math.random() * 4 + 4) + 's';
        heart.style.animationDelay = '0s';

        container.appendChild(heart);

        setTimeout(() => {
            if (heart.parentNode) heart.remove();
        }, 9000);
    }

    // Initial burst
    for (let i = 0; i < 15; i++) {
        setTimeout(spawnHeart, i * 200);
    }

    // Continuous spawn
    setInterval(spawnHeart, 400);
}

// ===== SPARKLES around title =====
function createSparkles() {
    const wrapper = document.querySelector('.sparkle-wrapper');
    if (!wrapper) return;

    setInterval(() => {
        if (currentScreen !== 'landing') return;

        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        sparkle.style.left = (Math.random() * 120 - 10) + '%';
        sparkle.style.top = (Math.random() * 120 - 10) + '%';
        sparkle.style.animationDelay = Math.random() * 0.5 + 's';
        sparkle.style.width = (Math.random() * 4 + 2) + 'px';
        sparkle.style.height = sparkle.style.width;

        const colors = ['#FFD700', '#FF69B4', '#FFF'];
        sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];

        wrapper.appendChild(sparkle);

        setTimeout(() => {
            if (sparkle.parentNode) sparkle.remove();
        }, 1500);
    }, 200);
}

// ===== SCREEN TRANSITIONS =====
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
    }
    currentScreen = screenId.replace('screen-', '');
}

// ===== SCREEN 1 -> SCREEN 2 (Cat) =====
function goToCat() {
    keyListenerActive = false;
    showScreen('screen-cat');
    animateCat();
}

// ===== CAT ANIMATION =====
function animateCat() {
    const catContainer = document.getElementById('cat-container');
    const screenWidth = window.innerWidth;
    let startPos = -200;
    let endPos = screenWidth + 200;
    let current = startPos;
    const speed = 3;
    let heartInterval;

    // Drop heart trail
    heartInterval = setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('cat-trail-heart');
        const hearts = ['\u{1F497}', '\u2764', '\u{1F493}'];
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = (current + 60) + 'px';
        heart.style.top = (catContainer.offsetTop - 20) + 'px';
        heart.style.position = 'fixed';
        heart.style.color = ['#FF69B4', '#FF1744', '#FFD700'][Math.floor(Math.random() * 3)];
        document.getElementById('screen-cat').appendChild(heart);

        setTimeout(() => {
            if (heart.parentNode) heart.remove();
        }, 1500);
    }, 150);

    function moveCat() {
        current += speed;
        catContainer.style.left = current + 'px';

        if (current < endPos) {
            requestAnimationFrame(moveCat);
        } else {
            clearInterval(heartInterval);
            // Transition to question screen
            setTimeout(() => {
                showScreen('screen-question');
                createFloatingHearts();
            }, 300);
        }
    }

    requestAnimationFrame(moveCat);
}

// ===== FLOATING HEARTS (Screen 3) =====
function createFloatingHearts() {
    const container = document.getElementById('floating-hearts');
    const hearts = ['\u2764', '\u{1F493}', '\u{1F497}', '\u2665'];

    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.classList.add('float-heart');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = Math.random() * 100 + '%';
        heart.style.animationDelay = (Math.random() * 5) + 's';
        heart.style.animationDuration = (Math.random() * 4 + 6) + 's';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
        container.appendChild(heart);
    }
}

// ===== NO BUTTON ESCAPE =====
function setupNoButton() {
    const btnNo = document.getElementById('btn-no');
    const card = document.querySelector('.question-card');

    let escapeCount = 0;
    const messages = [
        'No',
        '¿Segura?',
        'Piénsalo bien...',
        '¡No me hagas esto!',
        '😿',
        'Intenta otra vez',
        '¡Por favor!',
        '💔',
        '¡No es una opción!',
        'Solo di que sí ❤️'
    ];

    function moveButton(e) {
        e.preventDefault();
        e.stopPropagation();

        escapeCount++;
        btnNo.textContent = messages[Math.min(escapeCount, messages.length - 1)];

        const cardRect = card.getBoundingClientRect();
        const btnRect = btnNo.getBoundingClientRect();

        // Calculate random position within the card bounds
        const maxX = cardRect.width - btnRect.width - 20;
        const maxY = cardRect.height - btnRect.height - 20;

        let newX, newY;
        let attempts = 0;

        // Make sure it moves far enough from current position
        do {
            newX = Math.random() * maxX + 10;
            newY = Math.random() * maxY + 10;
            attempts++;
        } while (
            attempts < 10 &&
            Math.abs(newX - (btnRect.left - cardRect.left)) < 50 &&
            Math.abs(newY - (btnRect.top - cardRect.top)) < 50
        );

        btnNo.style.position = 'absolute';
        btnNo.style.left = newX + 'px';
        btnNo.style.top = newY + 'px';
        btnNo.style.zIndex = '100';

        // Grow the yes button a little each time
        const yesBtn = document.getElementById('btn-yes');
        const currentScale = 1 + escapeCount * 0.05;
        yesBtn.style.transform = `scale(${Math.min(currentScale, 1.4)})`;
    }

    btnNo.addEventListener('mouseover', moveButton);
    btnNo.addEventListener('touchstart', moveButton, { passive: false });
    btnNo.addEventListener('click', moveButton);
}

// ===== YES BUTTON =====
function setupYesButton() {
    const btnYes = document.getElementById('btn-yes');

    btnYes.addEventListener('click', () => {
        showScreen('screen-thanks');
        launchConfetti();
        launchHeartBurst();
    });
}

// ===== CONFETTI =====
function launchConfetti() {
    const container = document.getElementById('confetti-container');
    const colors = ['#FFD700', '#FF69B4', '#FF1744', '#FFB6C1', '#E91E63', '#FFC107', '#FF4081'];
    const shapes = ['heart', 'circle', 'square'];

    function createPiece() {
        const piece = document.createElement('div');
        piece.classList.add('confetti-piece');

        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 10 + 5;

        if (shape === 'heart') {
            piece.textContent = '\u2764';
            piece.style.fontSize = size + 'px';
            piece.style.color = color;
        } else {
            piece.style.width = size + 'px';
            piece.style.height = size + 'px';
            piece.style.background = color;
            if (shape === 'circle') piece.style.borderRadius = '50%';
        }

        piece.style.left = Math.random() * 100 + '%';
        piece.style.animationDuration = (Math.random() * 3 + 2) + 's';
        piece.style.animationDelay = Math.random() * 2 + 's';

        container.appendChild(piece);

        setTimeout(() => {
            if (piece.parentNode) piece.remove();
        }, 6000);
    }

    // Burst of confetti
    for (let i = 0; i < 80; i++) {
        setTimeout(createPiece, i * 50);
    }

    // Continuous confetti
    const confettiInterval = setInterval(() => {
        for (let i = 0; i < 5; i++) {
            createPiece();
        }
    }, 500);

    // Stop after 10 seconds
    setTimeout(() => clearInterval(confettiInterval), 10000);
}

// ===== HEART BURST =====
function launchHeartBurst() {
    const container = document.getElementById('thanks-burst');
    const hearts = ['\u2764', '\u{1F493}', '\u{1F496}', '\u{1F497}', '\u2665'];
    const colors = ['#FF1744', '#FF69B4', '#FFD700', '#FFB6C1'];

    for (let i = 0; i < 30; i++) {
        const heart = document.createElement('div');
        heart.classList.add('burst-heart');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.color = colors[Math.floor(Math.random() * colors.length)];

        const angle = (Math.PI * 2 / 30) * i;
        const distance = Math.random() * 200 + 100;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        heart.style.setProperty('--tx', tx + 'px');
        heart.style.setProperty('--ty', ty + 'px');
        heart.style.animation = `burstOut 2s ease-out forwards`;
        heart.style.animationDelay = (Math.random() * 0.5) + 's';

        // Override animation with inline transform for direction
        heart.animate([
            { transform: 'translate(0, 0) scale(0)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) scale(1.5)`, opacity: 0 }
        ], {
            duration: 2000,
            easing: 'ease-out',
            delay: Math.random() * 500,
            fill: 'forwards'
        });

        container.appendChild(heart);
    }
}

// ===== KEYBOARD LISTENER =====
function setupKeyListener() {
    // Delay to prevent auto-triggering on page load/reload
    setTimeout(() => {
        keyListenerActive = true;

        document.addEventListener('keydown', (e) => {
            if (keyListenerActive && currentScreen === 'landing') {
                goToCat();
            }
        });

        // Also allow touch/click on mobile for screen 1
        document.getElementById('screen-landing').addEventListener('click', () => {
            if (keyListenerActive && currentScreen === 'landing') {
                goToCat();
            }
        });
    }, 1500);
}

// ===== INIT =====
function init() {
    createFallingHearts();
    createSparkles();
    setupKeyListener();
    setupNoButton();
    setupYesButton();
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
