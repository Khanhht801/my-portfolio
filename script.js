document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Progress Bar
  const progressBar = document.getElementById('scroll-progress');
  const updateScrollProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }
  };
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // 3. Scroll Reveal with IntersectionObserver
  const reveals = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  // 4. Header Shadow on scroll
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('shadow-sm');
    } else {
      header.classList.remove('shadow-sm');
    }
  }, { passive: true });

  // 5. Active Nav Link on scroll (Spy Scroll)
  const navLinks = document.querySelectorAll('header nav a[href^="#"]');
  const sections = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length > 0) {
    const setActiveLink = (id) => {
      navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === '#' + id;
        link.classList.toggle('nav-link-active', isActive);
      });
    };

    const navObserver = new IntersectionObserver((entries) => {
      // Find the section closest to top of viewport
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) {
        setActiveLink(visible[0].target.id);
      }
    }, {
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0
    });

    sections.forEach(section => navObserver.observe(section));
  }

  // 6. Hero SVG frame — draw lines on scroll
  const heroFrame = document.querySelector('.hero-frame');
  const heroFrameLines = document.querySelectorAll('.hero-frame-line');
  if (heroFrame && heroFrameLines.length > 0 && 'IntersectionObserver' in window) {
    const drawLines = () => {
      heroFrameLines.forEach((line, i) => {
        setTimeout(() => line.classList.add('is-drawn'), 150 * i);
      });
    };

    const frameObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          drawLines();
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    frameObserver.observe(heroFrame);
  }

  // 7. About Portrait Slider (autoplay 3s + prev/next + dots + pause on user interaction / off-screen / hidden tab)
  const sliders = document.querySelectorAll('[data-autoplay-slider]');

  sliders.forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll('[data-slide]'));
    const prevBtn = slider.querySelector('[data-prev]');
    const nextBtn = slider.querySelector('[data-next]');
    const dots = Array.from(slider.querySelectorAll('[data-dot-index]'));
    const total = slides.length;
    if (total < 2) return;

    const intervalMs = parseInt(slider.dataset.autoplayMs, 10) || 3000;

    let current = 0;
    let timerId = null;
    let isPaused = false;
    let isInView = false;

    const showSlide = (nextIndex) => {
      const idx = ((nextIndex % total) + total) % total;
      slides.forEach((slide, i) => {
        slide.classList.toggle('opacity-100', i === idx);
        slide.classList.toggle('opacity-0', i !== idx);
        slide.classList.toggle('z-[1]', i === idx);
      });
      dots.forEach((dot, i) => {
        const active = i === idx;
        dot.classList.toggle('bg-[#007BFF]', active);
        dot.classList.toggle('bg-[#E7E5E4]', !active);
        dot.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      current = idx;
    };

    const goNext = () => showSlide(current + 1);
    const goPrev = () => showSlide(current - 1);

    const start = () => {
      stop();
      if (isPaused || !isInView) return;
      timerId = window.setInterval(goNext, intervalMs);
    };

    const stop = () => {
      if (timerId !== null) {
        window.clearInterval(timerId);
        timerId = null;
      }
    };

    // Pause khi người dùng tương tác, resume sau intervalMs kể từ lần tương tác cuối
    const bump = () => {
      stop();
      if (!isPaused && isInView) {
        timerId = window.setInterval(goNext, intervalMs);
      }
    };

    if (nextBtn) nextBtn.addEventListener('click', () => { goNext(); bump(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { goPrev(); bump(); });

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const target = parseInt(dot.dataset.dotIndex, 10);
        if (!Number.isNaN(target)) {
          showSlide(target);
          bump();
        }
      });
    });

    // Tạm dừng khi hover vào slider
    slider.addEventListener('mouseenter', () => { isPaused = true; stop(); });
    slider.addEventListener('mouseleave', () => { isPaused = false; start(); });

    // Tạm dừng khi tab bị ẩn
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    });

    // Autoplay chỉ chạy khi section about nằm trong viewport
    if ('IntersectionObserver' in window) {
      const inViewObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isInView = entry.isIntersecting;
          if (isInView) {
            start();
          } else {
            stop();
          }
        });
      }, { threshold: 0.25 });

      inViewObserver.observe(slider);
    } else {
      start();
    }

    // Khởi tạo slide đầu tiên
    showSlide(0);
  });
});
