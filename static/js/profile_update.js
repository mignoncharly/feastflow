// Profile Update JavaScript - FeastFlow Modern Design

document.addEventListener('DOMContentLoaded', function() {
    // Initialize profile picture preview and upload
    initProfilePictureUpload();
    
    // Initialize character counter for bio
    initBioCharacterCounter();
    
    // Add ripple effect to buttons
    addButtonRippleEffect();
    
    // Add form validation
    initFormValidation();
    
    // Add animations and interactive elements
    enhanceUserExperience();
});

/**
 * Initializes profile picture upload and preview functionality
 */
function initProfilePictureUpload() {
    const fileInput = document.querySelector('input[type="file"]');
    const previewContainer = document.querySelector('.picture-preview');
    const removeButton = document.getElementById('removeImage');
    const fileNameDisplay = document.querySelector('.file-name');
    const fileSizeDisplay = document.querySelector('.file-size');
    
    if (!fileInput || !previewContainer) return;
    
    // Handle file selection
    fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            const reader = new FileReader();
            
            // Update file info
            fileNameDisplay.textContent = file.name;
            fileSizeDisplay.textContent = formatFileSize(file.size);
            
            reader.onload = function(e) {
                // Check if preview already contains an image
                let previewImage = previewContainer.querySelector('img');
                
                if (!previewImage) {
                    // If no image exists, create one
                    previewImage = document.createElement('img');
                    previewImage.id = 'previewImage';
                    
                    // Clear any placeholder content
                    previewContainer.innerHTML = '';
                    previewContainer.appendChild(previewImage);
                }
                
                // Set image source with fade-in animation
                previewImage.style.opacity = '0';
                previewImage.src = e.target.result;
                
                // Fade in the new image
                setTimeout(() => {
                    previewImage.style.opacity = '1';
                    previewImage.style.transition = 'opacity 0.3s ease';
                }, 50);
                
                // Add pulse animation to preview container
                previewContainer.classList.add('pulse-animation');
                setTimeout(() => {
                    previewContainer.classList.remove('pulse-animation');
                }, 2000);
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Handle remove button click
    if (removeButton) {
        removeButton.addEventListener('click', function() {
            // Check if there's an existing image
            const currentImage = previewContainer.querySelector('img');
            
            if (currentImage) {
                // Create placeholder content
                const placeholder = document.createElement('div');
                placeholder.className = 'preview-placeholder';
                placeholder.innerHTML = `
                    <i class="fas fa-user"></i>
                    <span>${getUserInitial()}</span>
                `;
                
                // Fade out current image
                currentImage.style.opacity = '0';
                
                // Replace with placeholder after fade out
                setTimeout(() => {
                    previewContainer.innerHTML = '';
                    previewContainer.appendChild(placeholder);
                    
                    // Reset file input
                    fileInput.value = '';
                    fileNameDisplay.textContent = 'No file selected';
                    fileSizeDisplay.textContent = '';
                }, 300);
            }
        });
    }
    
    /**
     * Gets the user's initial from the page
     * @returns {string} - User's initial or 'U' if not found
     */
    function getUserInitial() {
        // Try to get initial from existing placeholder
        const existingPlaceholder = document.querySelector('.preview-placeholder span');
        if (existingPlaceholder) {
            return existingPlaceholder.textContent;
        }
        
        // Default to 'U' if no initial is found
        return 'U';
    }
    
    /**
     * Formats file size in KB or MB
     * @param {number} bytes - File size in bytes
     * @returns {string} - Formatted file size
     */
    function formatFileSize(bytes) {
        if (bytes < 1024) {
            return bytes + ' bytes';
        } else if (bytes < 1048576) {
            return (bytes / 1024).toFixed(1) + ' KB';
        } else {
            return (bytes / 1048576).toFixed(1) + ' MB';
        }
    }
}

/**
 * Initializes character counter for bio textarea
 */
function initBioCharacterCounter() {
    const bioTextarea = document.getElementById('id_bio');
    const counter = document.getElementById('bioCounter');
    const maxCount = document.getElementById('bioMax');
    
    if (!bioTextarea || !counter || !maxCount) return;
    
    // Set initial count
    const maxLength = parseInt(maxCount.textContent) || 300;
    counter.textContent = bioTextarea.value.length;
    
    // Update counter on input
    bioTextarea.addEventListener('input', function() {
        const currentLength = this.value.length;
        counter.textContent = currentLength;
        
        // Apply styling based on character count
        if (currentLength > maxLength) {
            counter.style.color = 'var(--error-color)';
            counter.style.fontWeight = '700';
        } else if (currentLength > maxLength * 0.8) {
            counter.style.color = 'var(--warning-color)';
            counter.style.fontWeight = '700';
        } else {
            counter.style.color = '';
            counter.style.fontWeight = '';
        }
    });
}

/**
 * Adds ripple effect to buttons
 */
function addButtonRippleEffect() {
    const buttons = document.querySelectorAll('.btn, .upload-btn, .action-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

/**
 * Initializes form validation
 */
function initFormValidation() {
    const form = document.querySelector('.update-form');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        let isValid = true;
        
        // Basic validation for required fields
        const requiredFields = form.querySelectorAll('input[required], textarea[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                e.preventDefault();
                showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                removeFieldError(field);
            }
        });
        
        // Email validation
        const emailField = document.getElementById('id_email');
        if (emailField && emailField.value.trim() && !isValidEmail(emailField.value.trim())) {
            e.preventDefault();
            showFieldError(emailField, 'Please enter a valid email address');
            isValid = false;
        }
        
        // If valid, show loading state on submit button
        if (isValid) {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.classList.add('loading-btn');
                submitButton.disabled = true;
            }
        }
    });
    
    /**
     * Shows field error message
     * @param {HTMLElement} field - The field with error
     * @param {string} message - Error message
     */
    function showFieldError(field, message) {
        // Remove any existing error
        removeFieldError(field);
        
        // Add error styling to field
        field.style.borderColor = 'var(--error-color)';
        
        // Create error element
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i>${message}`;
        
        // Add error after field
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            formGroup.appendChild(errorElement);
        }
        
        // Add shake animation
        field.classList.add('shake');
        setTimeout(() => {
            field.classList.remove('shake');
        }, 500);
    }
    
    /**
     * Removes field error
     * @param {HTMLElement} field - The field to remove error from
     */
    function removeFieldError(field) {
        // Reset field styling
        field.style.borderColor = '';
        
        // Remove error element
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            const errorElement = formGroup.querySelector('.field-error');
            if (errorElement) {
                formGroup.removeChild(errorElement);
            }
        }
    }
    
    /**
     * Validates email format
     * @param {string} email - Email to validate
     * @returns {boolean} - Whether email is valid
     */
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
    }
    
    // Add shake animation keyframes dynamically
    const style = document.createElement('style');
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
            border-color: var(--error-color) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Enhances user experience with additional animations and effects
 */
function enhanceUserExperience() {
    // Animate form elements on load
    animateFormElements();
    
    // Add focus effects to form inputs
    addFormFieldEffects();
    
    // Add hover effects to interactive elements
    addHoverEffects();
}

/**
 * Animates form elements on page load
 */
function animateFormElements() {
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
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
            animation: fadeInUp 0.5s ease forwards;
        }
    `;
    document.head.appendChild(style);
    
    // Elements to animate
    const elements = [
        '.update-title',
        '.update-subtitle',
        '.profile-picture-section',
        '.basic-info-section',
        '.additional-info-section',
        '.form-actions'
    ];
    
    // Apply animations with staggered delay
    elements.forEach((selector, index) => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100 + (index * 100));
        }
    });
}

/**
 * Adds focus effects to form fields
 */
function addFormFieldEffects() {
    const formFields = document.querySelectorAll('input, textarea');
    
    formFields.forEach(field => {
        // Add focus effect
        field.addEventListener('focus', function() {
            this.closest('.form-group').style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 0 0 3px rgba(74, 144, 226, 0.2)';
        });
        
        // Remove focus effect
        field.addEventListener('blur', function() {
            this.closest('.form-group').style.transform = '';
            if (!this.matches(':focus-visible')) {
                this.style.boxShadow = '';
            }
        });
    });
}

/**
 * Adds hover effects to interactive elements
 */
function addHoverEffects() {
    // Profile picture hover effect
    const profilePicture = document.querySelector('.picture-preview');
    if (profilePicture) {
        profilePicture.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });
        
        profilePicture.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    }
}