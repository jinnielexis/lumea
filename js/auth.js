/* ========================================
 LUMEA COSMETICS - AUTHENTICATION (COMPLETE)
 ======================================== */

const LumeaAuth = {
    // 1. USER REGISTRATION (To Database)
    handleSignUp: async function (event) {
        event.preventDefault();
        const form = event.target;
        const name = form.querySelector('#fullName').value.trim();
        const email = form.querySelector('#email').value.trim();
        const password = form.querySelector('#password').value;
        const confirmPassword = form.querySelector('#confirmPassword').value;
        const termsAccepted = form.querySelector('#terms').checked;

        // Validation using LumeaUtils from your main.js
        if (!LumeaUtils.Validator.match(password, confirmPassword)) {
            LumeaUtils.Toast.show('Passwords do not match', 'error');
            return;
        }
        if (password.length < 8) {
            LumeaUtils.Toast.show('Password must be at least 8 characters', 'error');
            return;
        }
        if (!termsAccepted) {
            LumeaUtils.Toast.show('Please accept terms and conditions', 'error');
            return;
        }

        try {
            const response = await fetch('../api/auth/signup', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name, email, password})
            });

            const result = await response.json();

            if (response.ok && result.success) {
                LumeaUtils.Toast.show('Registration successful! Please sign in.', 'success');
                setTimeout(() => {
                    window.location.href = 'signin.html';
                }, 2000);
            } else {
                LumeaUtils.Toast.show(result.message || 'Registration failed', 'error');
            }
        } catch (error) {
            LumeaUtils.Toast.show("Connection error. Is the server running?", "error");
        }
    },

    // 2. USER SIGN IN (To Database)
    handleSignIn: async function (event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('../api/auth/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password})
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Save to Storage using your LumeaUtils helper
                LumeaUtils.Storage.set('currentUser', {name: result.userName, role: result.role});

                LumeaUtils.Toast.show(`Welcome back, ${result.userName}!`, 'success');
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1500);
            } else {
                LumeaUtils.Toast.show(result.message || "Invalid Credentials", 'error');
            }
        } catch (error) {
            LumeaUtils.Toast.show("Server connection failed", "error");
        }
    },

    // 3. ADMIN SIGN IN (Logic from your previous code)
    handleAdminSignIn: function (event) {
        event.preventDefault();
        const form = event.target;
        const email = form.querySelector('#adminEmail').value.trim();
        const password = form.querySelector('#adminPassword').value;

        const ADMIN_EMAIL = 'admin@lumea.com';
        const ADMIN_PASSWORD = 'admin123';

        if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
            LumeaUtils.Toast.show('Invalid admin credentials', 'error');
            return;
        }

        LumeaUtils.Storage.set('currentAdmin', {email, role: 'admin', name: 'Admin'});
        LumeaUtils.Toast.show('Admin login successful!', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    },

    // 4. OTP / VERIFICATION UI LOGIC
    setupOTPInputs: function () {
        const inputs = document.querySelectorAll('.otp-input');
        inputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value.length === 1 && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    inputs[index - 1].focus();
                }
            });
        });
    },

    handleForgotPassword: function () {
        const email = prompt('Enter your email address:');
        if (email)
            LumeaUtils.Toast.show('Password reset link sent!', 'success');
    }
};

// Export to Global Window so HTML can see LumeaAuth.handleSignUp etc.
window.LumeaAuth = LumeaAuth;

// Auto-init OTP if elements exist
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.otp-input')) {
        LumeaAuth.setupOTPInputs();
    }
});