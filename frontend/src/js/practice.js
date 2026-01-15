document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const topicId = urlParams.get('topic') || '1';

    const questionMedia = document.getElementById('question-media');
    const optionsGrid = document.getElementById('options-grid');
    const scoreElement = document.getElementById('current-score');
    const topicTitleElement = document.getElementById('topic-title');

    let lessonsData = [];
    let currentScore = 0;
    let isAnswering = false;

    // Topic names mapping (copied from lesson-view.js for consistency)
    const topicNames = {
        '1': 'Chủ đề 1: Chào hỏi',
        '2': 'Chủ đề 2: Gia đình',
        '3': 'Chủ đề 3: Ăn uống',
        '4': 'Chủ đề 4: Số đếm'
    };

    topicTitleElement.innerText = topicNames[topicId] || `Chủ đề ${topicId}`;

    // Fetch data
    fetch(`public/lessons/topic${topicId}.json`)
        .then(res => res.json())
        .then(data => {
            // Filter out metadata if exists
            lessonsData = data.filter(item => item.name !== 'topic');
            if (lessonsData.length < 4) {
                alert("Không đủ dữ liệu để tạo câu hỏi!");
                return;
            }
            nextQuestion();
        })
        .catch(err => {
            console.error(err);
            optionsGrid.innerHTML = '<p>Lỗi tải dữ liệu bài học.</p>';
        });

    function nextQuestion() {
        isAnswering = true;
        optionsGrid.innerHTML = ''; // Clear old buttons

        // 1. Pick correct answer
        const correctIndex = Math.floor(Math.random() * lessonsData.length);
        const correctLesson = lessonsData[correctIndex];

        // 2. Set Question Media (Video)
        questionMedia.src = correctLesson.ref;
        questionMedia.play().catch(e => console.log("Autoplay prevented"));

        // 3. Pick 3 distractors
        let options = [correctLesson];
        while (options.length < 4) {
            const randomIdx = Math.floor(Math.random() * lessonsData.length);
            const randomLesson = lessonsData[randomIdx];
            // Ensure unique options
            if (!options.some(opt => opt.name === randomLesson.name)) {
                options.push(randomLesson);
            }
        }

        // 4. Shuffle options
        options = shuffleArray(options);

        // 5. Render buttons
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = opt.name;

            btn.onclick = () => {
                if (!isAnswering) return; // Prevent double clicks

                if (opt.name === correctLesson.name) {
                    // Correct
                    btn.classList.add('correct');
                    currentScore++;
                    scoreElement.innerText = currentScore;
                    playSound(true);
                } else {
                    // Wrong
                    btn.classList.add('wrong');
                    playSound(false);
                    // Highlight the correct one
                    const correctBtn = Array.from(optionsGrid.children).find(b => b.innerText === correctLesson.name);
                    if (correctBtn) correctBtn.classList.add('correct');
                }

                isAnswering = false;

                // Wait 2 seconds then next question
                setTimeout(() => {
                    nextQuestion();
                }, 2000);
            };

            optionsGrid.appendChild(btn);
        });
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function playSound(isCorrect) {
        // Optional: Add sound effects here if requested later
    }
});
