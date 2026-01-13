// Cherry Blossom Animation
class CherryBlossomEffect {
    constructor(options = {}) {
        this.petalCount = options.petalCount || 20;
        this.container = null;
        this.init();
    }

    init() {
        // Create container
        this.container = document.createElement('div');
        this.container.className = 'cherry-blossom-container';
        document.body.appendChild(this.container);

        // Create petals
        this.createPetals();
    }

    createPetals() {
        for (let i = 0; i < this.petalCount; i++) {
            setTimeout(() => {
                this.createPetal();
            }, i * 300); // Stagger creation for natural effect
        }

        // Continuously create new petals
        setInterval(() => {
            this.createPetal();
        }, 3000);
    }

    createPetal() {
        const petal = document.createElement('div');
        petal.className = 'cherry-petal';

        // Random size
        const sizes = ['small', 'medium', 'large'];
        const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
        petal.classList.add(randomSize);

        // Random color variation
        const colors = ['pink', 'light-pink', 'white-pink'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        petal.classList.add(randomColor);

        // Random starting position (horizontal)
        const startX = Math.random() * 100;
        petal.style.left = `${startX}%`;

        // Start above the viewport
        petal.style.top = `-5%`;

        // Random animation duration (falling speed)
        const fallDuration = 8 + Math.random() * 7; // 8-15 seconds
        petal.style.animationDuration = `${fallDuration}s, ${2 + Math.random() * 2}s, ${3 + Math.random() * 4}s`;

        // Random delay
        const delay = Math.random() * 2;
        petal.style.animationDelay = `${delay}s`;

        // Random opacity
        petal.style.opacity = 0.5 + Math.random() * 0.4;

        // Add to container
        this.container.appendChild(petal);

        // Remove petal after animation completes
        setTimeout(() => {
            if (petal.parentNode) {
                petal.remove();
            }
        }, (fallDuration + delay) * 1000);
    }

    destroy() {
        if (this.container) {
            this.container.remove();
        }
    }
}

// Initialize cherry blossom effect when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Create cherry blossom effect with 20 petals
    new CherryBlossomEffect({ petalCount: 20 });
});
