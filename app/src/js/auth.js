// Authentication Module
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check if user is already logged in
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUIForLoggedInUser();
        }
    }

    // Simple hash function (for demo purposes - in production use proper encryption)
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }

    // Get all users from localStorage
    getAllUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    // Save users to localStorage
    saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Sign Up
    signUp(username, email, password) {
        const users = this.getAllUsers();

        // Check if username or email already exists
        const existingUser = users.find(u => u.username === username || u.email === email);
        if (existingUser) {
            return { success: false, message: 'Tên đăng nhập hoặc email đã tồn tại!' };
        }

        // Validate inputs
        if (!username || !email || !password) {
            return { success: false, message: 'Vui lòng điền đầy đủ thông tin!' };
        }

        if (password.length < 6) {
            return { success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự!' };
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password: this.simpleHash(password),
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };

        users.push(newUser);
        this.saveUsers(users);

        // Auto login after signup
        this.currentUser = { id: newUser.id, username: newUser.username, email: newUser.email };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.updateUIForLoggedInUser();

        return { success: true, message: 'Đăng ký thành công!' };
    }

    // Sign In
    signIn(usernameOrEmail, password) {
        const users = this.getAllUsers();

        if (!usernameOrEmail || !password) {
            return { success: false, message: 'Vui lòng điền đầy đủ thông tin!' };
        }

        const hashedPassword = this.simpleHash(password);
        const user = users.find(u =>
            (u.username === usernameOrEmail || u.email === usernameOrEmail) &&
            u.password === hashedPassword
        );

        if (!user) {
            return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng!' };
        }

        // Update last login
        user.lastLogin = new Date().toISOString();
        this.saveUsers(users);

        // Set current user
        this.currentUser = { id: user.id, username: user.username, email: user.email };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.updateUIForLoggedInUser();

        return { success: true, message: 'Đăng nhập thành công!' };
    }

    // Sign Out
    signOut() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateUIForLoggedOutUser();
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Update UI for logged in user
    updateUIForLoggedInUser() {
        const signInBtn = document.getElementById('sign-in-btn');
        if (signInBtn && this.currentUser) {
            signInBtn.innerHTML = `
                <span style="margin-right: 8px;">👤 ${this.currentUser.username}</span>
                <span style="font-size: 0.8em; opacity: 0.8;">▼</span>
            `;
            signInBtn.onclick = () => this.showUserMenu();
        }
    }

    // Update UI for logged out user
    updateUIForLoggedOutUser() {
        const signInBtn = document.getElementById('sign-in-btn');
        if (signInBtn) {
            signInBtn.textContent = 'Sign In';
            signInBtn.onclick = () => this.showAuthModal();
        }
    }

    // Show user menu (dropdown)
    showUserMenu() {
        const existingMenu = document.getElementById('user-menu-dropdown');
        if (existingMenu) {
            existingMenu.remove();
            return;
        }

        const menu = document.createElement('div');
        menu.id = 'user-menu-dropdown';
        menu.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 15px;
            padding: 10px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            min-width: 180px;
            border: 1px solid rgba(255, 255, 255, 0.3);
        `;

        menu.innerHTML = `
            <div style="padding: 12px; border-bottom: 1px solid rgba(33, 28, 70, 0.1); color: #211C46; font-weight: 600;">
                ${this.currentUser.username}
            </div>
            <div style="padding: 8px; color: #211C46; font-size: 0.85em; opacity: 0.7;">
                ${this.currentUser.email}
            </div>
            <button id="sign-out-btn" style="
                width: 100%;
                padding: 10px;
                margin-top: 8px;
                background: #FF97A4;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-family: 'Lexend', sans-serif;
                font-weight: 600;
                transition: all 0.3s;
            ">Đăng xuất</button>
        `;

        document.body.appendChild(menu);

        // Sign out button
        document.getElementById('sign-out-btn').onclick = () => {
            this.signOut();
            menu.remove();
            // Close auth modal if open
            const modal = document.getElementById('auth-modal');
            if (modal) modal.style.display = 'none';
        };

        // Close menu when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target) && e.target.id !== 'sign-in-btn') {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 100);
    }

    // Show auth modal
    showAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }
}

// Initialize auth system
const authSystem = new AuthSystem();

// Modal control functions
function showAuthModal() {
    document.getElementById('auth-modal').style.display = 'flex';
}

function closeAuthModal() {
    document.getElementById('auth-modal').style.display = 'none';
    clearAuthForms();
}

function clearAuthForms() {
    document.getElementById('signin-username').value = '';
    document.getElementById('signin-password').value = '';
    document.getElementById('signup-username').value = '';
    document.getElementById('signup-email').value = '';
    document.getElementById('signup-password').value = '';
    document.getElementById('signup-confirm-password').value = '';

    const messages = document.querySelectorAll('.auth-message');
    messages.forEach(msg => msg.textContent = '');
}

function switchTab(tab) {
    const signinTab = document.getElementById('signin-tab');
    const signupTab = document.getElementById('signup-tab');
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');

    if (tab === 'signin') {
        signinTab.classList.add('active');
        signupTab.classList.remove('active');
        signinForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        signupTab.classList.add('active');
        signinTab.classList.remove('active');
        signupForm.style.display = 'block';
        signinForm.style.display = 'none';
    }
    clearAuthForms();
}

function handleSignIn(event) {
    event.preventDefault();
    const username = document.getElementById('signin-username').value;
    const password = document.getElementById('signin-password').value;
    const messageEl = document.getElementById('signin-message');

    const result = authSystem.signIn(username, password);
    messageEl.textContent = result.message;
    messageEl.style.color = result.success ? '#4CAF50' : '#f44336';

    if (result.success) {
        setTimeout(() => {
            closeAuthModal();
        }, 1000);
    }
}

function handleSignUp(event) {
    event.preventDefault();
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const messageEl = document.getElementById('signup-message');

    if (password !== confirmPassword) {
        messageEl.textContent = 'Mật khẩu xác nhận không khớp!';
        messageEl.style.color = '#f44336';
        return;
    }

    const result = authSystem.signUp(username, email, password);
    messageEl.textContent = result.message;
    messageEl.style.color = result.success ? '#4CAF50' : '#f44336';

    if (result.success) {
        setTimeout(() => {
            closeAuthModal();
        }, 1000);
    }
}

// Close modal when clicking outside
window.onclick = function (event) {
    const modal = document.getElementById('auth-modal');
    if (event.target === modal) {
        closeAuthModal();
    }
}
