// Contribution Thanks JavaScript - FeastFlow Modern Design

document.addEventListener('DOMContentLoaded', function() {
    // Launch confetti celebration
    triggerConfetti();
    
    // Add ripple effect to buttons
    addButtonRippleEffect();
    
    // Initialize share buttons
    initShareButtons();
    
    // Add animations for step items
    addStepAnimations();
});

/**
 * Triggers confetti animation
 */
function triggerConfetti() {
    // Check if confetti is available
    if (typeof confetti === 'undefined') {
        console.warn('Confetti library not loaded');
        return;
    }
    
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    
    const myConfetti = confetti.create(canvas, {
        resize: true,
        useWorker: true
    });
    
    // First burst of confetti
    myConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3cb371', '#ff6b6b', '#4a90e2', '#ffc107'],
        disableForReducedMotion: true
    });
    
    // Second burst after a short delay
    setTimeout(() => {
        myConfetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#3cb371', '#ff6b6b', '#4a90e2', '#ffc107'],
            disableForReducedMotion: true
        });
    }, 750);
    
    // Third burst from the opposite side
    setTimeout(() => {
        myConfetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#3cb371', '#ff6b6b', '#4a90e2', '#ffc107'],
            disableForReducedMotion: true
        });
    }, 1500);
}

/**
 * Adds ripple effect to buttons
 */
function addButtonRippleEffect() {
    const buttons = document.querySelectorAll('.btn, .share-btn, .step-link');
    
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
 * Initializes sharing functionality
 */
function initShareButtons() {
    const facebookBtn = document.querySelector('.facebook-btn');
    const twitterBtn = document.querySelector('.twitter-btn');
    const emailBtn = document.querySelector('.email-btn');
    const copyBtn = document.getElementById('copyLinkBtn');
    const toast = document.getElementById('copyToast');
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function() {
            const url = window.location.href;
            const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            window.open(shareUrl, 'facebook-share', 'width=580,height=520');
        });
    }
    
    if (twitterBtn) {
        twitterBtn.addEventListener('click', function() {
            const url = window.location.href;
            const text = 'I just contributed to an event on FeastFlow! Join me in making a difference.';
            const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            window.open(shareUrl, 'twitter-share', 'width=580,height=520');
        });
    }
    
    if (emailBtn) {
        emailBtn.addEventListener('click', function() {
            const url = window.location.href;
            const subject = 'Join me on FeastFlow';
            const body = `I just contributed to an event on FeastFlow and thought you might be interested in joining too.\n\nCheck it out here: ${url}`;
            window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        });
    }
    
    if (copyBtn && toast) {
        copyBtn.addEventListener('click', function() {
            const url = window.location.href;
            
            // Use the Clipboard API if available
            if (navigator.clipboard) {
                navigator.clipboard.writeText(url)
                    .then(() => showToast(toast))
                    .catch(err => {
                        console.error('Could not copy text: ', err);
                        // Fallback to the older approach
                        fallbackCopyTextToClipboard(url, toast);
                    });
            } else {
                // Fallback for browsers that don't support clipboard API
                fallbackCopyTextToClipboard(url, toast);
            }
        });
    }
    
    /**
     * Fallback method to copy text to clipboard
     * @param {string} text - Text to copy
     * @param {HTMLElement} toast - Toast element to show
     */
    function fallbackCopyTextToClipboard(text, toast) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        
        // Make the textarea out of viewport
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showToast(toast);
            }
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }
        
        document.body.removeChild(textArea);
    }
    
    /**
     * Shows toast notification
     * @param {HTMLElement} toast - Toast element to show
     */
    function showToast(toast) {
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

/**
 * Adds animations for step items
 */
function addStepAnimations() {
    const stepItems = document.querySelectorAll('.step-item');
    
    stepItems.forEach((item, index) => {
        // Set initial state
        item.style.opacity = '0';
        item.style.transform = 'translateX(20px)';
        
        // Animate with staggered delay
        setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 500 + (index * 200));
    });
}

/**
 * Enhances user experience with additional animations and effects
 */
document.addEventListener('DOMContentLoaded', function() {
    // Animate the checkmark and background pulse
    setTimeout(() => {
        const successBadge = document.querySelector('.success-badge');
        if (successBadge) {
            successBadge.classList.add('pulse-animation');
        }
    }, 500);
    
    // Add animation for detail items
    const detailItems = document.querySelectorAll('.detail-item');
    
    detailItems.forEach((item, index) => {
        // Set initial state
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        // Animate with staggered delay
        setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 800 + (index * 150));
    });
    
    // Add CSS for badge pulse animation
    const style = document.createElement('style');
    style.textContent = `
        .pulse-animation {
            animation: badgePulse 2s infinite;
        }
        
        @keyframes badgePulse {
            0% {
                box-shadow: 0 0 0 0 rgba(60, 179, 113, 0.4);
            }
            70% {
                box-shadow: 0 0 0 15px rgba(60, 179, 113, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(60, 179, 113, 0);
            }
        }
    `;
    document.head.appendChild(style);
});

// Recreate confetti on window resize to avoid visual glitches
window.addEventListener('resize', () => {
    setTimeout(() => {
        if (typeof confetti !== 'undefined') {
            confetti.reset();
        }
    }, 100);
});