/* main.ts - shared across all pages */

type MaybeElement<T extends Element> = T | null;

function query<T extends Element>(selector: string, root: ParentNode = document): MaybeElement<T> {
  return root.querySelector(selector) as MaybeElement<T>;
}

class CursorController {
  private dot: HTMLDivElement | null = null;
  private ring: HTMLDivElement | null = null;
  private pointerX = 0;
  private pointerY = 0;
  private ringX = 0;
  private ringY = 0;
  private rafId: number | null = null;

  public init(): void {
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

  private handleMouseMove = (event: MouseEvent): void => {
    this.pointerX = event.clientX;
    this.pointerY = event.clientY;

    if (this.dot) {
      this.dot.style.left = `${this.pointerX}px`;
      this.dot.style.top = `${this.pointerY}px`;
    }
  };

  private startAnimationLoop(): void {
    const animate = (): void => {
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

  public destroy(): void {
    if (this.rafId !== null) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}

class RevealController {
  public init(): void {
    const revealElements = Array.from(document.querySelectorAll<HTMLElement>('.reveal, .reveal-x'));

    if (revealElements.length === 0) {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach((element) => element.classList.add('up'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('up');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1 }
    );

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
  public init(): void {
    this.attachScrollState();
    this.attachMobileMenu();
    this.markActiveLink();
  }

  private attachScrollState(): void {
    const nav = query<HTMLElement>('.nav');
    if (!nav) {
      return;
    }

    const updateScrollClass = (): void => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };

    window.addEventListener('scroll', updateScrollClass, { passive: true });
    updateScrollClass();
  }

  private attachMobileMenu(): void {
    const hamburger = query<HTMLButtonElement>('.nav-hamburger');
    const navLinks = query<HTMLElement>('.nav-links');

    if (!hamburger || !navLinks) {
      return;
    }

    hamburger.setAttribute('aria-expanded', 'false');

    const toggleMenu = (): void => {
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

  private markActiveLink(): void {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll<HTMLAnchorElement>('.nav-links a').forEach((link) => {
      const hrefPage = link.getAttribute('href')?.split('/').pop();
      if (hrefPage === currentPage) {
        link.classList.add('active');
      }
    });
  }
}

class ContactFormController {
  public init(): void {
    const contactForm = query<HTMLElement>('#contactForm');
    const confirmation = query<HTMLElement>('#formConfirm');
    const submitButton = query<HTMLButtonElement>('.submit-btn');

    if (!contactForm || !confirmation || !submitButton) {
      return;
    }

    const submitForm = (): void => {
      contactForm.style.display = 'none';
      confirmation.classList.add('show');
    };

    submitButton.addEventListener('click', (event) => {
      event.preventDefault();
      submitForm();
    });

    (window as Window & { handleSubmit?: () => void }).handleSubmit = submitForm;
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


