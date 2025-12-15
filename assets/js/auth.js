// BLACKONN Authentication Utilities
// GitHub Pages compatible authentication system

class BlackonnAuth {
    constructor() {
        this.ADMIN_EMAIL = 'Arunava458@gmail.com';
        this.ADMIN_PASSWORD = '9732@Piku';
        this.SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
        this.MAX_LOGIN_ATTEMPTS = 5;
        this.LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
    }

    // Generate unique session token
    generateSessionToken() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 12);
    }

    // Generate password reset token
    generateResetToken() {
        return 'reset_' + Date.now() + '_' + Math.random().toString(36).substr(2, 16);
    }

    // Hash password (basic implementation for demo - use proper hashing in production)
    hashPassword(password) {
        // In production, use proper password hashing like bcrypt
        return btoa(password + 'blackonn_salt_2025');
    }

    // Verify password
    verifyPassword(plainPassword, hashedPassword) {
        return this.hashPassword(plainPassword) === hashedPassword;
    }

    // Check if admin credentials
    isAdminCredentials(email, password) {
        return email.toLowerCase() === this.ADMIN_EMAIL.toLowerCase() && password === this.ADMIN_PASSWORD;
    }

    // Get current user
    getCurrentUser() {
        try {
            const user = JSON.parse(localStorage.getItem('blackonn_user'));
            return user && user.loggedIn ? user : null;
        } catch (e) {
            return null;
        }
    }

    // Get admin auth status
    getAdminAuth() {
        try {
            return JSON.parse(localStorage.getItem('blackonn_admin_auth') || 'null');
        } catch (e) {
            return null;
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        const user = this.getCurrentUser();
        const adminAuth = this.getAdminAuth();

        if (adminAuth && adminAuth.loggedIn) {
            return { authenticated: true, role: 'admin', user: adminAuth };
        }

        if (user && user.loggedIn) {
            // Validate session
            if (this.validateSession(user)) {
                return { authenticated: true, role: 'customer', user: user };
            } else {
                // Session invalid, logout
                this.logout();
                return { authenticated: false };
            }
        }

        return { authenticated: false };
    }

    // Validate user session
    validateSession(user) {
        if (!user.sessionToken) return false;

        try {
            const storedUsers = JSON.parse(localStorage.getItem('blackonn_users') || '[]');
            const storedUser = storedUsers.find(u => u.id === user.id);

            if (!storedUser || storedUser.sessionToken !== user.sessionToken) {
                return false;
            }

            // Check session expiry
            const loginTime = new Date(user.loginTime || user.lastLogin);
            const now = new Date();
            const timeDiff = now - loginTime;

            return timeDiff < this.SESSION_TIMEOUT;
        } catch (e) {
            return false;
        }
    }

    // Login user
    async login(email, password) {
        try {
            // Check admin login
            if (this.isAdminCredentials(email, password)) {
                const adminUser = {
                    id: 'admin',
                    email: this.ADMIN_EMAIL,
                    name: 'Arunava',
                    role: 'admin',
                    loggedIn: true,
                    loginTime: new Date().toISOString(),
                    sessionToken: this.generateSessionToken()
                };

                localStorage.setItem('blackonn_user', JSON.stringify(adminUser));
                localStorage.setItem('blackonn_admin_auth', JSON.stringify({
                    email: this.ADMIN_EMAIL,
                    loggedIn: true,
                    token: adminUser.sessionToken,
                    loginTime: adminUser.loginTime
                }));

                // Log admin login
                this.logAdminActivity('login', { email: this.ADMIN_EMAIL });

                return { success: true, user: adminUser, role: 'admin' };
            }

            // Check regular user login
            const storedUsers = JSON.parse(localStorage.getItem('blackonn_users') || '[]');
            const user = storedUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (!user) {
                return { success: false, error: 'Account not found' };
            }

            // Check if account is locked
            if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
                const remainingTime = Math.ceil((new Date(user.lockedUntil) - new Date()) / 1000 / 60);
                return { success: false, error: `Account locked for ${remainingTime} minutes` };
            }

            // Verify password
            if (!this.verifyPassword(password, user.password)) {
                // Increment failed attempts
                user.failedAttempts = (user.failedAttempts || 0) + 1;

                if (user.failedAttempts >= this.MAX_LOGIN_ATTEMPTS) {
                    user.lockedUntil = new Date(Date.now() + this.LOCKOUT_DURATION).toISOString();
                    user.failedAttempts = 0;
                }

                // Update user data
                const userIndex = storedUsers.findIndex(u => u.id === user.id);
                storedUsers[userIndex] = user;
                localStorage.setItem('blackonn_users', JSON.stringify(storedUsers));

                const attemptsLeft = this.MAX_LOGIN_ATTEMPTS - user.failedAttempts;
                return {
                    success: false,
                    error: attemptsLeft > 0 ? `Invalid password. ${attemptsLeft} attempts remaining.` : 'Account locked for 15 minutes'
                };
            }

            // Successful login - reset failed attempts
            user.failedAttempts = 0;
            user.lockedUntil = null;
            user.lastLogin = new Date().toISOString();
            user.sessionToken = this.generateSessionToken();

            // Update user data
            const userIndex = storedUsers.findIndex(u => u.id === user.id);
            storedUsers[userIndex] = user;
            localStorage.setItem('blackonn_users', JSON.stringify(storedUsers));

            // Set current session
            const sessionUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                loggedIn: true,
                loginTime: user.lastLogin,
                sessionToken: user.sessionToken
            };
            localStorage.setItem('blackonn_user', JSON.stringify(sessionUser));

            // Log login activity
            this.logUserActivity(user.id, 'login', { email: user.email });

            return { success: true, user: sessionUser, role: 'customer' };

        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Login failed. Please try again.' };
        }
    }

    // Register new user
    async register(userData) {
        try {
            const { name, email, password, phone } = userData;

            const storedUsers = JSON.parse(localStorage.getItem('blackonn_users') || '[]');

            // Check if email exists
            if (storedUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
                return { success: false, error: 'Email already registered' };
            }

            // Create new user
            const newUser = {
                id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8),
                name: name.trim(),
                email: email.toLowerCase().trim(),
                phone: phone ? phone.trim() : '',
                password: this.hashPassword(password),
                role: 'customer',
                createdAt: new Date().toISOString(),
                lastLogin: null,
                failedAttempts: 0,
                lockedUntil: null,
                sessionToken: null,
                profileComplete: false,
                emailVerified: false,
                preferences: {
                    newsletter: true,
                    notifications: true
                }
            };

            storedUsers.push(newUser);
            localStorage.setItem('blackonn_users', JSON.stringify(storedUsers));

            // Auto login after registration
            const sessionUser = {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role,
                loggedIn: true,
                loginTime: new Date().toISOString(),
                sessionToken: this.generateSessionToken()
            };

            // Update session token in stored user
            newUser.sessionToken = sessionUser.sessionToken;
            const userIndex = storedUsers.findIndex(u => u.id === newUser.id);
            storedUsers[userIndex] = newUser;
            localStorage.setItem('blackonn_users', JSON.stringify(storedUsers));

            localStorage.setItem('blackonn_user', JSON.stringify(sessionUser));

            // Log registration
            this.logUserActivity(newUser.id, 'register', { email: newUser.email });

            return { success: true, user: sessionUser };

        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: 'Registration failed. Please try again.' };
        }
    }

    // Logout user
    logout() {
        try {
            const user = this.getCurrentUser();
            if (user) {
                this.logUserActivity(user.id, 'logout', { email: user.email });
            }

            localStorage.removeItem('blackonn_user');
            localStorage.removeItem('blackonn_admin_auth');

            // Clear any session-specific data
            sessionStorage.clear();

            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: 'Logout failed' };
        }
    }

    // Request password reset
    async requestPasswordReset(email) {
        try {
            const storedUsers = JSON.parse(localStorage.getItem('blackonn_users') || '[]');
            const user = storedUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (!user) {
                // Don't reveal if email exists or not for security
                return { success: true, message: 'If an account with this email exists, a reset link has been sent.' };
            }

            // Generate reset token
            const resetToken = this.generateResetToken();
            const resetExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

            // Store reset request
            const resetRequests = JSON.parse(localStorage.getItem('blackonn_password_resets') || '[]');
            resetRequests.push({
                email: email.toLowerCase(),
                token: resetToken,
                expiry: resetExpiry.toISOString(),
                used: false,
                createdAt: new Date().toISOString()
            });

            // Keep only recent reset requests (last 24 hours)
            const recentResets = resetRequests.filter(r =>
                new Date(r.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
            );
            localStorage.setItem('blackonn_password_resets', JSON.stringify(recentResets));

            // Log reset request
            this.logUserActivity(user.id, 'password_reset_requested', { email: user.email });

            // In production, send email here
            console.log(`Password reset token for ${email}: ${resetToken}`);

            return {
                success: true,
                message: 'Reset token generated',
                token: resetToken, // For demo purposes
                email: email
            };

        } catch (error) {
            console.error('Password reset request error:', error);
            return { success: false, error: 'Failed to process reset request' };
        }
    }

    // Reset password with token
    async resetPassword(token, newPassword) {
        try {
            const resetRequests = JSON.parse(localStorage.getItem('blackonn_password_resets') || '[]');
            const validRequest = resetRequests.find(r =>
                r.token === token &&
                !r.used &&
                new Date(r.expiry) > new Date()
            );

            if (!validRequest) {
                return { success: false, error: 'Invalid or expired reset token' };
            }

            // Update user password
            const storedUsers = JSON.parse(localStorage.getItem('blackonn_users') || '[]');
            const userIndex = storedUsers.findIndex(u => u.email.toLowerCase() === validRequest.email);

            if (userIndex === -1) {
                return { success: false, error: 'User not found' };
            }

            storedUsers[userIndex].password = this.hashPassword(newPassword);
            storedUsers[userIndex].passwordLastChanged = new Date().toISOString();
            localStorage.setItem('blackonn_users', JSON.stringify(storedUsers));

            // Mark reset token as used
            validRequest.used = true;
            validRequest.usedAt = new Date().toISOString();
            localStorage.setItem('blackonn_password_resets', JSON.stringify(resetRequests));

            // Log password change
            this.logUserActivity(storedUsers[userIndex].id, 'password_changed', { email: validRequest.email });

            return { success: true, message: 'Password updated successfully' };

        } catch (error) {
            console.error('Password reset error:', error);
            return { success: false, error: 'Failed to reset password' };
        }
    }

    // Update user profile
    async updateProfile(userId, updates) {
        try {
            const storedUsers = JSON.parse(localStorage.getItem('blackonn_users') || '[]');
            const userIndex = storedUsers.findIndex(u => u.id === userId);

            if (userIndex === -1) {
                return { success: false, error: 'User not found' };
            }

            // Update allowed fields
            const allowedUpdates = ['name', 'phone', 'preferences'];
            allowedUpdates.forEach(field => {
                if (updates[field] !== undefined) {
                    storedUsers[userIndex][field] = updates[field];
                }
            });

            storedUsers[userIndex].updatedAt = new Date().toISOString();
            localStorage.setItem('blackonn_users', JSON.stringify(storedUsers));

            // Update current session
            const currentUser = this.getCurrentUser();
            if (currentUser && currentUser.id === userId) {
                Object.assign(currentUser, updates);
                localStorage.setItem('blackonn_user', JSON.stringify(currentUser));
            }

            return { success: true, user: storedUsers[userIndex] };

        } catch (error) {
            console.error('Profile update error:', error);
            return { success: false, error: 'Failed to update profile' };
        }
    }

    // Activity logging
    logUserActivity(userId, action, details = {}) {
        try {
            const activityLog = JSON.parse(localStorage.getItem('blackonn_user_activity') || '[]');
            activityLog.push({
                userId,
                action,
                details,
                timestamp: new Date().toISOString(),
                ip: 'client-side',
                userAgent: navigator.userAgent
            });

            // Keep last 1000 activities
            localStorage.setItem('blackonn_user_activity', JSON.stringify(activityLog.slice(-1000)));
        } catch (e) {
            // Silently fail logging
        }
    }

    logAdminActivity(action, details = {}) {
        try {
            const activityLog = JSON.parse(localStorage.getItem('blackonn_admin_activity') || '[]');
            activityLog.push({
                action,
                details,
                timestamp: new Date().toISOString(),
                ip: 'client-side',
                userAgent: navigator.userAgent
            });

            // Keep last 500 activities
            localStorage.setItem('blackonn_admin_activity', JSON.stringify(activityLog.slice(-500)));
        } catch (e) {
            // Silently fail logging
        }
    }

    // Utility methods
    requireAuth(redirectTo = 'login.html') {
        const auth = this.isAuthenticated();
        if (!auth.authenticated) {
            window.location.href = redirectTo;
            return false;
        }
        return auth;
    }

    requireAdminAuth(redirectTo = 'login.html') {
        const auth = this.isAuthenticated();
        if (!auth.authenticated || auth.role !== 'admin') {
            window.location.href = redirectTo;
            return false;
        }
        return auth;
    }

    redirectIfAuthenticated(redirectTo = 'profile.html') {
        const auth = this.isAuthenticated();
        if (auth.authenticated) {
            if (auth.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = redirectTo;
            }
            return true;
        }
        return false;
    }
}

// Create global instance
window.blackonnAuth = new BlackonnAuth();