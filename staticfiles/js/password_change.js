// password_change.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize password visibility toggles
    initPasswordToggles();
    
    // Initialize password strength meter
    initPasswordStrengthMeter();
    
    // Add ripple effect to buttons
    initRippleEffect();
    
    // Initialize tooltips if Bootstrap is available
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    // Add subtle parallax effect for decorations
    initParallaxEffect();
});

// Initialize password visibility toggle buttons
function initPasswordToggles() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const eyeIcon = this.querySelector('.eye-icon');
            const eyeSlashIcon = this.querySelector('.eye-slash-icon');
            
            if (input.type === 'password') {
                input.type = 'text';
                eyeIcon.classList.add('d-none');
                eyeSlashIcon.classList.remove('d-none');
            } else {
                input.type = 'password';
                eyeIcon.classList.remove('d-none');
                eyeSlashIcon.classList.add('d-none');
            }
        });
    });
}

// Initialize password strength meter and validation
function initPasswordStrengthMeter() {
    const newPasswordInput = document.querySelector('input[name="new_password1"]');
    const confirmPasswordInput = document.querySelector('input[name="new_password2"]');
    
    if (!newPasswordInput) return;
    
    const strengthSegments = document.querySelectorAll('.strength-segment');
    const strengthText = document.querySelector('.strength-text');
    const tipLength = document.getElementById('tip-length');
    const tipUppercase = document.getElementById('tip-uppercase');
    const tipLowercase = document.getElementById('tip-lowercase');
    const tipNumber = document.getElementById('tip-number');
    const tipSpecial = document.getElementById('tip-special');
    
    newPasswordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        
        updateStrengthMeter(strength);
        updatePasswordTips(password);
    });
    
    // Check if passwords match when confirming
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            const password = newPasswordInput.value;
            const confirmPassword = this.value;
            
            if (confirmPassword && password !== confirmPassword) {
                confirmPasswordInput.classList.add('is-invalid');
            } else {
                confirmPasswordInput.classList.remove('is-invalid');
            }
        });
    }
    
    function calculatePasswordStrength(password) {
        if (!password) return 0;
        
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength += 1;
        if (password.length >= 12) strength += 1;
        
        // Character type checks
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        // Normalize to 0-4 scale
        return Math.min(4, Math.floor(strength / 1.5));
    }
    
    function updateStrengthMeter(strength) {
        // Reset all segments
        strengthSegments.forEach(segment => {
            segment.classList.remove('active');
        });
        
        // Activate segments based on strength
        for (let i = 0; i < strength; i++) {
            strengthSegments[i].classList.add('active');
        }
        
        // Update text based on strength
        switch(strength) {
            case 0:
                strengthText.textContent = 'Type a new password';
                strengthText.style.color = '';
                break;
            case 1:
                strengthText.textContent = 'Weak - too simple';
                strengthText.style.color = 'var(--danger-color)';
                break;
            case 2:
                strengthText.textContent = 'Fair - could be stronger';
                strengthText.style.color = 'var(--warning-color)';
                break;
            case 3:
                strengthText.textContent = 'Good - strong password';
                strengthText.style.color = 'var(--primary-color)';
                break;
            case 4:
                strengthText.textContent = 'Excellent - very strong password';
                strengthText.style.color = 'var(--success-color)';
                break;
        }
    }
    
    function updatePasswordTips(password) {
        // Length check
        if (password.length >= 8) {
            tipLength.classList.add('valid');
        } else {
            tipLength.classList.remove('valid');
        }
        
        // Uppercase check
        if (/[A-Z]/.test(password)) {
            tipUppercase.classList.add('valid');
        } else {
            tipUppercase.classList.remove('valid');
        }
        
        // Lowercase check
        if (/[a-z]/.test(password)) {
            tipLowercase.classList.add('valid');
        } else {
            tipLowercase.classList.remove('valid');
        }
        
        // Number check
        if (/[0-9]/.test(password)) {
            tipNumber.classList.add('valid');
        } else {
            tipNumber.classList.remove('valid');
        }
        
        // Special character check
        if (/[^A-Za-z0-9]/.test(password)) {
            tipSpecial.classList.add('valid');
        } else {
            tipSpecial.classList.remove('valid');
        }
    }
}

// Add ripple effect to buttons
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn-submit, .btn-cancel');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple element
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            // Get coordinates
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Set position
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            // Remove ripple after animation completes
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add parallax effect to decorative elements
function initParallaxEffect() {
    const decorations = document.querySelectorAll('.decoration');
    
    document.addEventListener('mousemove', function(e) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const moveX = (e.clientX - centerX) / 30;
        const moveY = (e.clientY - centerY) / 30;
        
        decorations.forEach((decoration, index) => {
            const factor = (index + 1) * 0.5;
            decoration.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
        });
    });
}

// Create additional form validation effects
document.addEventListener('DOMContentLoaded', function() {
    const formInputs = document.querySelectorAll('.custom-form-field input');
    
    formInputs.forEach(input => {
        // Add active state when input is focused
        input.addEventListener('focus', function() {
            this.parentElement.parentElement.classList.add('field-active');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.parentElement.classList.remove('field-active');
        });
        
        // Show animation when first filling out fields
        input.addEventListener('input', function() {
            if (this.value.length === 1) {
                animateInput(this);
            }
        });
    });
    
    function animateInput(input) {
        // Add and then remove animation class
        input.classList.add('input-pulse');
        
        setTimeout(() => {
            input.classList.remove('input-pulse');
        }, 500);
    }
    
    // Add custom style for field active state and animation
    const style = document.createElement('style');
    style.textContent = `
        .field-active input {
            border-color: var(--primary-light);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }
        
        .input-pulse {
            animation: pulse-border 0.5s ease-in-out;
        }
        
        @keyframes pulse-border {
            0% {
                border-color: var(--primary-light);
                box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
            }
            70% {
                border-color: var(--primary-color);
                box-shadow: 0 0 0 5px rgba(99, 102, 241, 0);
            }
            100% {
                border-color: var(--primary-light);
                box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
            }
        }
    `;
    
    document.head.appendChild(style);
});