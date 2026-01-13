// Progress Tracking Module
class ProgressTracker {
    constructor() {
        this.progressData = this.loadProgress();
    }

    // Load progress from localStorage
    loadProgress() {
        const data = localStorage.getItem('userProgress');
        return data ? JSON.parse(data) : {};
    }

    // Save progress to localStorage
    saveProgress() {
        localStorage.setItem('userProgress', JSON.stringify(this.progressData));
    }

    // Get user's progress for a specific topic
    getTopicProgress(userId, topicId) {
        if (!this.progressData[userId]) {
            this.progressData[userId] = {};
        }
        if (!this.progressData[userId][topicId]) {
            this.progressData[userId][topicId] = {
                completedLessons: [],
                percentage: 0
            };
        }
        return this.progressData[userId][topicId];
    }

    // Mark a lesson as completed
    markLessonComplete(userId, topicId, lessonName, totalLessons) {
        const progress = this.getTopicProgress(userId, topicId);

        // Add lesson to completed list if not already there
        if (!progress.completedLessons.includes(lessonName)) {
            progress.completedLessons.push(lessonName);
        }

        // Calculate percentage
        progress.percentage = Math.round((progress.completedLessons.length / totalLessons) * 100);

        this.saveProgress();
        return progress;
    }

    // Check if a lesson is completed
    isLessonCompleted(userId, topicId, lessonName) {
        const progress = this.getTopicProgress(userId, topicId);
        return progress.completedLessons.includes(lessonName);
    }

    // Get completion percentage for a topic
    getCompletionPercentage(userId, topicId) {
        const progress = this.getTopicProgress(userId, topicId);
        return progress.percentage;
    }

    // Get all completed lessons for a topic
    getCompletedLessons(userId, topicId) {
        const progress = this.getTopicProgress(userId, topicId);
        return progress.completedLessons;
    }

    // Reset progress for a topic
    resetTopicProgress(userId, topicId) {
        if (this.progressData[userId]) {
            this.progressData[userId][topicId] = {
                completedLessons: [],
                percentage: 0
            };
            this.saveProgress();
        }
    }
}

// Initialize progress tracker
const progressTracker = new ProgressTracker();

// Progress Circle Component
class ProgressCircle {
    constructor(containerId, percentage = 0) {
        this.container = document.getElementById(containerId);
        this.percentage = percentage;
        this.render();
    }

    render() {
        if (!this.container) return;

        const radius = 35;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (this.percentage / 100) * circumference;

        this.container.innerHTML = `
            <div style="position: relative; width: 90px; height: 90px;">
                <svg width="90" height="90" style="transform: rotate(-90deg);">
                    <!-- Background circle -->
                    <circle
                        cx="45"
                        cy="45"
                        r="${radius}"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.3)"
                        stroke-width="6"
                    />
                    <!-- Progress circle -->
                    <circle
                        cx="45"
                        cy="45"
                        r="${radius}"
                        fill="none"
                        stroke="url(#gradient)"
                        stroke-width="6"
                        stroke-dasharray="${circumference}"
                        stroke-dashoffset="${offset}"
                        stroke-linecap="round"
                        style="transition: stroke-dashoffset 0.5s ease;"
                    />
                    <!-- Gradient definition -->
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                </svg>
                <!-- Percentage text -->
                <div style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-family: 'Lexend', sans-serif;
                    font-weight: 700;
                    color: #211C46;
                    text-align: center;
                ">
                    <div style="font-size: 18px;">${this.percentage}%</div>
                    <div style="font-size: 9px; opacity: 0.7; margin-top: -2px;">Hoàn thành</div>
                </div>
            </div>
        `;
    }

    update(percentage) {
        this.percentage = percentage;
        this.render();
    }
}
