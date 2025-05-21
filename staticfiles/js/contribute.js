// Contribute Page JavaScript - FeastFlow Modern Design

document.addEventListener('DOMContentLoaded', function() {
    // Initialize quantity input functionality
    initQuantityInput();
    
    // Initialize form validation
    initFormValidation();
    
    // Add ripple effect to buttons
    addButtonRippleEffect();
    
    // Add animations and interactive elements
    enhanceUserExperience();
    
    // Fix image display for all relevant images
    fixAllImagesDisplay();
});

/**
 * Adds ripple effect to buttons
 */
function addButtonRippleEffect() {
    const buttons = document.querySelectorAll('.btn, .quantity-btn');
    
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
 * Enhances user experience with additional animations and effects
 */
function enhanceUserExperience() {
    // Add hover effects to contributor items
    addContributorItemEffects();
    
    // Add highlighting to detail items on hover
    addDetailItemHighlighting();
    
    // Add focus effects to form fields
    addFormFieldEffects();
    
    // Add smooth entrance animations
    addEntranceAnimations();
}

/**
 * Adds hover effects to contributor items
 */
function addContributorItemEffects() {
    const contributorItems = document.querySelectorAll('.contributor-item');
    
    contributorItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.backgroundColor = 'var(--light-color)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.backgroundColor = '';
        });
    });
}

/**
 * Adds highlighting to detail items on hover
 */
function addDetailItemHighlighting() {
    const detailItems = document.querySelectorAll('.detail-item');
    
    detailItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = 'var(--shadow-md)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
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
            if (this.closest('.quantity-input')) return;
            
            const formGroup = this.closest('.form-group');
            if (formGroup) {
                formGroup.style.transform = 'translateY(-3px)';
            }
            this.style.boxShadow = '0 0 0 3px rgba(255, 107, 107, 0.2)';
        });
        
        // Remove focus effect
                field.addEventListener('blur', function() {
                    if (this.closest('.quantity-input')) return;
                    
                    const formGroup = this.closest('.form-group');
                    if (formGroup) {
                        formGroup.style.transform = '';
                    }
                    if (!this.matches(':focus-visible')) {
                        this.style.boxShadow = '';
                    }
                });
            });
        }

        /**
         * Adds entrance animations for various elements
         */
        function addEntranceAnimations() {
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
                
                @keyframes fadeInRight {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                .animate-in-up {
                    animation: fadeInUp 0.5s ease forwards;
                }
                
                .animate-in-right {
                    animation: fadeInRight 0.5s ease forwards;
                }
            `;
            document.head.appendChild(style);
            
            // Elements to animate with upward entrance
            const upElements = [
                '.breadcrumb-nav',
                '.contribution-card',
                '.item-details',
                '.contribution-form-section'
            ];
            
            // Elements to animate with rightward entrance
            const rightElements = [
                '.access-card',
                '.contributors-card'
            ];
            
            // Apply animations with staggered delay
            applyStaggeredAnimations(upElements, 'animate-in-up');
            applyStaggeredAnimations(rightElements, 'animate-in-right', 300);
            
            /**
             * Applies staggered animations to elements
             * @param {Array} selectors - Array of selectors
             * @param {string} animationClass - The animation class to apply
             * @param {number} baseDelay - Base delay in ms before starting animations
             */
            function applyStaggeredAnimations(selectors, animationClass, baseDelay = 0) {
                selectors.forEach((selector, index) => {
                    const element = document.querySelector(selector);
                    if (element) {
                        element.style.opacity = '0';
                        
                        setTimeout(() => {
                            element.classList.add(animationClass);
                            element.style.opacity = '';
                        }, baseDelay + (index * 100));
                    }
                });
            }
        }

        // Add pulsating effect to breadcrumb navigation
        document.addEventListener('DOMContentLoaded', function() {
            const breadcrumbItems = document.querySelectorAll('.breadcrumb-item a');
            
            breadcrumbItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('pulse-once');
                    
                    setTimeout(() => {
                        item.classList.remove('pulse-once');
                    }, 1000);
                }, index * 200);
            });
            
            // Add pulse animation style
            const style = document.createElement('style'); 
            style.textContent = `
                .pulse-once {
                    animation: pulseAction 1s ease;
                }
                
                @keyframes pulseAction {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                        background-color: var(--light-dark); 
                    }
                    100% {
                        transform: scale(1);
                    }
                }
            `;
            document.head.appendChild(style);
        });

        // Add realistic content loading simulation
        document.addEventListener('DOMContentLoaded', function() {
            const contributorsList = document.querySelector('.contributors-list');
            const contributorItems = document.querySelectorAll('.contributor-item');
            
            if (contributorsList && contributorItems.length > 0) {
                // Hide all items initially
                contributorItems.forEach(item => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(10px)';
                });
                
                // Show items one by one with a slight delay
                contributorItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 300 + (index * 150));
                });
            }
            
            // Handle image display
            fixAllImagesDisplay();
        });

        // Handle form submission
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('contributionForm');
            
            if (form) {
                // Create a hidden iframe for potential form submission
                const iframe = document.createElement('iframe');
                iframe.name = 'contribution-response-frame';
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
                
                // Set up AJAX form submission if available in your project
                if (window.fetch) {
                    form.addEventListener('submit', function(e) {
                        // Check if this is an AJAX-enabled form (has data-ajax attribute)
                        if (form.getAttribute('data-ajax') === 'true') {
                            e.preventDefault();
                            
                            const formData = new FormData(form);
                            
                            fetch(form.action, {
                                method: 'POST',
                                body: formData,
                                headers: {
                                    'X-Requested-With': 'XMLHttpRequest'
                                }
                            })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    // Show success message
                                    const successMessage = document.createElement('div');
                                    successMessage.className = 'alert alert-success mt-3';
                                    successMessage.innerHTML = '<i class="fas fa-check-circle me-2"></i>' + 
                                                            (data.message || 'Contribution submitted successfully!'); 
                                    
                                    form.insertAdjacentElement('beforebegin', successMessage);
                                    
                                    // Remove after 5 seconds
                                    setTimeout(() => {
                                        successMessage.remove();
                                    }, 5000);
                                    
                                    // Reset form
                                    form.reset();
                                } else {
                                    // Show error message
                                    const errorMessage = document.createElement('div');
                                    errorMessage.className = 'alert alert-danger mt-3';
                                    errorMessage.innerHTML = '<i class="fas fa-exclamation-triangle me-2"></i>' + 
                                                        (data.message || 'There was an error submitting your contribution. Please try again.');
                                    
                                    form.insertAdjacentElement('beforebegin', errorMessage);
                                    
                                    // Remove after 5 seconds
                                    setTimeout(() => {
                                        errorMessage.remove();
                                    }, 5000);
                                }
                            })
                            .catch(error => {
                                console.error('Error submitting form:', error);
                            })
                            .finally(() => {
                                // Re-enable submit button
                                const submitButton = form.querySelector('button[type="submit"]');
                                if (submitButton) {
                                    submitButton.classList.remove('loading-btn');
                                    submitButton.disabled = false;
                                }
                            });
                        }
                    });
                }
            }
        });

        /**
        * Initializes quantity input with plus/minus buttons
        */
        function initQuantityInput() {
            const quantityInput = document.getElementById('id_quantity');
            const minusBtn = document.querySelector('.minus-btn');
            const plusBtn = document.querySelector('.plus-btn');
            
            if (!quantityInput || !minusBtn || !plusBtn) return;
            
            // Set minimum value to 1
            if (!quantityInput.value || parseInt(quantityInput.value) < 1) {
                quantityInput.value = 1;
            }
            
            // Decrease quantity on minus button click
            minusBtn.addEventListener('click', function() {
                let currentValue = parseInt(quantityInput.value);
                if (currentValue > 1) {
                    quantityInput.value = currentValue - 1;
                    // Trigger change event for validation
                    quantityInput.dispatchEvent(new Event('change'));
                }
                
                // Add visual feedback
                addButtonPressAnimation(this);
            });
            
            // Increase quantity on plus button click
            plusBtn.addEventListener('click', function() {
                let currentValue = parseInt(quantityInput.value) || 0;
                quantityInput.value = currentValue + 1;
                // Trigger change event for validation
                quantityInput.dispatchEvent(new Event('change'));
                
                // Add visual feedback
                addButtonPressAnimation(this);
            });
            
            // Ensure value is at least 1 when manually entering a value
            quantityInput.addEventListener('change', function() {
                let value = parseInt(this.value) || 0;
                if (value < 1) {
                    this.value = 1;
                }
            });
            
            /**
            * Adds press animation to a button
            * @param {HTMLElement} button - The button to animate
            */
            function addButtonPressAnimation(button) {
                button.classList.add('btn-pressed');
                setTimeout(() => {
                    button.classList.remove('btn-pressed');
                }, 150);
            }
            
            // Add button press animation styles
            const style = document.createElement('style');
            style.textContent = `
                .btn-pressed {
                    transform: scale(0.95);
                    opacity: 0.8;
                }
            `;
            document.head.appendChild(style);
        }

        /**
        * Initializes form validation
        */
        function initFormValidation() {
            const form = document.getElementById('contributionForm');
            
            if (!form) return;
            
            form.addEventListener('submit', function(e) {
                let isValid = true;
                
                // Get form fields
                const nameField = document.getElementById('id_name');
                const emailField = document.getElementById('id_email');
                const quantityField = document.getElementById('id_quantity');
                
                // Validate name field if it exists (for non-authenticated users)
                if (nameField && !nameField.value.trim()) {
                    e.preventDefault();
                    showFieldError(nameField, 'Please enter your name');
                    isValid = false;
                }
                
                // Validate email field if it exists and is required
                if (emailField && emailField.required) {
                    if (!emailField.value.trim()) {
                        e.preventDefault();
                        showFieldError(emailField, 'Please enter your email');
                        isValid = false;
                    } else if (!isValidEmail(emailField.value.trim())) {
                        e.preventDefault();
                        showFieldError(emailField, 'Please enter a valid email address');
                        isValid = false;
                    }
                } else if (emailField && emailField.value.trim() && !isValidEmail(emailField.value.trim())) {
                    // If email is optional but provided, validate format
                    e.preventDefault();
                    showFieldError(emailField, 'Please enter a valid email address');
                    isValid = false;
                }
                
                // Validate quantity field
                if (!quantityField.value.trim() || parseInt(quantityField.value) < 1) {
                    e.preventDefault();
                    showFieldError(quantityField, 'Please enter a valid quantity (minimum 1)');
                    isValid = false;
                }
                
                // If form is valid, show loading state on submit button
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
                field.style.borderColor = 'var(--danger-color)';
                
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
            
            // Add shake animation keyframes
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
                    border-color: var(--danger-color) !important;
                }
            `;
            document.head.appendChild(style);
        }

        /**
        * Fixes display issues with images
        */
        function fixAllImagesDisplay() {
            // Target all images that might need fixing
            const imageSelectors = [
                '.category-image', 
                '.event-image', 
                '.event-cover-image', 
                '.category-image-wrapper img',
                '.event-image-wrapper img'
            ];
            
            // Apply fixes to all matching images
            document.querySelectorAll(imageSelectors.join(', ')).forEach(img => {
                // If image is already loaded, fix it immediately
                if (img.complete) {
                    fixImageDisplay(img);
                } else {
                    // Add load event listener to fix image once it loads
                    img.addEventListener('load', function() {
                        fixImageDisplay(this);
                    });
                }
            });
        }

        /**
        * Fix image display to ensure proper sizing and visibility
        * @param {HTMLImageElement} img - The image element to fix
        */
        function fixImageDisplay(img) {
            // Identify the container based on available parent elements 
            const container = img.closest('.category-image-wrapper') || 
                            img.closest('.event-image-wrapper') || 
                            img.closest('.event-cover-placeholder') ||
                            img.parentElement;
            
            if (!container) return;
            
            // Apply proper image styling to ensure it fits correctly
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.objectPosition = 'center';
            img.style.display = 'block';
            
            // Remove any max-width/height constraints that might cause issues 
            img.style.maxWidth = 'none';
            img.style.maxHeight = 'none';
            
            // Ensure container has proper overflow handling
            container.style.overflow = 'hidden';
            
            // Make sure container has appropriate dimensions if not already set
            if (container.offsetHeight === 0) {
                if (container.classList.contains('category-image-wrapper')) {
                    container.style.height = '160px';
                } else if (container.classList.contains('event-image-wrapper')) {
                    container.style.height = '140px';
                }
            }
        }