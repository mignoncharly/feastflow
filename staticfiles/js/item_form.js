// Updated item_form.js

document.addEventListener('DOMContentLoaded', function() {
    // Image Upload Preview
    setupImageUploadPreview();
    
    // Form Field Animation
    setupFormFieldAnimations();
    
    // Progress Ring Animation
    setupProgressRingAnimation();
    
    // Initialize Floating Elements Animation
    initFloatingElements();
});

/**
 * Setup the image upload preview functionality
 */
function setupImageUploadPreview() {
    const imageInput = document.querySelector('input[type="file"]');
    const imagePreview = document.getElementById('imagePreview');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');  
    
    if (imageInput && imagePreview) {
        imageInput.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.classList.remove('hidden');
                    
                    if (uploadPlaceholder) {
                        uploadPlaceholder.style.display = 'none';
                    }
                    
                    // Create overlay if it doesn't exist
                    let overlay = imagePreview.parentElement.querySelector('.preview-overlay');
                    if (!overlay) {
                        overlay = document.createElement('div');
                        overlay.className = 'preview-overlay';
                        overlay.innerHTML = '<i class="bi bi-arrow-repeat"></i><span>Change image</span>';
                        imagePreview.parentElement.appendChild(overlay);
                    }
                };
                
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
}

/**
 * Setup animations for form fields
 */
function setupFormFieldAnimations() {
    const formControls = document.querySelectorAll('.form-control');
    
    formControls.forEach(control => {
        // Add focus effects
        control.addEventListener('focus', function() {
            this.closest('.field-wrapper').classList.add('is-focused');
        });
        
        control.addEventListener('blur', function() {
            this.closest('.field-wrapper').classList.remove('is-focused');
        });
        
        // Check if field already has value
        if (control.value !== '') {
            control.closest('.field-wrapper').classList.add('has-value');
        }
        
        // Add value change detection
        control.addEventListener('input', function() {
            if (this.value !== '') {
                this.closest('.field-wrapper').classList.add('has-value');
            } else {
                this.closest('.field-wrapper').classList.remove('has-value');
            }
        });
    });
}

/**
 * Setup progress ring animation
 */
function setupProgressRingAnimation() {
    const progressRing = document.querySelector('.progress-ring');
    
    if (progressRing) {
        const progressCircle = progressRing.querySelector('.progress-circle-fill');
        const progressValue = progressRing.dataset.progress || 0;
        
        // Calculate circumference of the circle
        const radius = progressCircle.getAttribute('r');
        const circumference = 2 * Math.PI * radius;
        
        // Set the stroke dasharray to the circumference
        progressCircle.setAttribute('stroke-dasharray', circumference);
        
        // Calculate the stroke dashoffset based on progress
        const offset = circumference - (progressValue / 100 * circumference);
        
        // Animate the progress
        setTimeout(() => {
            progressCircle.style.transition = 'stroke-dashoffset 1.5s ease-in-out';
            progressCircle.style.strokeDashoffset = offset;
        }, 300);
    }
}

/**
 * Initialize floating background elements animation
 */
function initFloatingElements() {
    const floatElements = document.querySelectorAll('.float-element');
    
    floatElements.forEach((element, index) => {
        // Apply random starting positions within reasonable bounds
        const randomX = (Math.random() - 0.5) * 20;
        const randomY = (Math.random() - 0.5) * 20;
        const randomRotation = (Math.random() - 0.5) * 10;
        
        // Apply transformation
        element.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotation}deg)`;
    });
}

/**
 * Smooth scroll to form validation errors
 */
document.addEventListener('submit', function(e) {
    // Check if there are any errors after form submission
    setTimeout(() => {
        const firstError = document.querySelector('.text-danger, .error-feedback');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 100);
});

/**
 * Add touch ripple effect to buttons
 */
(function() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - this.getBoundingClientRect().left;
            const y = e.clientY - this.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple effect style
    const style = document.createElement('style');
    style.innerHTML = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple-effect {
            position: absolute;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            pointer-events: none;
            transform: scale(0);
            animation: ripple 0.6s linear;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
})();

/**
 * Enable tooltip functionality for truncated text
 */
(function() {
    const tooltipElements = document.querySelectorAll('[title]');
    
    tooltipElements.forEach(element => {
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = element.getAttribute('title');
        document.body.appendChild(tooltip);
        
        element.addEventListener('mouseenter', function() {
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) + 'px';
            tooltip.style.top = rect.top - 10 + 'px';
            tooltip.classList.add('visible');
        });
        
        element.addEventListener('mouseleave', function() {
            tooltip.classList.remove('visible');
        });
    });
    
    // Add tooltip style
    const style = document.createElement('style');
    style.innerHTML = `
        .custom-tooltip {
            position: fixed;
            transform: translateX(-50%) translateY(-100%);
            background-color: rgba(15, 23, 42, 0.9);
            color: white;
            padding: 0.5rem 0.75rem;
            border-radius: 0.25rem;
            font-size: 0.8125rem;
            max-width: 250px;
            word-wrap: break-word;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s, transform 0.2s;
        }
        
        .custom-tooltip.visible {
            opacity: 1;
            transform: translateX(-50%) translateY(calc(-100% - 8px));
        }
        
        .custom-tooltip:after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-width: 6px;
            border-style: solid;
            border-color: rgba(15, 23, 42, 0.9) transparent transparent transparent;
        }
    `;
    document.head.appendChild(style);
})(); 