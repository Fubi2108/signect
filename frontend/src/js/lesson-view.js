document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const topicId = urlParams.get('topic') || '1';
    const lessonListElement = document.getElementById('lesson-list');
    const mainVideo = document.getElementById('main-video');
    const lessonNameDisplay = document.getElementById('lesson-name');
    const topicTitleDisplay = document.getElementById('topic-title');

    // Topic names mapping
    const topicNames = {
        '1': 'Chủ đề 1: Chào hỏi',
        '2': 'Chủ đề 2: Gia đình',
        '3': 'Chủ đề 3: Ăn uống',
        '4': 'Chủ đề 4: Số đếm'
    };

    // Embedded lesson data to avoid CORS issues
    const allLessons = {
        '1': [
            { "name": "Chào", "ref": "public/lessons/topic_1_ref/Chào.mp4" },
            { "name": "Cảm ơn", "ref": "public/lessons/topic_1_ref/Cảm ơn.mp4" },
            { "name": "Gặp", "ref": "public/lessons/topic_1_ref/Gặp.mp4" },
            { "name": "Hẹn gặp lại", "ref": "public/lessons/topic_1_ref/Hẹn gặp lại.mp4" },
            { "name": "Tôi sống ở...", "ref": "public/lessons/topic_1_ref/Tôi sống ở... .mp4" },
            { "name": "Tạm biệt", "ref": "public/lessons/topic_1_ref/Tạm biệt.mp4" },
            { "name": "Tôi tên ...", "ref": "public/lessons/topic_1_ref/Tôi tên ... .mp4" },
            { "name": "Tuổi tôi là...", "ref": "public/lessons/topic_1_ref/Tuổi tôi là... .mp4" },
            { "name": "Rất vui được gặp bạn", "ref": "public/lessons/topic_1_ref/Rất vui được gặp bạn.mp4" },
            { "name": "Xin lỗi", "ref": "public/lessons/topic_1_ref/Xin lỗi.mp4" }
        ],
        '2': [
            { "name": "cha", "ref": "public/lessons/topic_2_ref/cha.mp4" },
            { "name": "con", "ref": "public/lessons/topic_2_ref/com.mp4" },
            { "name": "con gái", "ref": "public/lessons/topic_2_ref/congai.mp4" },
            { "name": "con trai", "ref": "public/lessons/topic_2_ref/contrai.mp4" },
            { "name": "gia đình", "ref": "public/lessons/topic_2_ref/giadinh.mp4" },
            { "name": "mẹ", "ref": "public/lessons/topic_2_ref/me.mp4" },
            { "name": "nhà", "ref": "public/lessons/topic_2_ref/nha.mp4" }
        ],
        '3': [
            { "name": "ăn", "ref": "public/lessons/topic_3_ref/an.mp4" },
            { "name": "bánh mì", "ref": "public/lessons/topic_3_ref/banhmi.mp4" },
            { "name": "khát nước", "ref": "public/lessons/topic_3_ref/khat.mp4" },
            { "name": "nước", "ref": "public/lessons/topic_3_ref/nuoc.mp4" },
            { "name": "súp", "ref": "public/lessons/topic_3_ref/sup.mp4" },
            { "name": "trà", "ref": "public/lessons/topic_3_ref/tra.mp4" },
            { "name": "uống", "ref": "public/lessons/topic_3_ref/uong.mp4" }
        ],
        '4': []  // Topic 4 to be added later
    };

    topicTitleDisplay.innerText = topicNames[topicId] || `Chủ đề ${topicId}`;

    // Load lesson data from embedded data
    const lessons = allLessons[topicId] || [];

    // Initialize progress circle
    let progressCircle = null;
    let currentLesson = null;

    // Get current user
    const currentUser = authSystem ? authSystem.getCurrentUser() : null;

    if (lessons.length > 0) {
        // Initialize progress circle
        if (currentUser && progressTracker) {
            const percentage = progressTracker.getCompletionPercentage(currentUser.id, topicId);
            progressCircle = new ProgressCircle('progress-circle-container', percentage);
        } else {
            // Show 0% if not logged in
            progressCircle = new ProgressCircle('progress-circle-container', 0);
        }

        renderLessonList(lessons);

        // Check for 'video' parameter in URL to deep link
        const videoParam = urlParams.get('video');
        let initialLesson = lessons[0];

        if (videoParam) {
            // Decoding URI component just in case
            const decodedName = decodeURIComponent(videoParam).toLowerCase();
            const foundLesson = lessons.find(l => l.name.toLowerCase() === decodedName);
            if (foundLesson) {
                initialLesson = foundLesson;
            }
        }

        loadLesson(initialLesson);

        // Helper to highlight correct item on load
        setTimeout(() => {
            const currentIndex = lessons.findIndex(l => l.name === initialLesson.name);
            const lessonItems = document.querySelectorAll('.lesson-item');
            if (lessonItems[currentIndex]) {
                updateActiveState(lessonItems[currentIndex]);
            }
        }, 100);

    } else {
        lessonListElement.innerHTML = '<p style="padding: 20px;">Chưa có bài học nào.</p>';
    }

    function renderLessonList(lessons) {
        lessonListElement.innerHTML = '';
        lessons.forEach((lesson, index) => {
            const item = document.createElement('div');
            item.className = 'lesson-item';

            // Check if lesson is completed
            const isCompleted = currentUser && progressTracker ?
                progressTracker.isLessonCompleted(currentUser.id, topicId, lesson.name) : false;

            item.innerHTML = `
                <span class="material-symbols-outlined status-icon" style="${isCompleted ? 'color: #4CAF50;' : ''}">
                    ${isCompleted ? 'check_circle' : 'play_circle'}
                </span>
                <div style="flex-grow: 1;">
                    <div style="font-weight: 500;">${lesson.name}</div>
                    <div style="font-size: 0.8rem; opacity: 0.7;">Bài học ${index + 1}</div>
                </div>
            `;

            if (isCompleted) {
                item.style.opacity = '0.8';
            }

            item.onclick = () => {
                loadLesson(lesson);
                updateActiveState(item);
            };
            lessonListElement.appendChild(item);

            // Set first item as active by default
            if (index === 0) item.classList.add('active');
        });
    }

    function loadLesson(lesson) {
        currentLesson = lesson;
        mainVideo.src = lesson.ref;
        mainVideo.play();
        lessonNameDisplay.innerText = lesson.name;

        // Add video event listeners for progress tracking
        if (currentUser && progressTracker) {
            // Remove old listeners
            mainVideo.removeEventListener('timeupdate', handleVideoProgress);

            // Add new listener
            mainVideo.addEventListener('timeupdate', handleVideoProgress);
        }
    }

    // Track video progress - mark as complete when user watches 90%+
    function handleVideoProgress() {
        if (!currentLesson || !currentUser || !progressTracker) return;

        const duration = mainVideo.duration;
        const currentTime = mainVideo.currentTime;

        // Check if user has watched 90% of the video
        if (duration > 0 && (currentTime / duration) >= 0.9) {
            // Check if not already completed
            if (!progressTracker.isLessonCompleted(currentUser.id, topicId, currentLesson.name)) {
                // Mark as completed
                const progress = progressTracker.markLessonComplete(
                    currentUser.id,
                    topicId,
                    currentLesson.name,
                    lessons.length
                );

                // Update progress circle
                if (progressCircle) {
                    progressCircle.update(progress.percentage);
                }

                // Re-render lesson list to show checkmark
                renderLessonList(lessons);

                // Find and re-activate current lesson
                const lessonItems = document.querySelectorAll('.lesson-item');
                const currentIndex = lessons.findIndex(l => l.name === currentLesson.name);
                if (lessonItems[currentIndex]) {
                    updateActiveState(lessonItems[currentIndex]);
                }
            }
        }
    }

    function updateActiveState(activeItem) {
        document.querySelectorAll('.lesson-item').forEach(item => {
            item.classList.remove('active');
        });
        activeItem.classList.add('active');
    }
});
