// Register Page JavaScript - FeastFlow Modern Design

document.addEventListener('DOMContentLoaded', function() {
    // Initialize multi-step form
    initMultiStepForm();
    
    // Initialize password toggles
    initPasswordToggles();
    
    // Initialize password strength meter
    initPasswordStrengthMeter();
    
    // Initialize password matching validation
    initPasswordMatchValidation();
    
    // Add button ripple effects
    addButtonRippleEffect();
    
    // Initialize account type selection
    initAccountTypeSelection();
    
    // Form validation
    initFormValidation();

    // Function to handle server-side errors
    handleServerSideErrors();
});

/**
 * Handles server-side errors returned from Django
 */
function handleServerSideErrors() {
    // Check if there are any server-side errors
    const usernameError = document.querySelector('#id_username_error');
    const emailError = document.querySelector('#id_email_error');
    const password1Error = document.querySelector('#id_password1_error');
    const password2Error = document.querySelector('#id_password2_error');
    
    // If there are any errors, navigate to the appropriate step
    if (usernameError || emailError) {
        // Username/email errors are in step 2
        showStep(2);
    } else if (password1Error || password2Error) {
        // Password errors are in step 3
        showStep(3);
    }
}

/**
 * Shows a specific step in the form
 * @param {number} stepNumber - The step to show
 */
function showStep(stepNumber) {
    // Hide all steps
    const formSteps = document.querySelectorAll('.form-step');
    formSteps.forEach(step => {
        step.classList.remove('active');
    });
    
    // Show the specified step
    const targetStep = document.getElementById(`step${stepNumber}`);
    if (targetStep) {
        targetStep.classList.add('active');
    }
    
    // Update progress steps
    updateProgressSteps(stepNumber);
}
/**
 * Initializes multi-step form functionality
 */
function initMultiStepForm() {
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressConnectors = document.querySelectorAll('.progress-connector');
    const formSteps = document.querySelectorAll('.form-step');
    
    // Next button handler
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = parseInt(this.closest('.form-step').id.replace('step', '')); 
            const targetStep = parseInt(this.dataset.toStep);
            
            // Validate current step before proceeding
            if (!validateStep(currentStep)) {
                shakeInvalidFields();
                return;
            }
            
            // Update form steps
            formSteps.forEach(step => {
                step.classList.remove('active');
            });
            
            const nextStep = document.getElementById(`step${targetStep}`); 
            if (nextStep) {
                nextStep.classList.add('active');
            }
            
            // Update progress steps
            updateProgressSteps(targetStep);
        });
    });
    
    // Previous button handler
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetStep = parseInt(this.dataset.toStep);
            
            // Update form steps
            formSteps.forEach(step => {
                step.classList.remove('active');
            });
            
            const prevStep = document.getElementById(`step${targetStep}`);
            if (prevStep) {
                prevStep.classList.add('active');
            }
            
            // Update progress steps
            updateProgressSteps(targetStep);
        });
    });
    
    /**
     * Updates progress steps based on current step
     * @param {number} currentStep - The current step number
     */
    function updateProgressSteps(currentStep) {
        progressSteps.forEach((step, index) => {
            const stepNumber = parseInt(step.dataset.step);
            
            // Reset all steps
            step.classList.remove('active', 'completed');
            
            // Mark completed steps
            if (stepNumber < currentStep) {
                step.classList.add('completed');
            }
            
            // Mark current step as active
            if (stepNumber === currentStep) {
                step.classList.add('active');
            }
        });
        
        // Update connectors
        progressConnectors.forEach((connector, index) => {
            // Reset all connectors
            connector.classList.remove('half-complete', 'complete');
            
            // Current step is the second step (index 1)
            if (currentStep === 2) {
                if (index === 0) {
                    connector.classList.add('complete');
                } else if (index === 1) {
                    connector.classList.add('half-complete');
                }
            }
            
            // Current step is the third step (index 2)
            if (currentStep === 3) {
                connector.classList.add('complete');
            }
        });
    }
}

/**
 * Initializes password toggle functionality
 */
function initPasswordToggles() {
    const toggleButtons = document.querySelectorAll('.password-toggle');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordField = this.closest('.password-field').querySelector('input');
            
            // Toggle password field type
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            
            // Toggle icon
            const icon = this.querySelector('i');
            if (type === 'text') {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

/**
 * Initializes password strength meter
 */
function initPasswordStrengthMeter() {
    const passwordField = document.getElementById('id_password1');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthValue = document.querySelector('.strength-value');
    const requirements = document.querySelectorAll('.requirement');
    
    if (!passwordField || !strengthBar || !strengthValue) return;
    
    passwordField.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        
        // Update the strength meter
        updateStrengthMeter(strength);
        
        // Update requirements
        updateRequirements(password);
    });
    
    /**
     * Calculates password strength
     * @param {string} password - The password to check
     * @returns {number} - Strength from 0 to 4
     */
    function calculatePasswordStrength(password) {
        let strength = 0;
        
        // Length check
        if (password.length >= 8) {
            strength += 1;
        }
        
        // Character type checks
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        return Math.min(4, strength);
    }
    
    /**
     * Updates the strength meter visual
     * @param {number} strength - Password strength (0-4)
     */
    function updateStrengthMeter(strength) {
        // Reset all classes
        strengthBar.className = 'strength-bar';
        strengthValue.className = 'strength-value';
        
        // Apply appropriate class based on strength
        if (strength === 0) {
            // Empty password
            strengthBar.style.width = '0';
            strengthValue.textContent = 'Too weak';
        } else if (strength === 1) {
            strengthBar.classList.add('weak');
            strengthValue.classList.add('weak');
            strengthValue.textContent = 'Weak';
        } else if (strength === 2) {
            strengthBar.classList.add('fair');
            strengthValue.classList.add('fair');
            strengthValue.textContent = 'Fair';
        } else if (strength === 3) {
            strengthBar.classList.add('good');
            strengthValue.classList.add('good');
            strengthValue.textContent = 'Good';
        } else {
            strengthBar.classList.add('strong');
            strengthValue.classList.add('strong');
            strengthValue.textContent = 'Strong';
        }
    }
    
    /**
     * Updates requirement indicators
     * @param {string} password - The password to check
     */
    function updateRequirements(password) {
        // Check each requirement
        requirements.forEach(req => {
            const requirementType = req.dataset.requirement;
            let isMet = false;
            
            switch (requirementType) {
                case 'length':
                    isMet = password.length >= 8;
                    break;
                case 'uppercase':
                    isMet = /[A-Z]/.test(password);
                    break;
                case 'lowercase':
                    isMet = /[a-z]/.test(password);
                    break;
                case 'number':
                    isMet = /[0-9]/.test(password);
                    break;
                case 'special':
                    isMet = /[^A-Za-z0-9]/.test(password);
                    break;
            }
            
            // Update the requirement visual state
            if (isMet) {
                req.classList.add('met');
                req.querySelector('i').className = 'fas fa-check-circle';
            } else {
                req.classList.remove('met');
                req.querySelector('i').className = 'fas fa-circle';
            }
        });
    }
}

/**
 * Initializes password matching validation
 */
function initPasswordMatchValidation() {
    const password1 = document.getElementById('id_password1');
    const password2 = document.getElementById('id_password2');
    const matchIndicator = document.querySelector('.password-match');
    
    if (!password1 || !password2 || !matchIndicator) return;
    
    function checkPasswordMatch() {
        if (!password2.value) {
            // Reset if confirm password is empty
            matchIndicator.classList.remove('match');
            matchIndicator.querySelector('i').className = 'fas fa-circle';
            matchIndicator.querySelector('span').textContent = 'Passwords match';
            return;
        }
        
        if (password1.value === password2.value) {
            matchIndicator.classList.add('match');
            matchIndicator.querySelector('i').className = 'fas fa-check-circle';
            matchIndicator.querySelector('span').textContent = 'Passwords match';
        } else {
            matchIndicator.classList.remove('match');
            matchIndicator.querySelector('i').className = 'fas fa-times-circle';
            matchIndicator.querySelector('span').textContent = "Passwords don't match";
        }
    }
    
    // Check on input in either field
    password1.addEventListener('input', checkPasswordMatch);
    password2.addEventListener('input', checkPasswordMatch);
}

/**
 * Adds ripple effect to buttons
 */
function addButtonRippleEffect() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple element
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.classList.add('ripple');
            
            // Add to button and remove after animation
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

/**
 * Initializes account type selection
 */
function initAccountTypeSelection() {
    const accountTypeOptions = document.querySelectorAll('.account-type-option input[type="radio"]');
    const accountTypeCards = document.querySelectorAll('.account-type-card');
    
    accountTypeOptions.forEach(option => {
        // Set initial state if pre-selected
        if (option.checked) {
            const card = option.nextElementSibling;
            if (card) card.classList.add('selected');
        }
        
        // Handle selection change
        option.addEventListener('change', function() {
            accountTypeCards.forEach(card => {
                card.classList.remove('selected');
            });
            
            if (this.checked) {
                const card = this.nextElementSibling;
                if (card) card.classList.add('selected');
            }
        });
    });
}

/**
 * Validates a specific step
 * @param {number} stepNumber - The step number to validate
 * @returns {boolean} - Whether the step is valid
 */
function validateStep(stepNumber) {
    let isValid = true;
    
    switch (stepNumber) {
        case 1:
            // Validate account type selection
            const accountTypeOptions = document.querySelectorAll('.account-type-option input[type="radio"]');
            let accountTypeSelected = false;
            
            accountTypeOptions.forEach(option => {
                if (option.checked) {
                    accountTypeSelected = true;
                }
            });
            
            if (!accountTypeSelected) {
                createFormError('Please select an account type', document.querySelector('.account-type-selection'));
                isValid = false;
            }
            break;
            
        case 2:
            // Validate profile information
            const usernameField = document.getElementById('id_username');
            const emailField = document.getElementById('id_email');
            
            if (!usernameField.value.trim()) {
                createFieldError('Username is required', usernameField);
                isValid = false;
            }
            
            if (!emailField.value.trim()) {
                createFieldError('Email address is required', emailField);
                isValid = false;
            } else if (!isValidEmail(emailField.value.trim())) {
                createFieldError('Please enter a valid email address', emailField);
                isValid = false;
            }
            break;
            
        case 3:
            // Validate password fields
            const password1Field = document.getElementById('id_password1');
            const password2Field = document.getElementById('id_password2');
            const termsCheckbox = document.getElementById('terms-checkbox');
            
            if (!password1Field.value) {
                createFieldError('Password is required', password1Field);
                isValid = false;
            } else if (password1Field.value.length < 8) {
                createFieldError('Password must be at least 8 characters long', password1Field);
                isValid = false;
            }
            
            if (!password2Field.value) {
                createFieldError('Please confirm your password', password2Field);
                isValid = false;
            } else if (password1Field.value !== password2Field.value) {
                createFieldError('Passwords do not match', password2Field);
                isValid = false;
            }
            
            if (!termsCheckbox.checked) {
                createFieldError('You must agree to the Terms of Service and Privacy Policy', termsCheckbox.parentNode);
                isValid = false;
            }
            break;
    }
    
    return isValid;
}

/**
 * Initializes form validation
 */
function initFormValidation() {
    const form = document.getElementById('registrationForm');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        // Only prevent default for initial validation
        e.preventDefault();
        
        // Validate current step
        const currentStep = document.querySelector('.form-step.active');
        const stepNumber = parseInt(currentStep.id.replace('step', ''));
        
        if (!validateStep(stepNumber)) {
            shakeInvalidFields();
            return;
        }
        
        // If it's the final step and validation passes, submit the form
        if (stepNumber === 3) {
            const submitButton = document.querySelector('.submit-btn');
            
            if (submitButton) {
                // Add loading state
                submitButton.classList.add('loading-btn');
                submitButton.disabled = true;
                
                // Submit the form for real
                form.submit();
            } else {
                form.submit();
            }
        } else {
            // If not on final step, move to next step
            const nextStep = stepNumber + 1;
            showStep(nextStep);
        }
    });
}

/**
 * Creates a field error message
 * @param {string} message - The error message
 * @param {HTMLElement} field - The field with the error
 */
function createFieldError(message, field) {
    // Remove any existing error
    removeFieldError(field);
    
    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i>${message}`;
    
    // Add error styling to field
    field.classList.add('error-field');
    field.style.borderColor = 'var(--error-color)';
    
    // Insert error after field or its container
    const fieldContainer = field.closest('.form-group, .checkbox-field');
    if (fieldContainer) {
        // Find where to insert the error
        let insertAfter = field;
        
        // If field is in a password-field container, insert after that
        const passwordField = field.closest('.password-field');
        if (passwordField) {
            insertAfter = passwordField;
        }
        
        // Insert error
        if (insertAfter.nextElementSibling) {
            fieldContainer.insertBefore(errorDiv, insertAfter.nextElementSibling);
        } else {
            fieldContainer.appendChild(errorDiv);
        }
    }
}

/**
 * Removes field error message
 * @param {HTMLElement} field - The field to remove error from
 */
function removeFieldError(field) {
    // Remove error styling
    field.classList.remove('error-field');
    field.style.borderColor = '';
    
    // Find and remove error message
    const fieldContainer = field.closest('.form-group, .checkbox-field');
    if (fieldContainer) {
        const errorDiv = fieldContainer.querySelector('.field-error');
        if (errorDiv) {
            fieldContainer.removeChild(errorDiv);
        }
    }
}

/**
 * Creates a form-level error message
 * @param {string} message - The error message
 * @param {HTMLElement} container - The container to add the error to
 */
function createFormError(message, container) {
    // Remove any existing form errors
    removeFormErrors();
    
    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i>${message}`;
    
    // Insert at the beginning of the container
    if (container.firstChild) {
        container.insertBefore(errorDiv, container.firstChild);
    } else {
        container.appendChild(errorDiv);
    }
}

/**
 * Removes all form-level errors
 */
function removeFormErrors() {
    const formErrors = document.querySelectorAll('.form-error');
    formErrors.forEach(error => {
        error.parentNode.removeChild(error);
    });
}

/**
 * Checks if an email is valid
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}

/**
 * Adds shake animation to invalid fields
 */
function shakeInvalidFields() {
    const invalidFields = document.querySelectorAll('.error-field');
    
    // Add shake animation keyframes if not already added
    if (!document.getElementById('shake-animation')) {
        const style = document.createElement('style');
        style.id = 'shake-animation';
        style.textContent = `
            @keyframes shake {
                0%, 100% {
                    transform: translateX(0);
                }
                20%, 60% {
                    transform: translateX(-5px);
                }
                40%, 80% {
                    transform: translateX(5px);
                }
            }
            
            .shake {
                animation: shake 0.5s ease;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Apply shake animation to each invalid field
    invalidFields.forEach(field => {
        field.classList.add('shake');
        
        // Remove animation class after it completes
        setTimeout(() => {
            field.classList.remove('shake');
        }, 500);
    });
}

/**
 * Enhances user experience with additional animations and effects
 */
document.addEventListener('DOMContentLoaded', function() {
    // Animate entrance of steps
    animateStepEntrance();
    
    // Add floating effect to the background
    animateBackground();
    
    // Add hover effects to cards
    addCardHoverEffects();
    
    // Add focus effects to form fields
    addFormFieldEffects();
});

/**
 * Animates step entrance
 */
function animateStepEntrance() {
    // Add animation keyframes
    const style = document.createElement('style');
    style.id = 'entrance-animations';
    style.textContent = `
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate-in {
            animation: slideInUp 0.5s ease forwards;
        }
    `;
    document.head.appendChild(style);
    
    // Apply animation to elements with staggered delay
    const animateElements = document.querySelectorAll('.step-header, .account-type-option, .form-group, .step-actions');
    
    animateElements.forEach((element, index) => {
        // Set initial state
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        // Add animation with delay
        const delay = 0.1 + (index * 0.1);
        element.style.animation = `slideInUp 0.5s ease ${delay}s forwards`;
    });
}

/**
 * Animates background elements
 */
function animateBackground() {
    // Create subtle particle animations if not already created
    if (!document.querySelector('.particle')) {
        const backdrop = document.querySelector('.animated-backdrop');
        if (backdrop) {
            for (let i = 0; i < 20; i++) {
                createBackgroundParticle(backdrop);
            }
        }
    }
}

/**
 * Creates a background particle
 * @param {HTMLElement} container - The container to add the particle to
 */
function createBackgroundParticle(container) {
    // Create particle element
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random size
    const size = Math.random() * 6 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random position
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.left = `${Math.random() * 100}%`;
    
    // Random color
    const colors = ['rgba(255, 107, 107, 0.2)', 'rgba(60, 179, 113, 0.2)', 'rgba(74, 144, 226, 0.2)'];
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Add styles
    particle.style.position = 'absolute';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    
    // Animation
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    
    if (!document.getElementById('particle-animation')) {
        const style = document.createElement('style');
        style.id = 'particle-animation';
        style.textContent = `
            @keyframes float {
                0% {
                    transform: translate(0, 0);
                }
                25% {
                    transform: translate(10px, -10px);
                }
                50% {
                    transform: translate(15px, 5px);
                }
                75% {
                    transform: translate(5px, 15px);
                }
                100% {
                    transform: translate(0, 0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
    
    // Add to container
    container.appendChild(particle);
}

/**
 * Adds hover effects to account type cards
 */
function addCardHoverEffects() {
    const cards = document.querySelectorAll('.account-type-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = '';
                this.style.boxShadow = '';
            }
        });
    });
}

/**
 * Adds focus effects to form fields
 */
function addFormFieldEffects() {
    const formInputs = document.querySelectorAll('.form-input');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentNode.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentNode.style.transform = '';
        });
    });
}