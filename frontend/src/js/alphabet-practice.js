// Alphabet Practice Quiz
class AlphabetQuiz {
    constructor() {
        // Updated alphabet based on available images in public/image/alphabet_prac/
        // Available: A, B, C, D, E, G, H, I, K, L, M, N, P, Q, R, S, T, U, V, X, Y, Đ
        this.alphabet = ['A', 'B', 'C', 'D', 'E', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y', 'Đ'];
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answered = false;

        this.init();
    }

    init() {
        // Generate all questions
        this.generateQuestions();

        // Display first question
        this.displayQuestion();
    }

    generateQuestions() {
        // Shuffle alphabet for random order
        this.questions = this.shuffleArray([...this.alphabet]);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    displayQuestion() {
        const currentLetter = this.questions[this.currentQuestionIndex];

        // Update image display
        const imgElement = document.getElementById('alphabet-image');
        imgElement.src = `public/image/alphabet_prac/${currentLetter}.png`;
        imgElement.alt = `Hand sign for letter ${currentLetter}`;

        // Update question counter
        document.getElementById('current-question').textContent = this.currentQuestionIndex + 1;
        document.getElementById('total-questions').textContent = this.questions.length;

        // Generate options
        const options = this.generateOptions(currentLetter);

        // Display options
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';

        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.onclick = () => this.checkAnswer(option, currentLetter, button);
            optionsContainer.appendChild(button);
        });

        // Reset state
        this.answered = false;
        document.getElementById('feedback').textContent = '';
        document.getElementById('feedback').className = 'feedback';
        document.getElementById('next-btn').style.display = 'none';

        // Reset image animation if any (optional)
        imgElement.style.animation = 'none';
        imgElement.offsetHeight; /* trigger reflow */
        imgElement.style.animation = null;
    }

    generateOptions(correctAnswer) {
        const options = [correctAnswer];

        // Generate 3 random wrong answers
        while (options.length < 4) {
            const randomLetter = this.alphabet[Math.floor(Math.random() * this.alphabet.length)];
            if (!options.includes(randomLetter)) {
                options.push(randomLetter);
            }
        }

        // Shuffle options
        return this.shuffleArray(options);
    }

    checkAnswer(selectedAnswer, correctAnswer, button) {
        if (this.answered) return;

        this.answered = true;
        const feedback = document.getElementById('feedback');
        const allButtons = document.querySelectorAll('.option-btn');
        const correctSound = document.getElementById('sound-correct');
        const wrongSound = document.getElementById('sound-wrong');

        // Disable all buttons
        allButtons.forEach(btn => btn.disabled = true);

        if (selectedAnswer === correctAnswer) {
            // Correct answer
            button.classList.add('correct');
            feedback.textContent = '✓ Chính xác!';
            feedback.className = 'feedback correct';
            this.score++;
            document.getElementById('score').textContent = this.score;

            // Play correct sound
            if (correctSound) {
                correctSound.currentTime = 0;
                correctSound.play().catch(e => console.log('Audio play failed:', e));
            }

            // Trigger confetti
            this.triggerConfetti();

        } else {
            // Wrong answer
            button.classList.add('wrong');
            feedback.textContent = `✗ Sai mất rồi! Đáp án đúng là: ${correctAnswer}`;
            feedback.className = 'feedback wrong';

            // Play wrong sound
            if (wrongSound) {
                wrongSound.currentTime = 0;
                wrongSound.play().catch(e => console.log('Audio play failed:', e));
            }

            // Highlight correct answer
            allButtons.forEach(btn => {
                if (btn.textContent === correctAnswer) {
                    btn.classList.add('correct');
                    // Add checkmark to correct answer as requested
                    const checkMark = document.createElement('span');
                    checkMark.textContent = ' ✓';
                    btn.appendChild(checkMark);
                }
            });
        }

        // Show next button
        document.getElementById('next-btn').style.display = 'inline-block';
    }

    triggerConfetti() {
        // Check if confetti lib is loaded
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#667eea', '#764ba2', '#ffeb3b', '#ff4081']
            });

            // Fire from sides as requested
            var end = Date.now() + (1 * 1000);

            (function frame() {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#667eea', '#764ba2']
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#667eea', '#764ba2']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        }
    }

    nextQuestion() {
        this.currentQuestionIndex++;

        if (this.currentQuestionIndex < this.questions.length) {
            this.displayQuestion();
        } else {
            this.showCompletion();
        }
    }

    showCompletion() {
        document.getElementById('quiz-content').style.display = 'none';
        document.getElementById('completion-screen').style.display = 'block';

        const percentage = Math.round((this.score / this.questions.length) * 100);

        document.getElementById('final-score').textContent = this.score;
        document.getElementById('final-total').textContent = this.questions.length;
        document.getElementById('percentage').textContent = percentage;
    }

    restart() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answered = false;

        document.getElementById('score').textContent = this.score;
        document.getElementById('quiz-content').style.display = 'block';
        document.getElementById('completion-screen').style.display = 'none';

        this.generateQuestions();
        this.displayQuestion();
    }
}

// Initialize quiz
let quiz;

document.addEventListener('DOMContentLoaded', () => {
    quiz = new AlphabetQuiz();
});

function nextQuestion() {
    quiz.nextQuestion();
}

function restartQuiz() {
    quiz.restart();
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Number keys 1-4
    if (['1', '2', '3', '4'].includes(e.key)) {
        const index = parseInt(e.key) - 1;
        const buttons = document.querySelectorAll('.option-btn');
        if (buttons[index] && !buttons[index].disabled) {
            buttons[index].click();
        }
    }

    // Enter key
    if (e.key === 'Enter') {
        const nextBtn = document.getElementById('next-btn');
        const completionScreen = document.getElementById('completion-screen');

        // If next button is visible, click it
        if (nextBtn && nextBtn.style.display !== 'none' && nextBtn.offsetParent !== null) {
            nextBtn.click();
        }
        // If completion screen is visible/active? Actually nextBtn is inside quiz-content which is hidden on completion.
        // But for completion screen buttons, maybe just focus specific ones? 
        // The user said "Enter to next question", let's stick to that primarily.
        // Usually user might want to restart with Enter if finished
        else if (completionScreen && completionScreen.style.display !== 'none') {
            restartQuiz();
        }
    }
});
