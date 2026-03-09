"use strict";
/* main.ts - shared across all pages */
function query(selector, root = document) {
    return root.querySelector(selector);
}
class CursorController {
    constructor() {
        this.dot = null;
        this.ring = null;
        this.pointerX = 0;
        this.pointerY = 0;
        this.ringX = 0;
        this.ringY = 0;
        this.rafId = null;
        this.handleMouseMove = (event) => {
            this.pointerX = event.clientX;
            this.pointerY = event.clientY;
            if (this.dot) {
                this.dot.style.left = `${this.pointerX}px`;
                this.dot.style.top = `${this.pointerY}px`;
            }
        };
    }
    init() {
        const supportsHoverPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        if (!supportsHoverPointer) {
            return;
        }
        this.dot = document.createElement('div');
        this.dot.className = 'c-dot';
        this.ring = document.createElement('div');
        this.ring.className = 'c-ring';
        document.body.append(this.dot, this.ring);
        document.addEventListener('mousemove', this.handleMouseMove, { passive: true });
        this.startAnimationLoop();
    }
    startAnimationLoop() {
        const animate = () => {
            if (!this.ring) {
                return;
            }
            this.ringX += (this.pointerX - this.ringX) * 0.25;
            this.ringY += (this.pointerY - this.ringY) * 0.25;
            this.ring.style.left = `${this.ringX}px`;
            this.ring.style.top = `${this.ringY}px`;
            this.rafId = window.requestAnimationFrame(animate);
        };
        this.rafId = window.requestAnimationFrame(animate);
    }
    destroy() {
        if (this.rafId !== null) {
            window.cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }
}
class RevealController {
    init() {
        const revealElements = Array.from(document.querySelectorAll('.reveal, .reveal-x'));
        if (revealElements.length === 0) {
            return;
        }
        if (!('IntersectionObserver' in window)) {
            revealElements.forEach((element) => element.classList.add('up'));
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }
                entry.target.classList.add('up');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.1 });
        revealElements.forEach((element) => observer.observe(element));
        window.setTimeout(() => {
            revealElements.forEach((element) => {
                const rect = element.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    element.classList.add('up');
                }
            });
        }, 100);
    }
}
class NavController {
    init() {
        this.attachScrollState();
        this.attachMobileMenu();
        this.markActiveLink();
    }
    attachScrollState() {
        const nav = query('.nav');
        if (!nav) {
            return;
        }
        const updateScrollClass = () => {
            nav.classList.toggle('scrolled', window.scrollY > 40);
        };
        window.addEventListener('scroll', updateScrollClass, { passive: true });
        updateScrollClass();
    }
    attachMobileMenu() {
        const hamburger = query('.nav-hamburger');
        const navLinks = query('.nav-links');
        if (!hamburger || !navLinks) {
            return;
        }
        hamburger.setAttribute('aria-expanded', 'false');
        const toggleMenu = () => {
            const isOpen = navLinks.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', String(isOpen));
        };
        hamburger.addEventListener('click', toggleMenu);
        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }
    markActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-links a').forEach((link) => {
            const hrefPage = link.getAttribute('href')?.split('/').pop();
            if (hrefPage === currentPage) {
                link.classList.add('active');
            }
        });
    }
}
class ContactFormController {
    init() {
        const contactForm = query('#contactForm');
        const confirmation = query('#formConfirm');
        const submitButton = query('.submit-btn');
        if (!contactForm || !confirmation || !submitButton) {
            return;
        }
        const submitForm = () => {
            contactForm.style.display = 'none';
            confirmation.classList.add('show');
        };
        submitButton.addEventListener('click', (event) => {
            event.preventDefault();
            submitForm();
        });
        window.handleSubmit = submitForm;
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const cursorController = new CursorController();
    const revealController = new RevealController();
    const navController = new NavController();
    const contactFormController = new ContactFormController();
    cursorController.init();
    revealController.init();
    navController.init();
    contactFormController.init();
});
