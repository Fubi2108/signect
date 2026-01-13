// Alphabet Practice Quiz
class AlphabetQuiz {
    constructor() {
        this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
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

        // Update letter display
        document.getElementById('alphabet-letter').textContent = currentLetter;

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

        // Disable all buttons
        allButtons.forEach(btn => btn.disabled = true);

        if (selectedAnswer === correctAnswer) {
            // Correct answer
            button.classList.add('correct');
            feedback.textContent = '✓ Chính xác!';
            feedback.className = 'feedback correct';
            this.score++;
            document.getElementById('score').textContent = this.score;
        } else {
            // Wrong answer
            button.classList.add('wrong');
            feedback.textContent = `✗ Sai rồi! Đáp án đúng là: ${correctAnswer}`;
            feedback.className = 'feedback wrong';

            // Highlight correct answer
            allButtons.forEach(btn => {
                if (btn.textContent === correctAnswer) {
                    btn.classList.add('correct');
                }
            });
        }

        // Show next button
        document.getElementById('next-btn').style.display = 'inline-block';
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
