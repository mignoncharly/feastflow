// Dashboard JavaScript - FeastFlow Modern Dashboard

document.addEventListener('DOMContentLoaded', function() {
    // Initialize statistics counter animation
    animateStatCounters();
    
    // Initialize upcoming events slider
    initializeEventSlider();
    
    // Initialize tips carousel
    initializeTipsCarousel();
});

/**
 * Animates the statistics counters
 */
function animateStatCounters() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach(card => {
        const counter = card.querySelector('.stat-counter');
        const targetValue = parseInt(card.dataset.value);
        
        if (isNaN(targetValue)) return;
        
        const duration = 1500; // Animation duration in milliseconds
        const framesPerSecond = 60;
        const totalFrames = duration / 1000 * framesPerSecond;
        let currentFrame = 0;
        
        const initialValue = 0;
        const valueIncrement = (targetValue - initialValue) / totalFrames;
        
        counter.textContent = initialValue;
        
        const animate = () => {
            currentFrame++;
            const newValue = Math.round(initialValue + valueIncrement * currentFrame); 
            
            counter.textContent = newValue;
            
            if (currentFrame < totalFrames) {
                requestAnimationFrame(animate);
            } else {
                counter.textContent = targetValue;
            }
        };
        
        // Add a slight delay to make it more visually appealing
        setTimeout(() => {
            animate();
        }, 300);
    });
}

/**
 * Initializes the upcoming events slider
 */
function initializeEventSlider() {
    const sliderTrack = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.upcoming-event-slide');
    const dotsContainer = document.querySelector('.slider-dots');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!sliderTrack || slides.length === 0) return;
    
    let currentIndex = 0;
    const slideWidth = 100; // Percentage width
    
    // Determine the number of visible slides based on viewport width
    const getVisibleSlides = () => {
        if (window.innerWidth >= 1200) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    };
    
    // Update slider position based on current index
    const updateSlider = () => {
        const visibleSlides = getVisibleSlides();
        const maxIndex = Math.max(0, slides.length - visibleSlides);
        
        // Ensure current index is within bounds
        currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
        
        // Update track position
        const offset = -currentIndex * (slideWidth / visibleSlides);
        sliderTrack.style.transform = `translateX(${offset}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        // Update button states
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex === maxIndex;
    };
    
    // Event listeners for prev/next buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = Math.max(0, currentIndex - 1);
            updateSlider();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const visibleSlides = getVisibleSlides();
            const maxIndex = Math.max(0, slides.length - visibleSlides);
            currentIndex = Math.min(maxIndex, currentIndex + 1);
            updateSlider();
        });
    }
    
    // Event listeners for dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateSlider();
        });
    });
    
    // Handle window resize to adjust number of visible slides
    window.addEventListener('resize', () => {
        updateSlider();
    });
    
    // Initialize slider
    updateSlider();
    
    // Auto-play functionality for the slider
    let autoplayInterval;
    
    const startAutoplay = () => {
        autoplayInterval = setInterval(() => {
            const visibleSlides = getVisibleSlides();
            const maxIndex = Math.max(0, slides.length - visibleSlides);
            
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            
            updateSlider();
        }, 5000); // Change slide every 5 seconds
    };
    
    const stopAutoplay = () => {
        clearInterval(autoplayInterval);
    };
    
    // Start autoplay by default
    startAutoplay();
    
    // Pause autoplay on hover
    const sliderContainer = document.querySelector('.upcoming-events-slider');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoplay);
        sliderContainer.addEventListener('mouseleave', startAutoplay);
    }
}

/**
 * Initializes the tips carousel
 */
function initializeTipsCarousel() {
    const slides = document.querySelectorAll('.tip-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    const prevButton = document.querySelector('.prev-tip');
    const nextButton = document.querySelector('.next-tip');
    
    if (slides.length === 0) return;
    
    let currentIndex = 0;
    
    // Function to update the active slide
    const updateSlide = (index) => {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Update indicators
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Show the current slide
        slides[index].classList.add('active');
        
        // Update the active indicator
        indicators[index].classList.add('active');
    };
    
    // Event listeners for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateSlide(currentIndex);
        });
    });
    
    // Event listener for previous button
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlide(currentIndex);
        });
    }
    
    // Event listener for next button
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlide(currentIndex);
        });
    }
    
    // Auto-rotate the tips
    let autoRotateInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlide(currentIndex);
    }, 8000); // Change tip every 8 seconds
    
    // Pause auto-rotation on hover
    const carousel = document.querySelector('.tips-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoRotateInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            autoRotateInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateSlide(currentIndex);
            }, 8000);
        });
    }
    
    // Initialize the first slide
    updateSlide(currentIndex);
}

/**
 * Apply custom hover effects and animations throughout the dashboard
 */
function enhanceDashboardInteractivity() {
    // Add hover effect to cards
    const allCards = document.querySelectorAll('.content-card, .sidebar-card');
    
    allCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn, .action-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.classList.add('ripple-effect');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Initialize all dashboard enhancements
enhanceDashboardInteractivity();  