/* ========================================
   LUMEA COSMETICS - HERO CAROUSEL
   ======================================== */

class HeroCarousel {
    constructor() {
        this.slides = document.querySelectorAll('.hero-slide');
        this.currentSlide = 0;
        this.slideInterval = null;
        this.init();
    }

    init() {
        if (this.slides.length > 0) {
            this.slides[0].classList.add('active');
            this.startAutoPlay();
        }
    }

    showSlide(index) {
        // Remove active class from all slides
        this.slides.forEach(slide => slide.classList.remove('active'));

        // Add active class to current slide
        this.currentSlide = index;
        if (this.currentSlide >= this.slides.length) {
            this.currentSlide = 0;
        }
        if (this.currentSlide < 0) {
            this.currentSlide = this.slides.length - 1;
        }

        this.slides[this.currentSlide].classList.add('active');
    }

    nextSlide() {
        this.showSlide(this.currentSlide + 1);
    }

    prevSlide() {
        this.showSlide(this.currentSlide - 1);
    }

    startAutoPlay() {
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
    }

    stopAutoPlay() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const carousel = new HeroCarousel();

    // Optional: Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            carousel.prevSlide();
            carousel.stopAutoPlay();
            carousel.startAutoPlay();
        } else if (e.key === 'ArrowRight') {
            carousel.nextSlide();
            carousel.stopAutoPlay();
            carousel.startAutoPlay();
        }
    });
});

// Export for use in other files
window.HeroCarousel = HeroCarousel;
