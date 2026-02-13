/* CONFIGURATION */
const CONFIG = {
    // 4-digit PIN to unlock the site
    PIN: '0908',
    
    // Array of photo filenames in the assets folder
    PHOTOS: [
        { filename: 'cuties.jpg'},
        { filename: 'firstdate.jpg'},
        { filename: 'firstkain.jpg'},
        { filename: 'firstsb.jpg'},
        { filename: 'firstphotobooth.jpg'},
        { filename: 'firstramen.jpg'}
    ],
    
    // Message to display in the envelope modal
    MESSAGE: `My Dearest, Riam,

It's our first Valentines and I want this to be nothing short but memorable. Words cannot express how much I appreciate you, how much I am rooting for you, and only God knows how deep is my love for you. I knew my heart had found its home when I'm in your arms, I long for your voice as you caress me with gentleness, and you're the reality I yearn for be it today or in the future.

You bring light to my darkest days and make my happiest moments even brighter. Your laugh is my favorite sound, your smile heals a part of me, and your love is the gift I'm most grateful for.

Thank you for choosing me, for loving me, for being patient with me, and for making every single effort to keep and hold on to us. I promise to cherish you, support you, and love you with all that I am, today and always.

Here's to us, to our story, and to all the beautiful chapters yet to be written.

Forever yours,
With all my love 
-Gerald♡`,
    
    // Theme colors (matches CSS variables)
    THEME_COLORS: {
        primary: '#A8D8FF',
        accent: '#7FB8FF',
        deep: '#3B7BBF',
        background: '#F7FBFF'
    }
};

/* ================================
   STATE MANAGEMENT
   ================================ */
const state = {
    currentPin: '',
    attempts: 0,
    maxAttempts: 3,
    currentLightboxIndex: 0,
    isEnvelopeOpen: false
};

/* ================================
   DOM ELEMENTS
   ================================ */
const elements = {
    pinGate: document.getElementById('pinGate'),
    mainContent: document.getElementById('mainContent'),
    pinInputs: document.querySelectorAll('.pin-digit'),
    errorMessage: document.querySelector('.error-message'),
    attemptsCount: document.getElementById('attemptsCount'),
    galleryGrid: document.getElementById('galleryGrid'),
    envelopeBtn: document.getElementById('envelopeBtn'),
    lightbox: document.getElementById('lightbox'),
    lightboxImage: document.querySelector('.lightbox-image'),
    lightboxCounter: document.querySelector('.lightbox-counter'),
    messageModal: document.getElementById('messageModal'),
    modalMessage: document.getElementById('modalMessage'),
    confettiContainer: document.querySelector('.confetti-container')
};

/* ================================
   PIN GATE LOGIC
   ================================ */
function initPinGate() {
    elements.pinInputs.forEach((input, index) => {
        // Only allow numeric input
        input.addEventListener('input', (e) => {
            const value = e.target.value.replace(/[^0-9]/g, '');
            e.target.value = value;
            
            if (value) {
                e.target.classList.add('filled');
                // Auto-advance to next input
                if (index < elements.pinInputs.length - 1) {
                    elements.pinInputs[index + 1].focus();
                } else {
                    // All digits entered, validate
                    validatePin();
                }
            } else {
                e.target.classList.remove('filled');
            }
        });
        
        // Handle backspace
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                elements.pinInputs[index - 1].focus();
                elements.pinInputs[index - 1].value = '';
                elements.pinInputs[index - 1].classList.remove('filled');
            }
        });
        
        // Handle paste
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 4);
            
            pastedData.split('').forEach((digit, i) => {
                if (i < elements.pinInputs.length) {
                    elements.pinInputs[i].value = digit;
                    elements.pinInputs[i].classList.add('filled');
                }
            });
            
            if (pastedData.length === 4) {
                validatePin();
            }
        });
    });
    
    // Focus first input on load
    elements.pinInputs[0].focus();
}

function validatePin() {
    const enteredPin = Array.from(elements.pinInputs).map(input => input.value).join('');
    
    if (enteredPin === CONFIG.PIN) {
        // Correct PIN
        unlockSite();
    } else {
        // Incorrect PIN
        state.attempts++;
        elements.attemptsCount.textContent = state.attempts;
        
        // Show error
        elements.errorMessage.textContent = 'Incorrect PIN. Try again.';
        elements.pinInputs.forEach(input => input.classList.add('error'));
        
        setTimeout(() => {
            elements.pinInputs.forEach(input => {
                input.classList.remove('error');
                input.value = '';
                input.classList.remove('filled');
            });
            elements.errorMessage.textContent = '';
            elements.pinInputs[0].focus();
        }, 1000);
        
        // Show hint after max attempts
        if (state.attempts >= state.maxAttempts) {
            setTimeout(() => {
                elements.errorMessage.textContent = '💡 Hint: Think of a special date...';
            }, 1500);
        }
    }
}

function unlockSite() {
    // Fade out pin gate
    elements.pinGate.classList.remove('active');
    
    // Fade in main content
    setTimeout(() => {
        elements.mainContent.classList.add('active');
    }, 300);
}

/* ================================
   GALLERY
   ================================ */
function initGallery() {
    CONFIG.PHOTOS.forEach((photo, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <img src="assets/${photo.filename}" 
                 alt="${photo.alt}" 
                 loading="lazy"
                 data-index="${index}">
        `;
        
        // Click to open lightbox
        item.addEventListener('click', () => openLightbox(index));
        
        elements.galleryGrid.appendChild(item);
    });
}

/* ================================
   LIGHTBOX
   ================================ */
function openLightbox(index) {
    state.currentLightboxIndex = index;
    updateLightboxImage();
    elements.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus trap
    trapFocus(elements.lightbox);
}

function closeLightbox() {
    elements.lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function updateLightboxImage() {
    const photo = CONFIG.PHOTOS[state.currentLightboxIndex];
    elements.lightboxImage.src = `assets/${photo.filename}`;
    elements.lightboxImage.alt = photo.alt;
    elements.lightboxCounter.textContent = `${state.currentLightboxIndex + 1} / ${CONFIG.PHOTOS.length}`;
}

function navigateLightbox(direction) {
    if (direction === 'next') {
        state.currentLightboxIndex = (state.currentLightboxIndex + 1) % CONFIG.PHOTOS.length;
    } else {
        state.currentLightboxIndex = (state.currentLightboxIndex - 1 + CONFIG.PHOTOS.length) % CONFIG.PHOTOS.length;
    }
    updateLightboxImage();
}

function initLightbox() {
    // Close button
    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    
    // Navigation buttons
    document.querySelector('.lightbox-prev').addEventListener('click', () => navigateLightbox('prev'));
    document.querySelector('.lightbox-next').addEventListener('click', () => navigateLightbox('next'));
    
    // Click outside to close
    elements.lightbox.addEventListener('click', (e) => {
        if (e.target === elements.lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!elements.lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox('prev');
        if (e.key === 'ArrowRight') navigateLightbox('next');
    });
}

/* ================================
   ENVELOPE & MESSAGE MODAL
   ================================ */
function initEnvelope() {
    elements.envelopeBtn.addEventListener('click', () => {
        // Animate envelope opening
        elements.envelopeBtn.classList.add('opening');
        elements.envelopeBtn.setAttribute('aria-expanded', 'true');
        
        // Open modal after animation
        setTimeout(() => {
            openMessageModal();
        }, 600);
    });
}

function openMessageModal() {
    // Set message content
    elements.modalMessage.innerHTML = CONFIG.MESSAGE.split('\n\n').map(p => `<p>${p}</p>`).join('');
    
    // Show modal
    elements.messageModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Create confetti
    createConfetti();
    
    // Focus trap
    trapFocus(elements.messageModal);
}

function closeMessageModal() {
    elements.messageModal.classList.remove('active');
    document.body.style.overflow = '';
}

function initMessageModal() {
    // Close button
    document.querySelector('.modal-close').addEventListener('click', closeMessageModal);
    
    // Click outside to close
    document.querySelector('.modal-overlay').addEventListener('click', closeMessageModal);
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.messageModal.classList.contains('active')) {
            closeMessageModal();
        }
    });
}

/* ================================
   CONFETTI ANIMATION
   ================================ */
function createConfetti() {
    const colors = [CONFIG.THEME_COLORS.primary, CONFIG.THEME_COLORS.accent, CONFIG.THEME_COLORS.deep];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        confetti.style.animationDuration = `${2 + Math.random() * 2}s`;
        
        // Random shapes
        if (Math.random() > 0.5) {
            confetti.style.borderRadius = '50%';
        }
        
        elements.confettiContainer.appendChild(confetti);
        
        // Remove after animation
        setTimeout(() => {
            confetti.remove();
        }, 4000);
    }
}

/* ================================
   ACCESSIBILITY - FOCUS TRAP
   ================================ */
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    const handleTab = (e) => {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
                e.preventDefault();
            }
        }
    };
    
    element.addEventListener('keydown', handleTab);
    
    // Focus first element
    if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
    }
}

/* ================================
   INITIALIZATION
   ================================ */
function init() {
    initPinGate();
    initGallery();
    initLightbox();
    initEnvelope();
    initMessageModal();
    
    // Check if already unlocked (for development)
    // Comment out in production
    // unlockSite();
}

// Run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

/* ================================
   EXPORT CONFIG FOR EASY EDITING
   ================================ */
// This allows easy configuration changes without touching the logic
window.VALENTINE_CONFIG = CONFIG;
