// password_reset_confirm.js

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
    
    // Add subtle parallax effect for background elements
    initParallaxEffect();
    
    // Initialize floating label animation
    initFloatingLabelAnimation();
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
    if (!newPasswordInput) return;
    
    const strengthSegments = document.querySelectorAll('.strength-segment');
    const strengthText = document.getElementById('strengthText');
    const tipLength = document.getElementById('tipLength');
    const tipUppercase = document.getElementById('tipUppercase');
    const tipLowercase = document.getElementById('tipLowercase');
    const tipNumber = document.getElementById('tipNumber');
    const tipSpecial = document.getElementById('tipSpecial');
    
    newPasswordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        
        updateStrengthMeter(strength);
        updatePasswordTips(password);
    });
    
    // Password confirmation validation
    const confirmPasswordInput = document.querySelector('input[name="new_password2"]');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            if (newPasswordInput.value !== this.value && this.value.length > 0) {
                confirmPasswordInput.style.borderColor = 'var(--danger-color)';
                
                // Add mismatch indicator if not exists
                let mismatchIndicator = document.querySelector('.mismatch-indicator');
                if (!mismatchIndicator) {
                    mismatchIndicator = document.createElement('div');
                    mismatchIndicator.classList.add('mismatch-indicator');
                    mismatchIndicator.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                        </svg>
                        <span>Passwords don't match</span>
                    `;
                    mismatchIndicator.style.color = 'var(--danger-color)';
                    mismatchIndicator.style.fontSize = '0.85rem';
                    mismatchIndicator.style.marginTop = '0.5rem';
                    mismatchIndicator.style.display = 'flex';
                    mismatchIndicator.style.alignItems = 'center';
                    mismatchIndicator.style.gap = '0.4rem';
                    this.parentElement.parentElement.appendChild(mismatchIndicator);
                }
            } else {
                confirmPasswordInput.style.borderColor = '';
                
                // Remove mismatch indicator if exists
                const mismatchIndicator = document.querySelector('.mismatch-indicator');
                if (mismatchIndicator) {
                    mismatchIndicator.remove();
                }
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
        if (strengthText) {
            switch(strength) {
                case 0:
                    strengthText.textContent = 'Type a password';
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
    }
    
    function updatePasswordTips(password) {
        if (!tipLength || !tipUppercase || !tipLowercase || !tipNumber || !tipSpecial) return;
        
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
    const buttons = document.querySelectorAll('.btn-submit, .btn-retry');
    
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
    
    // Add ripple style
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .ripple {
            position: absolute;
            background-color: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(styleElement);
}

// Add subtle parallax effect for background elements
function initParallaxEffect() {
    const container = document.querySelector('.reset-confirm-page');
    const bgElements = document.querySelectorAll('.bg-circle, .bg-line');
    
    if (container && bgElements.length) {
        container.addEventListener('mousemove', function(e) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            const moveX = (e.clientX - centerX) / 30;
            const moveY = (e.clientY - centerY) / 30;
            
            bgElements.forEach((element, index) => {
                const factor = (index + 1) * 0.5;
                
                if (element.classList.contains('bg-circle')) {
                    element.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
                } else if (element.classList.contains('bg-line')) {
                    element.style.transform = `translateY(${moveY * factor}px)`;
                }
            });
        });
    }
}

// Initialize floating label animation
function initFloatingLabelAnimation() {
    const formInputs = document.querySelectorAll('.custom-form-field input');
    
    formInputs.forEach(input => {
        // Add active state when input is focused
        input.addEventListener('focus', function() {
            this.parentElement.parentElement.classList.add('field-active');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.parentElement.classList.remove('field-active');
            
            // If field has value, add filled class
            if (this.value.trim() !== '') {
                this.parentElement.parentElement.classList.add('field-filled');
            } else {
                this.parentElement.parentElement.classList.remove('field-filled');
            }
        });
        
        // Initialize state for fields with values
        if (input.value.trim() !== '') {
            input.parentElement.parentElement.classList.add('field-filled');
        }
        
        // Add subtle animation when typing first character
        input.addEventListener('input', function() {
            if (this.value.length === 1) {
                this.classList.add('pulse-animation');
                setTimeout(() => {
                    this.classList.remove('pulse-animation');
                }, 500);
            }
        });
    });
    
    // Add custom styles for animations
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .field-active {
            z-index: 2;
        }
        
        .field-active input {
            border-color: var(--primary-light);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }
        
        .field-filled label {
            color: var(--primary-color);
        }
        
        .pulse-animation {
            animation: input-pulse 0.5s ease;
        }
        
        @keyframes input-pulse {
            0% {
                box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
            }
            70% {
                box-shadow: 0 0 0 5px rgba(99, 102, 241, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
            }
        }
    `;
    document.head.appendChild(styleElement);
}