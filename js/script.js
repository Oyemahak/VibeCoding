document.addEventListener('DOMContentLoaded', () => {
    // Game setup
    const emojis = ['❤️', '😂', '🔥', '👍', '😍', '🙏', '🎉', '🤔'];
    const cards = [...emojis, ...emojis];
    const board = document.getElementById('board');
    const movesDisplay = document.getElementById('moves');
    const timerDisplay = document.getElementById('timer');
    
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let moves = 0;
    let seconds = 0;
    let timer;
    let matchedPairs = 0;

    // Initialize game
    function initGame() {
        board.innerHTML = '';
        moves = 0;
        seconds = 0;
        matchedPairs = 0;
        movesDisplay.textContent = moves;
        timerDisplay.textContent = `${seconds}s`;
        clearInterval(timer);
        
        // Shuffle and create cards
        shuffleCards().forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.emoji = emoji;
            card.innerHTML = `
                <div class="card-face card-front">${emoji}</div>
                <div class="card-face card-back">?</div>
            `;
            card.addEventListener('click', flipCard);
            board.appendChild(card);
        });
        
        // Start timer
        timer = setInterval(() => {
            seconds++;
            timerDisplay.textContent = `${seconds}s`;
        }, 1000);
    }

    // Fisher-Yates shuffle
    function shuffleCards() {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        return cards;
    }

    // Card flip logic
    function flipCard() {
        if (lockBoard || this === firstCard || this.classList.contains('matched')) return;
        
        this.classList.add('flipped');
        
        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        
        secondCard = this;
        moves++;
        movesDisplay.textContent = moves;
        checkForMatch();
    }

    function checkForMatch() {
        const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        matchedPairs++;
        
        if (matchedPairs === emojis.length) {
            clearInterval(timer);
            triggerFireworks();
        }
        
        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    // Fireworks celebration
    function triggerFireworks() {
        for (let i = 0; i < 15; i++) {
            setTimeout(createFirework, i * 200);
        }
    }

    initGame();
});