function toggleForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const forgotForm = document.getElementById('forgotPasswordForm');
    const resetForm = document.getElementById('resetPasswordForm');

    loginForm.classList.toggle('active');
    registerForm.classList.toggle('active');
    forgotForm.classList.remove('active');
    resetForm.classList.remove('active');
}

function showForgotForm() {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('forgotPasswordForm').classList.add('active');
}

function backToLogin() {
    document.getElementById('forgotPasswordForm').classList.remove('active');
    document.getElementById('resetPasswordForm').classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
}

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('Login successful!');

        if (user.role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'catalog.html';
        }
    } else {
        alert('Invalid email or password');
    }
}

function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.find(u => u.email === email)) {
        alert('Email already registered');
        return;
    }

    const newUser = {
        id: Date.now(),
        username,
        email,
        password,
        role: 'customer'
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Registration successful! Please login.');
    document.getElementById('registerForm').reset();
    toggleForm();
}

function handleForgotPassword(event) {
    event.preventDefault();

    const email = document.getElementById('forgotEmail').value;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email);

    if (user) {
        const resetToken = {
            email: email,
            token: Math.random().toString(36).substring(7),
            expiresAt: Date.now() + 3600000
        };
        localStorage.setItem('resetToken', JSON.stringify(resetToken));

        alert('Password reset link has been sent to your email. You can now set a new password.');
        document.getElementById('forgotPasswordForm').classList.remove('active');
        document.getElementById('resetPasswordForm').classList.add('active');
    } else {
        alert('Email not found in our records');
    }
}

function handleResetPassword(event) {
    event.preventDefault();

    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;

    if (newPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    const resetToken = JSON.parse(localStorage.getItem('resetToken') || 'null');

    if (!resetToken || resetToken.expiresAt < Date.now()) {
        alert('Reset link has expired. Please try again.');
        backToLogin();
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.email === resetToken.email);

    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.removeItem('resetToken');

        alert('Password has been reset successfully. Please login with your new password.');
        backToLogin();
    }
}

if (!localStorage.getItem('users')) {
    const defaultUsers = [
        {
            id: 1,
            username: 'admin',
            email: 'admin@bookverse.com',
            password: 'admin123',
            role: 'admin'
        }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
}
