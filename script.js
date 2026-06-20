/* ===========================================
   iHub Africa — script.js
   Handles:
   1. Testimonial card carousel (arrows, dots, swipe, keyboard, autoplay)
   2. Partners logo marquee (infinite right-moving banner)
   3. Contact Form Validation
=========================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTestimonialCarousel();
    initPartnersMarquee();
    initContactForm();
});

/* -----------------------------------------
   1. Testimonial Carousel
----------------------------------------- */
function initTestimonialCarousel() {
    const carousel = document.querySelector('[data-carousel]');
    if (!carousel) return;

    const track = carousel.querySelector('[data-track]');
    const cards = Array.from(track.children);
    const prevBtn = carousel.querySelector('.carousel-arrow.prev');
    const nextBtn = carousel.querySelector('.carousel-arrow.next');
    const dotsWrapper = document.querySelector('[data-dots]');

    if (!cards.length) return;

    let index = 0;
    let autoplayId = null;
    const AUTOPLAY_DELAY = 6000;

    /* Build one dot per card */
    cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.type = 'button';
        dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsWrapper.appendChild(dot);
    });
    const dots = Array.from(dotsWrapper.children);

    function update() {
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    }

    function goTo(i) {
        index = (i + cards.length) % cards.length;
        update();
        restartAutoplay();
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);

    /* Keyboard support, when the carousel itself is focused */
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
    });

    /* Swipe support for touch devices */
    let startX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        stopAutoplay();
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;

        if (Math.abs(diff) > 40) {
            diff > 0 ? next() : prev();
        }

        isDragging = false;
        restartAutoplay();
    });

    /* If a student photo is missing, fall back to an initials avatar
       instead of showing a broken image icon */
    cards.forEach((card) => {
        const img = card.querySelector('.testimonial-photo');
        if (!img) return;

        img.addEventListener('error', () => {
            const initials = img.dataset.initials || '?';
            const fallback = document.createElement('div');
            fallback.className = 'testimonial-photo testimonial-photo-fallback';
            fallback.textContent = initials;
            img.replaceWith(fallback);
        });
    });

    function startAutoplay() {
        autoplayId = setInterval(next, AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
        clearInterval(autoplayId);
    }

    function restartAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    /* Pause on hover or keyboard focus so people can actually read it */
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', startAutoplay);

    update();
    startAutoplay();
}

/* -----------------------------------------
   2. Partners Marquee (infinite, moves right)
----------------------------------------- */
function initPartnersMarquee() {
    const marquee = document.querySelector('[data-marquee]');
    if (!marquee) return;

    const track = marquee.querySelector('[data-track]');
    if (!track) return;

    /* Duplicate the logos once so the loop has no visible seam.
       The CSS animation slides this doubled track from -50% to 0%. */
    track.innerHTML += track.innerHTML;

    /* Pause on hover so people can read a specific logo */
    marquee.addEventListener('mouseenter', () => track.classList.add('paused'));
    marquee.addEventListener('mouseleave', () => track.classList.remove('paused'));
}

/* -----------------------------------------
   3. Contact Form Validation
----------------------------------------- */
function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const messageError = document.getElementById("messageError");
    const successMessage = document.getElementById("successMessage");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        nameError.textContent = "";
        emailError.textContent = "";
        messageError.textContent = "";
        successMessage.textContent = "";

        let isValid = true;

        if (nameInput.value.trim() === "") {
            nameError.textContent = "Please enter your full name.";
            isValid = false;
        }

        if (emailInput.value.trim() === "") {
            emailError.textContent = "Please enter your email address.";
            isValid = false;
        } else if (!emailInput.value.includes("@") || !emailInput.value.includes(".")) {
            emailError.textContent = "Please enter a valid email address.";
            isValid = false;
        }

        if (messageInput.value.trim() === "") {
            messageError.textContent = "Please enter your message.";
            isValid = false;
        }

        if (isValid) {
            successMessage.textContent = "Your message has been sent successfully!";
            form.reset();
        }
    });
}