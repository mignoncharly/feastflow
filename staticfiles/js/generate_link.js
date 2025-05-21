// generate_link.js

// Initialize Particles.js
document.addEventListener('DOMContentLoaded', function() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS("particles-js", {
            "particles": {
                "number": {
                    "value": 30,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#ffffff"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": 0.3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 5,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#ffffff",
                    "opacity": 0.2,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": false,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 0.5
                        }
                    },
                    "push": {
                        "particles_nb": 4
                    }
                }
            },
            "retina_detect": true
        });
    }
    
    // Add floating animation to cards
    const mainCard = document.querySelector('.main-card');
    if (mainCard) {
        mainCard.classList.add('animate-float');
    }
    
    // Focus input when modal opens
    const qrModal = document.getElementById('qrCodeModal');
    if (qrModal) {
        qrModal.addEventListener('shown.bs.modal', function() {
            const downloadBtn = qrModal.querySelector('.btn-modal-download');
            if (downloadBtn) {
                downloadBtn.focus();
            }
        });
    }
});

// Copy link to clipboard function
function copyLink() {
    const linkInput = document.getElementById('contributionLink');
    if (!linkInput) return;
    
    // Select the text
    linkInput.select();
    linkInput.setSelectionRange(0, 99999);
    
    // Copy to clipboard
    try {
        document.execCommand('copy');
        
        // Update button to show success
        const copyBtn = document.getElementById('copyLinkBtn');
        if (copyBtn) {
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="bi bi-check"></i> <span>Copied!</span>';
            copyBtn.classList.add('copy-success');
            
            // Reset button after delay
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.classList.remove('copy-success');
            }, 2000);
        }
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
}

// Copy table link by ID
function copyLinkById(id) {
    const linkInput = document.getElementById(id);
    if (!linkInput) return;
    
    // Select the text
    linkInput.select();
    linkInput.setSelectionRange(0, 99999);
    
    // Copy to clipboard
    try {
        document.execCommand('copy');
        
        // Find the button and update it
        const button = document.querySelector(`#${id}`).nextElementSibling;
        if (button) {
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="bi bi-check"></i>';
            button.classList.add('copy-success');
            
            // Reset button after delay
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.classList.remove('copy-success');
            }, 2000);
        }
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
}

// Add CSS class for button hover effect
document.addEventListener('DOMContentLoaded', function() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn-generate, .btn-back, .btn-qr, .btn-modal-download, .btn-modal-close');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add subtle hover animation to table rows
    const tableRows = document.querySelectorAll('.links-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Create custom styles for .copy-success and .ripple-effect
document.addEventListener('DOMContentLoaded', function() {
    // Create style element
    const style = document.createElement('style');
    
    // Add CSS for copy success animation
    style.innerHTML = `
        .copy-success {
            background-color: #10b981 !important;
            color: white !important;
        }
        
        .ripple-effect {
            position: absolute;
            background: rgba(255, 255, 255, 0.4);
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
        
        .animate-float {
            animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
            0% {
                transform: translateY(0px);
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            }
            50% {
                transform: translateY(-10px);
                box-shadow: 0 25px 25px -10px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            }
            100% {
                transform: translateY(0px);
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            }
        }
    `;
    
    // Append to head
    document.head.appendChild(style);
});