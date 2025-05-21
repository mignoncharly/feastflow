// event_detail.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Initialize header gradient animation
    initHeaderGradient();
    
    // Initialize copy functions
    initCopyFunctions();
    
    // Initialize share buttons
    initShareButtons();
    
    // Add smooth scrolling for in-page links
    initSmoothScrolling();
    
    // Add event listeners
    addEventListeners();
});

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
                
                // Add visible class
                entry.target.classList.add('visible');
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
 * Add event listeners
 */
function addEventListeners() {
    // Add event listeners for interactive elements
    
    // Event listeners for category cards hover effects
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
    
    // Event listeners for related event cards
    document.querySelectorAll('.related-event-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
    
    // Event listeners for buttons with hover effects
    document.querySelectorAll('.btn-contribute, .btn-view-items, .btn-view-event, .btn-access-code, .btn-enter-code, .btn-add-category, .btn-add-first').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        button.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
    
    // Add event listeners for image elements to ensure proper display
    document.querySelectorAll('.category-image, .event-image, .event-cover-image').forEach(img => {
        img.addEventListener('load', function() {
            fixImageDisplay(this);
        });
        
        // Also run immediately for already loaded images
        if (img.complete) {
            fixImageDisplay(img);
        }
    });
}

/**
 * Fix image display to ensure images are fully visible and properly sized
 * @param {HTMLImageElement} img - The image element to fix
 */
function fixImageDisplay(img) {
    const container = img.closest('.category-image-wrapper') || 
                      img.closest('.event-image-wrapper') || 
                      img.closest('.event-cover');
    
    if (!container) return;
    
    // Ensure the image fills its container while maintaining aspect ratio
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.objectPosition = 'center';
    
    // Remove any potential problematic styles that might be causing cropping
    img.style.maxWidth = 'none';
    img.style.maxHeight = 'none';
    img.style.position = 'relative';
    img.style.display = 'block';
    
    // Ensure container has proper overflow handling
    container.style.overflow = 'hidden';
}

/**
 * Initialize header gradient animation
 */
function initHeaderGradient() {
    const headerSection = document.querySelector('.header-section');
    const gradientOverlay = document.querySelector('.gradient-overlay');
    
    if (!headerSection || !gradientOverlay) return;
    
    // Set initial gradient
    let hue = 0;
    let saturation = 70;
    let lightness = 60;
    
    // Function to update gradient colors
    function updateGradient() {
        // Create dynamic gradient with shifting hues
        const color1 = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        const color2 = `hsl(${(hue + 60) % 360}, ${saturation}%, ${lightness}%)`;
        const color3 = `hsl(${(hue + 180) % 360}, ${saturation}%, ${lightness - 10}%)`;
        
        gradientOverlay.style.background = `
            linear-gradient(135deg, 
            ${color1} 0%, 
            ${color2} 50%, 
            ${color3} 100%)
        `;
        
        // Increment hue for next frame
        hue = (hue + 0.2) % 360;
        
        // Continue animation
        requestAnimationFrame(updateGradient);
    }
    
    // Start gradient animation
    updateGradient();
    
    // Add parallax effect to header on scroll
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        if (scrollPosition < 600) {
            const translateY = scrollPosition * 0.3;
            gradientOverlay.style.transform = `translateY(${translateY}px)`;
        }
    });
}

/**
 * Initialize copy functions
 */
function initCopyFunctions() {
    // Clipboard copy functionality with feedback
    document.querySelectorAll('.btn-copy').forEach(button => {
        button.addEventListener('click', copyAccessCode);
    });
}

function copyAccessCode() {
    const input = document.getElementById('accessCodeField');
    const button = this.tagName === 'BUTTON' ? this : this.parentElement;
    const originalIcon = button.innerHTML;

    // Select the text
    input.select();
    input.setSelectionRange(0, 99999); // For mobile devices

    // Modern clipboard API
    navigator.clipboard.writeText(input.value).then(() => {
        // Visual feedback
        button.innerHTML = '<i class="bi bi-check2"></i>';
        button.classList.add('copied');
        
        // Revert after 2 seconds
        setTimeout(() => {
            button.innerHTML = originalIcon;
            button.classList.remove('copied');
        }, 2000);
    }).catch((err) => {
        // Fallback for older browsers
        try {
            document.execCommand('copy');
            button.innerHTML = '<i class="bi bi-check2"></i>';
            button.classList.add('copied');
            setTimeout(() => {
                button.innerHTML = originalIcon;
                button.classList.remove('copied');
            }, 2000);
        } catch (err) {
            alert('Failed to copy access code. Please copy manually.');
        }
    });
}

/**
 * Initialize share buttons
 */
function initShareButtons() {
    // Handle the copy link button
    document.querySelectorAll('.btn-share.copy').forEach(button => {
        button.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            const originalInnerHTML = this.innerHTML;
            
            // Copy URL to clipboard
            navigator.clipboard.writeText(url).then(() => {
                // Visual feedback
                this.innerHTML = '<i class="bi bi-check2"></i>';
                this.classList.add('copied');
                
                // Revert after 2 seconds
                setTimeout(() => {
                    this.innerHTML = originalInnerHTML;
                    this.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                // Fallback for older browsers
                try {
                    // Create temporary input
                    const tempInput = document.createElement('input');
                    tempInput.value = url;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                    
                    // Visual feedback
                    this.innerHTML = '<i class="bi bi-check2"></i>';
                    this.classList.add('copied');
                    
                    // Revert after 2 seconds
                    setTimeout(() => {
                        this.innerHTML = originalInnerHTML;
                        this.classList.remove('copied');
                    }, 2000);
                } catch (err) {
                    alert('Failed to copy link. Please copy manually.');
                }
            });
        });
    });
    
    // Add hover effects to share buttons
    document.querySelectorAll('.btn-share').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        button.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
    
    // Track share button clicks (analytics)
    document.querySelectorAll('.btn-share:not(.copy)').forEach(button => {
        button.addEventListener('click', function(e) {
            // Get share type from class (e.g., 'facebook', 'whatsapp', 'email')
            const shareType = Array.from(this.classList)
                .find(cls => ['facebook', 'whatsapp', 'email'].includes(cls));
            
            // Could implement analytics tracking here
            console.log(`Shared via ${shareType}`);
        });
    });
}

/**
 * Add smooth scrolling for in-page links
 */
function initSmoothScrolling() {
    // Select all links with hash (#) and not with empty href
    document.querySelectorAll('a[href*="#"]:not([href="#"])').forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default if it's an in-page link
            if (
                location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && 
                location.hostname === this.hostname
            ) {
                // Get target element
                const targetId = this.hash.slice(1);
                const targetElement = document.getElementById(targetId) || 
                                     document.querySelector(`[name="${targetId}"]`);
                
                // Check if target exists
                if (targetElement) {
                    e.preventDefault();
                    
                    // Get offset position
                    const headerOffset = 80; // Adjust based on fixed headers if needed
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    // Scroll smoothly
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL hash without scrolling (modern browsers)
                    history.pushState(null, null, this.hash);
                    
                    // Add active class to the clicked link and remove from siblings
                    if (this.closest('nav')) {
                        const navLinks = this.closest('nav').querySelectorAll('a');
                        navLinks.forEach(navLink => {
                            navLink.classList.remove('active');
                        });
                        this.classList.add('active');
                    }
                }
            }
        });
    });
    
    // Set active state for nav links based on scroll position
    window.addEventListener('scroll', function() {
        // Debounce scroll events for performance
        clearTimeout(window.scrollTimeout);
        window.scrollTimeout = setTimeout(function() {
            // Only run if there are section elements
            const sections = document.querySelectorAll('section, [id]');
            if (sections.length === 0) return;
            
            // Determine which section is in view
            let currentSectionId = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    currentSectionId = section.getAttribute('id');
                }
            });
            
            // Update active class on nav links
            if (currentSectionId) {
                document.querySelectorAll('a[href*="#"]').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').includes(currentSectionId)) {
                        link.classList.add('active');
                    }
                });
            }
        }, 50);
    });
}

// Handle image display when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Apply image display fixes to all relevant images
    document.querySelectorAll('.category-image, .event-image, .event-cover-image').forEach(img => {
        // If the image is already loaded, fix it immediately
        if (img.complete) {
            fixImageDisplay(img);
        } else {
            // Otherwise, wait for it to load
            img.addEventListener('load', function() {
                fixImageDisplay(this);
            });
        }
    });
});