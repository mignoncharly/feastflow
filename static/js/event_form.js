/**
 * FeastFlow - Event Form JavaScript
 * Handles form navigation, validation, animations, and UI interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initFormNavigation();
    initFormValidation();
    initAnimations();
    initImageSelection();
    initAccessModeInfo();
    initEventTypeIcons();
    initHeaderGradient();
    addEventListeners();
});

/**
 * Initialize form navigation between sections
 */
function initFormNavigation() {
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    // Next button click handler
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const nextSection = this.getAttribute('data-next');
            if (!nextSection) return;
            
            // Validate current section before proceeding
            const currentSection = this.closest('.form-section').getAttribute('data-section');
            if (!validateSection(currentSection)) {
                return;
            }
            
            // Hide all sections
            document.querySelectorAll('.form-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show next section
            const targetSection = document.querySelector(`.form-section[data-section="${nextSection}"]`);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Update progress
                updateProgress(nextSection);
                
                // Scroll to top of form
                const formCard = document.querySelector('.form-card');
                if (formCard) {
                    formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
    
    // Previous button click handler
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevSection = this.getAttribute('data-prev');
            if (!prevSection) return;
            
            // Hide all sections
            document.querySelectorAll('.form-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show previous section
            const targetSection = document.querySelector(`.form-section[data-section="${prevSection}"]`);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Update progress
                updateProgress(prevSection);
                
                // Scroll to top of form
                const formCard = document.querySelector('.form-card');
                if (formCard) {
                    formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
    
    // Progress step click handler - allow clicking on steps
    progressSteps.forEach(step => {
        step.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-step');
            if (!targetSection) return;
            
            // Only allow going back or to completed steps
            const currentSection = document.querySelector('.form-section.active').getAttribute('data-section');
            if (parseInt(targetSection) >= parseInt(currentSection) && !this.classList.contains('completed')) {
                return;
            }
            
            // Hide all sections
            document.querySelectorAll('.form-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show target section
            const targetSectionEl = document.querySelector(`.form-section[data-section="${targetSection}"]`);
            if (targetSectionEl) {
                targetSectionEl.classList.add('active');
                
                // Update progress
                updateProgress(targetSection);
                
                // Scroll to top of form
                const formCard = document.querySelector('.form-card');
                if (formCard) {
                    formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

/**
 * Update progress indicator
 * @param {string} currentStep - The current step number
 */
function updateProgress(currentStep) {
    const progressSteps = document.querySelectorAll('.progress-step');
    
    // Update steps
    progressSteps.forEach(step => {
        const stepNumber = parseInt(step.getAttribute('data-step'));
        
        if (stepNumber < parseInt(currentStep)) {
            step.classList.add('completed');
            step.classList.add('active');
        } else if (stepNumber === parseInt(currentStep)) {
            step.classList.remove('completed');
            step.classList.add('active');
        } else {
            step.classList.remove('completed');
            step.classList.remove('active');
        }
    });
}

/**
 * Validate current section before proceeding
 * @param {string} sectionNumber - The section number to validate
 * @returns {boolean} - Whether the section is valid
 */
function validateSection(sectionNumber) {
    const section = document.querySelector(`.form-section[data-section="${sectionNumber}"]`);
    if (!section) return true;
    
    let isValid = true;
    
    // Find all required inputs in the section
    const requiredInputs = section.querySelectorAll('input[required], textarea[required], select[required]');
    
    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('is-invalid');
            
            // Create or update error message
            let feedback = input.nextElementSibling;
            if (!feedback || !feedback.classList.contains('invalid-feedback')) {
                feedback = document.createElement('div');
                feedback.className = 'invalid-feedback';
                input.parentNode.insertBefore(feedback, input.nextSibling);
            }
            
            feedback.textContent = 'This field is required.';
        } else {
            input.classList.remove('is-invalid');
            
            // Remove error message if exists
            const feedback = input.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
                feedback.textContent = '';
            }
        }
    });
    
    // If not valid, show error message
    if (!isValid) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'alert alert-danger mt-3';
        errorMessage.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-2"></i> Please fill in all required fields.';
        
        // Remove any existing error messages
        const existingError = section.querySelector('.alert-danger');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message to the section
        section.appendChild(errorMessage);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            errorMessage.remove();
        }, 3000);
    }
    
    return isValid;
}

/**
 * Initialize form validation
 */
function initFormValidation() {
    const form = document.querySelector('.event-create-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        // Don't prevent default - Django will handle server-side validation
        
        // Show loading state on submit button
        const submitButton = this.querySelector('.btn-create');
        if (submitButton) {
            submitButton.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> <span>Processing...</span>';
            submitButton.disabled = true;
        }
    });
    
    // Add real-time validation for fields
    const inputFields = form.querySelectorAll('input, textarea, select');
    inputFields.forEach(field => {
        field.addEventListener('blur', function() {
            // Skip validation for non-required fields with no value
            if (!this.hasAttribute('required') && !this.value.trim()) {
                return;
            }
            
            validateField(this);
        });
        
        // Remove error state when user starts typing again
        field.addEventListener('input', function() {
            this.classList.remove('is-invalid');
            
            // Remove error message if exists
            const feedback = this.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
                feedback.textContent = '';
            }
        });
    });
}

/**
 * Validate an individual field
 * @param {HTMLElement} field - The field to validate
 * @returns {boolean} - Whether the field is valid
 */
function validateField(field) {
    let isValid = true;
    
    // Required validation
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        setFieldError(field, 'This field is required.');
    }
    
    // Email validation
    if (field.type === 'email' && field.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(field.value)) {
            isValid = false;
            setFieldError(field, 'Please enter a valid email address.');
        }
    }
    
    // Date validation
    if (field.type === 'date' && field.value) {
        const dateValue = new Date(field.value);
        if (isNaN(dateValue.getTime())) {
            isValid = false;
            setFieldError(field, 'Please enter a valid date.');
        }
    }
    
    return isValid;
}

/**
 * Set error message for a field
 * @param {HTMLElement} field - The field to set error for
 * @param {string} message - The error message
 */
function setFieldError(field, message) {
    field.classList.add('is-invalid');
    
    // Create or update error message
    let feedback = field.nextElementSibling;
    if (!feedback || !feedback.classList.contains('invalid-feedback')) {
        feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        field.parentNode.insertBefore(feedback, field.nextSibling);
    }
    
    feedback.textContent = message;
}

/**
 * Initialize animations with intersection observer
 */
function initAnimations() {
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const fadeElements = document.querySelectorAll('.fade-in, .slide-up');
        
        const appearOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const appearOnScroll = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                
                // Get delay if specified
                const delay = entry.target.getAttribute('data-delay');
                
                // Add visible class with delay if specified
                if (delay) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay * 200);
                } else {
                    entry.target.classList.add('visible');
                }
                
                observer.unobserve(entry.target);
            });
        }, appearOptions);
        
        fadeElements.forEach(element => {
            appearOnScroll.observe(element);
            // Initially hide elements that will be animated
            element.style.opacity = '0';
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        document.querySelectorAll('.fade-in, .slide-up').forEach(el => {
            el.classList.add('visible');
            el.style.opacity = '1';
        });
    }
}

/**
 * Initialize image selection and preview
 */
function initImageSelection() {
    // Initialize image source tabs
    const uploadOption = document.getElementById('option-upload');
    const galleryOption = document.getElementById('option-gallery');
    const uploadContainer = document.getElementById('upload-container');
    const galleryContainer = document.getElementById('gallery-container');
    
    if (uploadOption && galleryOption) {
        // Set default active tab
        uploadOption.classList.add('active');
        
        // Upload tab click
        uploadOption.addEventListener('click', function() {
            uploadOption.classList.add('active');
            galleryOption.classList.remove('active');
            uploadContainer.style.display = 'block';
            galleryContainer.style.display = 'none';
        });
        
        // Gallery tab click
        galleryOption.addEventListener('click', function() {
            galleryOption.classList.add('active');
            uploadOption.classList.remove('active');
            galleryContainer.style.display = 'block';
            uploadContainer.style.display = 'none';
        });
    }
    
    // Initialize image upload and preview
    const imageInput = document.querySelector('input[type="file"]');
    const uploadArea = document.getElementById('image-upload-area');
    const previewContainer = document.getElementById('image-preview-container');
    
    if (imageInput && uploadArea) {
        // Handle click on upload area
        uploadArea.addEventListener('click', function() {
            imageInput.click();
        });
        
        // Handle drag and drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, function() {
                uploadArea.classList.add('drag-over');
            }, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, function() {
                uploadArea.classList.remove('drag-over');
            }, false);
        });
        
        // Handle file drop
        uploadArea.addEventListener('drop', function(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files.length) {
                imageInput.files = files;
                handleFileChange(files[0]);
            }
        }, false);
        
        // Handle file selection
        imageInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                handleFileChange(this.files[0]);
            }
        });
        
        // Handle file change
        function handleFileChange(file) {
            // Clear existing preview
            previewContainer.innerHTML = '';
            
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Create preview container
                const previewDiv = document.createElement('div');
                previewDiv.className = 'preview-container';
                
                // Create preview image
                const img = document.createElement('img');
                img.className = 'preview-image';
                img.src = e.target.result;
                
                // Create overlay
                const overlay = document.createElement('div');
                overlay.className = 'preview-overlay';
                overlay.innerHTML = '<i class="bi bi-arrow-repeat"></i><span>Change image</span>';
                
                // Create remove button
                const removeBtn = document.createElement('div');
                removeBtn.className = 'remove-preview';
                removeBtn.innerHTML = '<i class="bi bi-x"></i>';
                removeBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    imageInput.value = '';
                    previewContainer.innerHTML = '';
                });
                
                // Assemble preview
                previewDiv.appendChild(img);
                previewDiv.appendChild(overlay);
                previewDiv.appendChild(removeBtn);
                previewContainer.appendChild(previewDiv);
                
                // Handle click on preview to trigger file input
                previewDiv.addEventListener('click', function() {
                    imageInput.click();
                });
            };
            
            reader.readAsDataURL(file);
        }
        
        // Initialize existing preview if there's an image
        if (previewContainer.querySelector('.preview-container')) {
            const removeBtn = previewContainer.querySelector('.remove-preview');
            if (removeBtn) {
                removeBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    imageInput.value = '';
                    previewContainer.innerHTML = '';
                });
            }
            
            const previewDiv = previewContainer.querySelector('.preview-container');
            if (previewDiv) {
                previewDiv.addEventListener('click', function() {
                    imageInput.click();
                });
            }
        }
    }
    
    // Initialize gallery image selection
    const galleryImages = document.querySelectorAll('.gallery-image-wrapper');
    
    galleryImages.forEach(image => {
        image.addEventListener('click', function() {
            // Remove selection from all images
            galleryImages.forEach(img => {
                img.classList.remove('selected');
            });
            
            // Select this image
            this.classList.add('selected');
            
            // Check the radio button
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
            }
        });
        
        // If radio is already checked, mark as selected
        const radio = image.querySelector('input[type="radio"]');
        if (radio && radio.checked) {
            image.classList.add('selected');
        }
    });
    
    // Initialize gallery folder tabs
    const folderTabs = document.querySelectorAll('.folder-tab');
    
    folderTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            folderTabs.forEach(t => {
                t.classList.remove('active');
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Get folder
            const folder = this.getAttribute('data-folder');
            
            // Show/hide images based on folder
            galleryImages.forEach(image => {
                if (folder === 'all' || image.getAttribute('data-type') === folder) {
                    image.style.display = 'block';
                } else {
                    image.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Initialize access mode explanation visibility
 */
function initAccessModeInfo() {
    const accessModeSelect = document.querySelector('select[name="access_mode"]');
    if (!accessModeSelect) return;
    
    const accessCodeField = document.querySelector('#div_id_access_code');
    const publicInfo = document.querySelector('.public-info');
    const codeInfo = document.querySelector('.code-info');
    const inviteInfo = document.querySelector('.invite-info');
    
    function updateAccessInfo() {
        // Reset all
        [publicInfo, codeInfo, inviteInfo].forEach(info => {
            if (info) info.classList.remove('active');
        });
        
        if (accessCodeField) {
            accessCodeField.style.display = 'none';
        }
        
        // Show relevant info
        const selectedValue = accessModeSelect.value;
        
        if (selectedValue === 'public' && publicInfo) {
            publicInfo.classList.add('active');
        } else if (selectedValue === 'code' && codeInfo) {
            codeInfo.classList.add('active');
            if (accessCodeField) {
                accessCodeField.style.display = 'block';
            }
        } else if (selectedValue === 'invite' && inviteInfo) {
            inviteInfo.classList.add('active');
        }
    }
    
    // Initial state
    updateAccessInfo();
    
    // Listen for changes
    accessModeSelect.addEventListener('change', updateAccessInfo);
}

/**
 * Initialize event type icon selection
 */
function initEventTypeIcons() {
    const eventTypeSelect = document.querySelector('select[name="event_type"]');
    if (!eventTypeSelect) return;
    
    // If icon container already exists, don't create a new one
    let iconContainer = document.querySelector('.event-type-icon');
    
    if (!iconContainer) {
        // Create icon container
        iconContainer = document.createElement('div');
        iconContainer.className = 'event-type-icon';
        iconContainer.innerHTML = '<i class="bi bi-people"></i>'; // Default icon
        
        // Insert after the select element's container
        const formGroup = eventTypeSelect.closest('.form-group');
        if (formGroup) {
            formGroup.appendChild(iconContainer);
        }
    }
    
    // Update icon based on selection
    function updateIcon() {
        const selectedValue = eventTypeSelect.value;
        let iconClass = 'bi-people'; // Default
        
        // Map event types to appropriate icons
        switch (selectedValue) {
            case 'association':
                iconClass = 'bi-people';
                break;
            case 'grill_bbq':
                iconClass = 'bi-fire';
                break;
            case 'church':
                iconClass = 'bi-building';
                break;
            case 'wedding':
                iconClass = 'bi-heart';
                break;
            case 'birthday':
                iconClass = 'bi-cake';
                break;
            case 'corporate':
                iconClass = 'bi-briefcase';
                break;
        }
        
        // Update the icon
        iconContainer.innerHTML = `<i class="bi ${iconClass}"></i>`;
        
        // Add animation
        iconContainer.classList.add('icon-updated');
        setTimeout(() => {
            iconContainer.classList.remove('icon-updated');
        }, 500);
    }
    
    // Initial update
    updateIcon();
    
    // Listen for changes
    eventTypeSelect.addEventListener('change', updateIcon);
    
    // Add tooltip for each option
    const tooltips = {
        'association': 'For sports clubs, hobby groups, and other associations',
        'grill_bbq': 'For outdoor cooking and BBQ events',
        'church': 'For religious community gatherings',
        'wedding': 'For wedding celebrations and related events',
        'birthday': 'For birthday parties and celebrations',
        'corporate': 'For company events, team buildings, and conferences'
    };
    
    // Add descriptive text under the field
    let helpText = document.querySelector('.event-type-help');
    
    if (!helpText) {
        helpText = document.createElement('div');
        helpText.className = 'event-type-help mt-2 small text-muted';
        helpText.style.display = 'none';
        
        const formGroup = eventTypeSelect.closest('.form-group');
        if (formGroup) {
            formGroup.appendChild(helpText);
        }
    }
    
    eventTypeSelect.addEventListener('change', function() {
        const selectedValue = this.value;
        helpText.textContent = tooltips[selectedValue] || '';
        helpText.style.display = 'block';
    });
    
    // Trigger initial description
    const initialValue = eventTypeSelect.value;
    if (initialValue && tooltips[initialValue]) {
        helpText.textContent = tooltips[initialValue];
        helpText.style.display = 'block';
    }
}

/**
 * Initialize the header gradient animation
 */
function initHeaderGradient() {
    const header = document.querySelector('.gradient-overlay');
    if (!header) return;
    
    let degree = 135;
    let direction = 1;
    
    setInterval(() => {
        // Subtle animation - only move 0.2 degrees at a time
        degree += 0.2 * direction;
        
        // Reverse direction when reaching limits
        if (degree > 155 || degree < 115) {
            direction *= -1;
        }
        
        header.style.background = `linear-gradient(${degree}deg, var(--gradient-start), var(--gradient-mid), var(--gradient-end))`;
    }, 100);
}

/**
 * Add event listeners for interactive elements
 */
function addEventListeners() {
    // Add hover effects for buttons
    const buttons = document.querySelectorAll('.btn-next, .btn-prev, .btn-create, .btn-cancel');
    
    buttons.forEach(button => {
        if (button.classList.contains('btn-next') || button.classList.contains('btn-create')) {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                
                if (this.classList.contains('btn-next')) {
                    this.style.boxShadow = '0 6px 16px rgba(63, 55, 201, 0.3)';
                } else {
                    this.style.boxShadow = '0 6px 16px rgba(6, 214, 160, 0.3)';
                }
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                
                if (this.classList.contains('btn-next')) {
                    this.style.boxShadow = '0 4px 12px rgba(63, 55, 201, 0.25)';
                } else {
                    this.style.boxShadow = '0 4px 12px rgba(6, 214, 160, 0.25)';
                }
            });
        } else {
            button.addEventListener('mouseenter', function() {
                this.style.backgroundColor = 'var(--neutral-100)';
                this.style.borderColor = 'var(--neutral-400)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'transparent';
                this.style.borderColor = 'var(--neutral-300)';
            });
        }
    });
    
    // Add ripple effect to buttons
    buttons.forEach(button => {
        addRippleEffect(button);
    });
    
    // Add hover effect for feature items
    const featureItems = document.querySelectorAll('.feature-item');
    
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = 'var(--shadow-sm)';
            this.style.backgroundColor = 'rgba(67, 97, 238, 0.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
            this.style.backgroundColor = 'var(--neutral-100)';
            
            // Handle dark mode
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.style.backgroundColor = '#262626';
            }
        });
    });
    
    // Initialize autoresize for textareas
    const textareas = document.querySelectorAll('textarea.autosize');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
        
        // Initial trigger
        const event = new Event('input');
        textarea.dispatchEvent(event);
    });
}

/**
 * Add ripple effect to buttons
 * @param {HTMLElement} element - The element to add ripple effect to
 */
function addRippleEffect(element) {
    element.addEventListener('mousedown', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        
        element.appendChild(ripple);
        
        // Remove the ripple after animation completes
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

// Add additional CSS for animations and event type icons
(function addAnimationStyles() {
    // Only add styles if they don't already exist
    if (!document.getElementById('dynamic-styles')) {
        const style = document.createElement('style');
        style.id = 'dynamic-styles';
        style.textContent = `
            .fade-in.visible, .slide-up.visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            .spin {
                animation: spin 1s linear infinite;
                display: inline-block;
            }
            
            .ripple-effect {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.4);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            }
            
            .btn-next, .btn-prev, .btn-create, .btn-cancel {
                position: relative;
                overflow: hidden;
            }
            
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
            
            .event-type-icon {
                position: absolute;
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 1.5rem;
                color: var(--primary);
                opacity: 0.7;
                transition: all 0.3s ease;
            }
            
            .event-type-icon:hover {
                opacity: 1;
            }
            
            .form-group {
                position: relative;
            }
            
            .icon-updated {
                animation: pulse 0.5s ease;
            }
            
            @keyframes pulse {
                0% { transform: translateY(-50%) scale(1); }
                50% { transform: translateY(-50%) scale(1.2); }
                100% { transform: translateY(-50%) scale(1); }
            }
            
            .event-type-help {
                color: var(--text-muted);
                font-style: italic;
                transition: all 0.3s ease;
                animation: fadeIn 0.5s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @media (prefers-reduced-motion: reduce) {
                .fade-in, .slide-up {
                    animation: none;
                    opacity: 1;
                }
                
                .spin {
                    animation: none;
                }
                
                .ripple-effect {
                    display: none;
                }
                
                .icon-updated {
                    animation: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
})();