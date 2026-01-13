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
            { "name": "chào", "ref": "lessons/topic_1_ref/chao.mp4" },
            { "name": "gặp", "ref": "lessons/topic_1_ref/gap.mp4" },
            { "name": "hẹn gặp lại", "ref": "lessons/topic_1_ref/hengaplai.mp4" },
            { "name": "sống", "ref": "lessons/topic_1_ref/song.mp4" },
            { "name": "tạm biệt", "ref": "lessons/topic_1_ref/tambiet.mp4" },
            { "name": "tên", "ref": "lessons/topic_1_ref/ten.mp4" },
            { "name": "tuổi", "ref": "lessons/topic_1_ref/tuoi.mp4" },
            { "name": "rất vui được gặp bạn", "ref": "lessons/topic_1_ref/vuigapban.mp4" },
            { "name": "xin lỗi", "ref": "lessons/topic_1_ref/xinloi.mp4" }
        ],
        '2': [
            { "name": "cha", "ref": "lessons/topic_2_ref/cha.mp4" },
            { "name": "con", "ref": "lessons/topic_2_ref/com.mp4" },
            { "name": "con gái", "ref": "lessons/topic_2_ref/congai.mp4" },
            { "name": "con trai", "ref": "lessons/topic_2_ref/contrai.mp4" },
            { "name": "gia đình", "ref": "lessons/topic_2_ref/giadinh.mp4" },
            { "name": "mẹ", "ref": "lessons/topic_2_ref/me.mp4" },
            { "name": "nhà", "ref": "lessons/topic_2_ref/nha.mp4" }
        ],
        '3': [
            { "name": "ăn", "ref": "lessons/topic_3_ref/an.mp4" },
            { "name": "bánh mì", "ref": "lessons/topic_3_ref/banhmi.mp4" },
            { "name": "khát nước", "ref": "lessons/topic_3_ref/khat.mp4" },
            { "name": "nước", "ref": "lessons/topic_3_ref/nuoc.mp4" },
            { "name": "súp", "ref": "lessons/topic_3_ref/sup.mp4" },
            { "name": "trà", "ref": "lessons/topic_3_ref/tra.mp4" },
            { "name": "uống", "ref": "lessons/topic_3_ref/uong.mp4" }
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
        // Initialize progress tracking if user is logged in
        if (currentUser && progressTracker) {
            const percentage = progressTracker.getCompletionPercentage(currentUser.id, topicId);
            progressCircle = new ProgressCircle('progress-circle-container', percentage);
        } else {
            // Show 0% if not logged in
            progressCircle = new ProgressCircle('progress-circle-container', 0);
        }

        renderLessonList(lessons);
        loadLesson(lessons[0]);
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
