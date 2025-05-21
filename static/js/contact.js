/**
 * contact.js - Handles contact form interactions and submissions
 * 
 * This script manages the contact form functionality including:
 * - Switching between different contact types (bug, feature, support)
 * - Showing/hiding conditional form fields based on contact type
 * - Form validation and submission handling
 * - Success message display
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const optionCards = document.querySelectorAll('.option-card');
    const contactForm = document.getElementById('contactForm');
    const contactTypeInput = document.getElementById('contactType');
    const formTypeIcon = document.getElementById('formTypeIcon');
    const formTypeTitle = document.getElementById('formTypeTitle');
    const formTypeDescription = document.getElementById('formTypeDescription');
    const bugFields = document.getElementById('bugFields');
    const featureFields = document.getElementById('featureFields');
    const attachmentCheckbox = document.getElementById('attachment');
    const attachmentInfo = document.getElementById('attachmentInfo');
    const successModal = document.getElementById('successModal');
    const referenceNumber = document.getElementById('referenceNumber');
    
    // Initialize Bootstrap modal if Bootstrap is available
    let modal = null;
    if (typeof bootstrap !== 'undefined') {
        modal = new bootstrap.Modal(document.getElementById('successModal'));
    }
    
    // Handle option card selection
    optionCards.forEach(card => {
        card.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            
            // Update active state
            optionCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // Update hidden input
            contactTypeInput.value = type;
            
            // Update form header
            updateFormHeader(type);
            
            // Show/hide conditional fields
            toggleConditionalFields(type);
            
            // Scroll to form on mobile
            if (window.innerWidth < 768) {
                const formSection = document.querySelector('.contact-form-section');
                if (formSection) {
                    formSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    
    // Handle attachment checkbox
    if (attachmentCheckbox && attachmentInfo) {
        attachmentCheckbox.addEventListener('change', function() {
            attachmentInfo.style.display = this.checked ? 'block' : 'none';
        });
    }
    
    // Form submission handler
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            // Prevent actual form submission for demo
            // Remove this in production if you want the form to submit normally
            event.preventDefault();
            
            // Validate form
            if (validateForm()) {
                // In a real implementation, you would submit the form data to your backend here
                // For demo purposes, we'll just show the success modal
                showSuccessMessage();
            }
        });
    }
    
    /**
     * Updates the form header based on the selected contact type
     * @param {string} type - The contact type (bug, feature, support)
     */
    function updateFormHeader(type) {
        let iconSvg = '';
        let title = '';
        let description = '';
        
        switch (type) {
            case 'bug':
                iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A4.979 4.979 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A4.985 4.985 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623zM4 7v4a4 4 0 0 0 3.5 3.97V7H4zm4.5 0v7.97A4 4 0 0 0 12 11V7H8.5zM12 6a3.989 3.989 0 0 0-1.334-2.982A3.983 3.983 0 0 0 8 2a3.983 3.983 0 0 0-2.667 1.018A3.989 3.989 0 0 0 4 6h8z"/></svg>';
                title = 'Report a Bug';
                description = 'Please provide as much detail as possible to help us fix the issue quickly.';
                formTypeIcon.parentElement.style.backgroundColor = 'var(--danger-color)';
                break;
            case 'feature':
                iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M2 6.342a3 3 0 0 1 5.924-.464l1.04-.208A4 4 0 1 0 2.6 8.4L2 6.342zm10.265.034a3 3 0 0 1-5.924.464l-1.04.208a4 4 0 1 0 6.465-2.66l-.814 1.988zm-8.55 8.309l.31.31a3.53 3.53 0 0 0 4.939 0 3.53 3.53 0 0 0 0-4.939l-.31-.31-.698.698.31.31a2.53 2.53 0 0 1 0 3.543 2.53 2.53 0 0 1-3.543 0l-.31-.31-.698.698zm4.586-4.586l-.698.698.31.31a2.53 2.53 0 0 1 0 3.543 2.53 2.53 0 0 1-3.543 0l-.31-.31-.698.698.31.31a3.53 3.53 0 0 0 4.939 0 3.53 3.53 0 0 0 0-4.939l-.31-.31zm-8.036.186l2.121-2.121 2.121 2.12-2.12 2.122-2.122-2.121z"/></svg>';
                title = 'Request a Feature';
                description = 'Share your ideas to help us improve our product and better serve your needs.';
                formTypeIcon.parentElement.style.backgroundColor = 'var(--warning-color)';
                break;
            case 'support':
                iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a5 5 0 0 0-5 5v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a6 6 0 1 1 12 0v6a2.5 2.5 0 0 1-2.5 2.5H9.366a1 1 0 0 1-.866.5h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 .866.5H11.5A1.5 1.5 0 0 0 13 12h-1a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1V6a5 5 0 0 0-5-5z"/></svg>';
                title = 'Get Support';
                description = 'Need help using the platform? Our team is ready to assist you.';
                formTypeIcon.parentElement.style.backgroundColor = 'var(--primary-color)';
                break;
            default:
                iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/></svg>';
                title = 'Contact Us';
                description = 'Fill out the form below and we\'ll get back to you as soon as possible.';
                formTypeIcon.parentElement.style.backgroundColor = 'var(--primary-color)';
        }
        
        formTypeIcon.innerHTML = iconSvg;
        formTypeTitle.textContent = title;
        formTypeDescription.textContent = description;
        
        // Add animation
        formTypeTitle.classList.add('fade-in');
        formTypeDescription.classList.add('fade-in');
        
        // Remove animation classes after animation completes
        setTimeout(() => {
            formTypeTitle.classList.remove('fade-in');
            formTypeDescription.classList.remove('fade-in');
        }, 500);
    }
    
    /**
     * Shows/hides conditional form fields based on contact type
     * @param {string} type - The contact type (bug, feature, support)
     */
    function toggleConditionalFields(type) {
        // First hide all conditional fields
        if (bugFields) bugFields.style.display = 'none';
        if (featureFields) featureFields.style.display = 'none';
        
        // Show fields based on type
        if (type === 'bug' && bugFields) {
            bugFields.style.display = 'block';
            bugFields.classList.add('slide-up');
            
            setTimeout(() => {
                bugFields.classList.remove('slide-up');
            }, 500);
        } else if (type === 'feature' && featureFields) {
            featureFields.style.display = 'block';
            featureFields.classList.add('slide-up');
            
            setTimeout(() => {
                featureFields.classList.remove('slide-up');
            }, 500);
        }
    }
    
    /**
     * Validates the form
     * @returns {boolean} - Whether the form is valid
     */
    function validateForm() {
        // This is a simple validation for demo purposes
        // In production, you'd want more comprehensive validation
        
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');
        
        let isValid = true;
        
        // Check required fields
        if (!name.value.trim()) {
            highlightInvalidField(name);
            isValid = false;
        } else {
            removeInvalidHighlight(name);
        }
        
        if (!email.value.trim()) {
            highlightInvalidField(email);
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            highlightInvalidField(email);
            isValid = false;
        } else {
            removeInvalidHighlight(email);
        }
        
        if (!subject.value.trim()) {
            highlightInvalidField(subject);
            isValid = false;
        } else {
            removeInvalidHighlight(subject);
        }
        
        if (!message.value.trim()) {
            highlightInvalidField(message);
            isValid = false;
        } else {
            removeInvalidHighlight(message);
        }
        
        return isValid;
    }
    
    /**
     * Checks if an email is valid
     * @param {string} email - The email to validate
     * @returns {boolean} - Whether the email is valid
     */
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    /**
     * Highlights an invalid form field
     * @param {HTMLElement} field - The field to highlight
     */
    function highlightInvalidField(field) {
        field.style.borderColor = 'var(--danger-color)';
        
        // Add shake animation
        field.classList.add('shake');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            field.classList.remove('shake');
        }, 600);
        
        // Add shake animation style if it doesn't exist
        if (!document.getElementById('shakeAnimation')) {
            const style = document.createElement('style');
            style.id = 'shakeAnimation';
            style.innerHTML = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                
                .shake {
                    animation: shake 0.6s ease-in-out;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    /**
     * Removes invalid highlight from a form field
     * @param {HTMLElement} field - The field to unhighlight
     */
    function removeInvalidHighlight(field) {
        field.style.borderColor = '';
    }
    
    /**
     * Shows the success message after form submission
     */
    function showSuccessMessage() {
        // Generate a random reference number
        const refNumber = 'REF' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);
        
        if (referenceNumber) {
            referenceNumber.textContent = refNumber;
        }
        
        // Show the modal if Bootstrap is available
        if (modal) {
            modal.show();
        } else {
            // Fallback for when Bootstrap is not available
            if (successModal) {
                successModal.style.display = 'block';
            }
            
            // Reset the form
            contactForm.reset();
            
            // Hide conditional fields
            if (bugFields) bugFields.style.display = 'none';
            if (featureFields) featureFields.style.display = 'none';
            
            // Reset contact type
            contactTypeInput.value = 'general';
            
            // Reset form header
            updateFormHeader('general');
            
            // Remove active state from option cards
            optionCards.forEach(card => card.classList.remove('active'));
        }
    }
});