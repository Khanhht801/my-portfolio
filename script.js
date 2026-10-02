/* ============================================================
   script.js — chính của portfolio
   - Chờ section-loader inject xong DOM rồi mới bind events
   - Đợi event "sections:loaded" (phát ra bởi section-loader.js
     khi 3 section above-the-fold đã load xong)
   - Các section còn lại (work, about, ...) load nền bằng
     requestIdleCallback → các script vẫn bind kịp khi user
     cuộn tới
   - ANIMATION LAYER: Khoi tao IntersectionObserver dat rieng
     de fire cac class animate.css khi section vao viewport.
     Dam bao section load nen (work, capabilities, contact, ...)
     cung duoc hieu ung khi user cuon toi.
   ============================================================ */

let isAppInitialized = false;

const initApp = () => {
  // The ready event and timeout fallback can race on slow/static hosting.
  // Initializing once prevents duplicate global listeners and stale DOM refs.
  if (isAppInitialized) return;
  isAppInitialized = true;
  // 0. BAT ANIMATE.CSS READY — bo an .animate-booted placeholder
  //    Lam ngay tai day de animation khong phu thuoc vao section
  //    (hữu ích cho các element đã có sẵn trong DOM như navbar).
  document.documentElement.classList.add('animate-ready');
  // 1. Scroll Progress Bar
  const progressBar = document.getElementById('scroll-progress');
  let scrollUiFrame = 0;
  const updateScrollProgress = () => {
    scrollUiFrame = 0;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = scrollHeight > 0 ? Math.min(1, Math.max(0, scrollTop / scrollHeight)) : 0;
    if (progressBar) {
      progressBar.style.transform = `scaleX(${scrolled})`;
    }
  };
  const requestScrollUiUpdate = () => {
    if (scrollUiFrame) return;
    scrollUiFrame = requestAnimationFrame(updateScrollProgress);
  };
  window.addEventListener('scroll', requestScrollUiUpdate, { passive: true });
  updateScrollProgress();

  // 2. Mobile navigation — animated drawer, focus management and Escape support
  const header = document.getElementById('main-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuScrim = document.getElementById('mobile-menu-scrim');

  if (mobileToggle && mobileMenu) {
    let isMobileMenuOpen = false;

    const getMenuFocusableElements = () => [
      mobileToggle,
      ...mobileMenu.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    ].filter(el => el.offsetParent !== null);

    const setMobileMenu = (shouldOpen, restoreFocus = true) => {
      // Guard: navbar có thể chưa inject xong khi section-loader fallback timeout
      // kích hoạt trên static hosting chậm (vd GitHub Pages).
      if (!mobileToggle || !mobileMenu) return;
      if (isMobileMenuOpen === shouldOpen) return;
      isMobileMenuOpen = shouldOpen;

      mobileToggle.classList.toggle('is-open', shouldOpen);
      mobileMenu.classList.toggle('is-open', shouldOpen);
      mobileMenuScrim?.classList.toggle('is-open', shouldOpen);
      document.body.classList.toggle('menu-open', shouldOpen);

      mobileToggle.setAttribute('aria-expanded', String(shouldOpen));
      mobileToggle.setAttribute('aria-label', shouldOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng');
      mobileMenu.setAttribute('aria-hidden', String(!shouldOpen));
      mobileMenuScrim?.setAttribute('aria-hidden', String(!shouldOpen));

      if (shouldOpen) {
        mobileMenu.removeAttribute('inert');
        requestAnimationFrame(() => mobileMenu.querySelector('a[href]')?.focus());
      } else {
        mobileMenu.setAttribute('inert', '');
        if (restoreFocus) mobileToggle.focus({ preventScroll: true });
      }
    };

    mobileToggle.addEventListener('click', () => setMobileMenu(!isMobileMenuOpen));
    mobileMenuScrim?.addEventListener('click', () => setMobileMenu(false));

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setMobileMenu(false, false));
    });

    document.addEventListener('keydown', (event) => {
      if (!isMobileMenuOpen) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        setMobileMenu(false);
        return;
      }

      if (event.key !== 'Tab') return;
      const focusable = getMenuFocusableElements();
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    const desktopNavQuery = window.matchMedia('(min-width: 1024px)');
    desktopNavQuery.addEventListener('change', (event) => {
      if (event.matches) setMobileMenu(false, false);
    });
  }

  // 3. Scroll Reveal — DISABLED per request (animation khi scroll da tat)
  //    Force hien thi ngay tat ca .reveal-on-scroll, khong can IntersectionObserver.
  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    el.classList.add('is-visible');
  });

  // 4. Compact translucent header on scroll
  if (header) {
    let headerFrame = 0;
    const updateHeaderState = () => {
      headerFrame = 0;
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    const requestHeaderUpdate = () => {
      if (headerFrame) return;
      headerFrame = requestAnimationFrame(updateHeaderState);
    };
    window.addEventListener('scroll', requestHeaderUpdate, { passive: true });
    updateHeaderState();
  }

  // 5. Active Nav Link on scroll (Spy Scroll)
  const navLinks = document.querySelectorAll('.site-nav-link[href^="#"], .mobile-nav-link[href^="#"]');
  const sectionIds = [...new Set(Array.from(navLinks)
    .map(link => link.getAttribute('href').slice(1)))];

  if ('IntersectionObserver' in window && navLinks.length > 0) {
    const setActiveLink = (id) => {
      navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === '#' + id;
        link.classList.toggle('nav-link-active', isActive);
        if (isActive) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    };

    const navObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) {
        setActiveLink(visible[0].target.dataset.navTarget || visible[0].target.id);
      }
    }, {
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0
    });

    const observedNavSections = new Set();
    const observeNavSection = (section) => {
      if (!section || observedNavSections.has(section)) return;
      observedNavSections.add(section);
      navObserver.observe(section);
    };

    const observeAvailableNavSections = (root = document) => {
      sectionIds.forEach((id) => {
        if (root.nodeType === 1 && root.id === id) observeNavSection(root);
        observeNavSection(root.querySelector?.(`#${id}`));
      });
    };

    // Chỉ quan sát section thật có layout box. Các placeholder rỗng dùng
    // display: contents, nên observer gắn quá sớm có thể bỏ lỡ #work khi
    // project gallery được inject và thay đổi chiều cao cho sticky scroll.
    observeAvailableNavSections();
    const navSectionObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) observeAvailableNavSections(node);
        });
      });
    });
    navSectionObserver.observe(document.body, { childList: true, subtree: true });
  }

  // 6. Hero SVG frame — draw lines on scroll (giữ logic, không dùng markup hiện tại)
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
          obs.unobserve(entry);
        }
      });
    }, { threshold: 0.2 });

    frameObserver.observe(heroFrame);
  }

  // 7. About Portrait Slider (autoplay 3s + click ảnh để next + dots + keyboard)
  const setupAboutSlider = (slider) => {
    if (!slider || slider.dataset.sliderBound === 'true') return;

    const slides = Array.from(slider.querySelectorAll('[data-slide]'));
    const slideNextTarget = slider.querySelector('[data-slide-next]');
    const dots = Array.from(slider.querySelectorAll('[data-dot-index]'));
    const slideCount = slider.querySelector('.about-slider__caption-count');
    const total = slides.length;
    if (total < 2) return;
    slider.dataset.sliderBound = 'true';

    const intervalMs = parseInt(slider.dataset.autoplayMs, 10) || 3000;

    let current = 0;
    let timerId = null;
    let isInView = false;

    const showSlide = (nextIndex) => {
      const idx = ((nextIndex % total) + total) % total;
      slides.forEach((slide, i) => {
        slide.classList.toggle('opacity-100', i === idx);
        slide.classList.toggle('opacity-0', i !== idx);
        slide.classList.toggle('z-[1]', i === idx);
        slide.setAttribute('aria-hidden', i === idx ? 'false' : 'true');
      });
      dots.forEach((dot, i) => {
        const active = i === idx;
        dot.classList.toggle('bg-[#007BFF]', active);
        dot.classList.toggle('bg-[#E7E5E4]', !active);
        dot.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      if (slideCount) {
        slideCount.textContent = `${String(idx + 1).padStart(2, '0')} — ${String(total).padStart(2, '0')}`;
      }
      current = idx;
    };

    const goNext = () => showSlide(current + 1);
    const goPrev = () => showSlide(current - 1);

    const start = () => {
      stop();
      if (!isInView || document.hidden) return;
      timerId = window.setInterval(goNext, intervalMs);
    };

    const stop = () => {
      if (timerId !== null) {
        window.clearInterval(timerId);
        timerId = null;
      }
    };

    const bump = () => {
      stop();
      if (isInView && !document.hidden) {
        timerId = window.setInterval(goNext, intervalMs);
      }
    };

    slideNextTarget?.addEventListener('click', () => {
      goNext();
      bump();
    });

    slideNextTarget?.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      goNext();
      bump();
    });

    slider.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goNext();
        bump();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrev();
        bump();
      }
    });

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const target = parseInt(dot.dataset.dotIndex, 10);
        if (!Number.isNaN(target)) {
          showSlide(target);
          bump();
        }
      });
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    });

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

    showSlide(0);
  };

  document.querySelectorAll('[data-autoplay-slider]').forEach(setupAboutSlider);

  // About được load nền sau khi app khởi tạo, nên bind slider ngay khi section xuất hiện.
  const sliderObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== 1 || !node.querySelectorAll) return;
        if (node.matches?.('[data-autoplay-slider]')) setupAboutSlider(node);
        node.querySelectorAll('[data-autoplay-slider]').forEach(setupAboutSlider);
      });
    });
  });
  sliderObserver.observe(document.body, { childList: true, subtree: true });

  // 9. Project gallery — tự chạy khi section đi vào viewport.
  //    Nhân bản một bộ card và dịch đúng chiều rộng bộ gốc để loop liền mạch.
  const setupProjectMarquee = (projectSection) => {
    if (!projectSection || projectSection.dataset.projectMarqueeBound === 'true') return;

    const projectTrack = projectSection.querySelector('[data-project-track]');
    if (!projectTrack) return;

    projectSection.dataset.projectMarqueeBound = 'true';
    projectSection.classList.add('is-project-marquee-ready');

    const originalItems = Array.from(projectTrack.children);
    if (originalItems.length === 0) return;

    originalItems.forEach((item, index) => {
      const clone = item.cloneNode(true);
      clone.dataset.projectMarqueeClone = 'true';
      clone.setAttribute('aria-hidden', 'true');
      clone.setAttribute('inert', '');
      if (index === 0) clone.dataset.projectMarqueeSetStart = 'true';
      projectTrack.appendChild(clone);
    });

    const measureProjectMarquee = () => {
      const firstClone = projectTrack.querySelector('[data-project-marquee-set-start]');
      const cycleWidth = firstClone ? firstClone.offsetLeft - originalItems[0].offsetLeft : 0;
      if (cycleWidth <= 0) return;

      projectTrack.style.setProperty('--project-marquee-translate', `${-cycleWidth}px`);
      projectTrack.style.setProperty('--project-marquee-duration', `${Math.max(32, cycleWidth / 46)}s`);
    };

    let isInViewport = false;
    const syncProjectPlayback = () => {
      const shouldPlay = isInViewport && !document.hidden;
      projectSection.classList.toggle('is-project-marquee-playing', shouldPlay);
    };

    if ('IntersectionObserver' in window) {
      const projectObserver = new IntersectionObserver(([entry]) => {
        isInViewport = entry.isIntersecting;
        syncProjectPlayback();
      }, { threshold: 0.12 });
      projectObserver.observe(projectSection);
    } else {
      isInViewport = true;
      syncProjectPlayback();
    }

    document.addEventListener('visibilitychange', syncProjectPlayback);
    window.addEventListener('resize', () => requestAnimationFrame(measureProjectMarquee), { passive: true });
    requestAnimationFrame(measureProjectMarquee);
  };

  const bindProjectMarqueeWithin = (root) => {
    if (!root || root.nodeType !== 1) return;
    if (root.matches?.('[data-project-marquee]')) setupProjectMarquee(root);
    root.querySelectorAll?.('[data-project-marquee]').forEach(setupProjectMarquee);
  };

  // Bind ngay nếu section đã có, đồng thời theo dõi section được loader inject sau.
  document.querySelectorAll('[data-project-marquee]').forEach(setupProjectMarquee);
  const projectSectionObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach(bindProjectMarqueeWithin);
    });
  });
  projectSectionObserver.observe(document.body, { childList: true, subtree: true });

  // 10. Tech Stack Marquee — tạo đủ bản sao để luôn phủ kín viewport.
  //    Khoảng dịch được đo từ đầu hai bộ icon liên tiếp nên bao gồm cả `gap`;
  //    cách này tránh cú giật nhỏ do translateX(-50%) bị lệch nửa gap.
  const setupMarquee = (track) => {
    if (!track) return;

    track.removeAttribute('data-marquee-ready');
    track.querySelectorAll('[data-marquee-clone]').forEach((clone) => clone.remove());

    const items = Array.from(track.children);
    const mask = track.closest('.marquee-mask');
    if (items.length === 0 || !mask) return;

    const appendItemSet = () => {
      items.forEach((item, index) => {
        const clone = item.cloneNode(true);
        clone.dataset.marqueeClone = 'true';
        clone.setAttribute('aria-hidden', 'true');
        if (index === 0) clone.dataset.marqueeSetStart = 'true';
        track.appendChild(clone);
      });
    };

    // Bản sao đầu tiên cho biết chính xác quãng đường của một chu kỳ.
    appendItemSet();
    const firstClone = track.querySelector('[data-marquee-set-start]');
    const cycleWidth = firstClone.offsetLeft - items[0].offsetLeft;
    if (cycleWidth <= 0) return;

    // Luôn giữ ít nhất một chu kỳ đầy đủ ngoài khung nhìn để không lộ khoảng trống.
    const requiredWidth = mask.clientWidth + cycleWidth;
    while (track.scrollWidth < requiredWidth) appendItemSet();

    track.style.setProperty('--marquee-translate', `${-cycleWidth}px`);
    track.dataset.marqueeReady = 'true';
  };

  //    Áp dụng cho mọi track đã có sẵn trong DOM
  document.querySelectorAll('.marquee-track').forEach(setupMarquee);

  // 10b. Testimonials vertical columns — duplicate nhom card de loop liet mach.
  //     Track dich tu 0 → -100% (do 2 ban group chong len nhau) → quay ve
  //     vi tri ban dau mot cach tron ven.
  const setupTestimonials = (track) => {
    if (!track || track.dataset.testimonialsReady === 'true') return;

    const group = track.querySelector('.testimonials-track__group');
    if (!group) return;

    // Tao ban sao va append vao cuoi track (cloneNode deep = mac dinh)
    const clone = group.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);

    // Đo trực tiếp khoảng cách tới bản sao để bao gồm chính xác gap responsive.
    const translatePx = clone.offsetTop - group.offsetTop;
    track.style.setProperty('--testimonials-translate', `-${translatePx}px`);

    // animation-duration set qua inline style (HTML cung cap data-anim-duration)
    const dur = track.dataset.animDuration || '22s';
    track.style.animationDuration = dur;

    track.dataset.testimonialsReady = 'true';
  };

  // Bind ngay voi cac track da co san trong DOM (khi section 09 inject truoc khi initApp chay)
  document.querySelectorAll('[data-testimonials-track]').forEach(setupTestimonials);

  // Section 09-testimonials load nen qua section-loader.js (requestIdleCallback)
  // — theo doi de duplicate khi section moi inject.
  const testimonialsObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((node) => {
        if (node.nodeType !== 1 || !node.querySelectorAll) return;
        if (node.matches?.('[data-testimonials-track]')) setupTestimonials(node);
        node.querySelectorAll?.('[data-testimonials-track]').forEach(setupTestimonials);
      });
    }
  });
  testimonialsObserver.observe(document.body, { childList: true, subtree: true });

  // Tinh lai khi viewport / font-size thay doi (co the lam group thay doi chieu cao)
  let testimonialsResizeFrame;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(testimonialsResizeFrame);
    testimonialsResizeFrame = requestAnimationFrame(() => {
      document.querySelectorAll('[data-testimonials-track][data-testimonials-ready="true"]').forEach((t) => {
        const groups = t.querySelectorAll('.testimonials-track__group');
        const group = groups[0];
        const clone = groups[1];
        if (group && clone) {
          const translatePx = clone.offsetTop - group.offsetTop;
          t.style.setProperty('--testimonials-translate', `-${translatePx}px`);
        }
      });
    });
  }, { passive: true });

  //    Section 06-capabilities được load nền qua section-loader.js
  //    (requestIdleCallback) — có thể chưa tồn tại khi block này chạy.
  //    MutationObserver bắt các track mới xuất hiện và duplicate ngay,
  //    đảm bảo 2 hàng marquee luôn loop liền mạch không khoảng trắng.
  const marqueeObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((node) => {
        if (node.nodeType !== 1 || !node.querySelectorAll) return;
        // Track chính nó
        if (node.matches && node.matches('.marquee-track')) {
          setupMarquee(node);
        }
        // Track nằm bên trong node mới được inject
        node.querySelectorAll('.marquee-track').forEach(setupMarquee);
      });
    }
  });
  marqueeObserver.observe(document.body, { childList: true, subtree: true });

  // Tính lại khi breakpoint/gap hoặc chiều rộng viewport thay đổi.
  let marqueeResizeFrame;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(marqueeResizeFrame);
    marqueeResizeFrame = requestAnimationFrame(() => {
      document.querySelectorAll('.marquee-track').forEach(setupMarquee);
    });
  }, { passive: true });

  // 10. Re-bind cho cac section load nen (work, about, experience, capabilities,
  //     contact, footer) — DISABLED per request (animation khi scroll da tat)
  //     Moi section moi inject se tu dong hien thi (CSS da force visible),
  //     khong can observer.
  const bindRevealFor = (root) => {
    root.querySelectorAll('.reveal-on-scroll:not(.is-visible)')
      .forEach(el => el.classList.add('is-visible'));
  };

  // Lắng nghe section mới được inject — van quan sat de goi bindRevealFor
  // (giup class is-visible luon duoc them, nhung khong tao animation).
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((node) => {
        if (node.nodeType === 1 && node.querySelectorAll) {
          bindRevealFor(node);
        }
      });
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // 11. ANIMATION OBSERVER (animate.css) — DISABLED per request
  //     (animation khi scroll da tat). Tat ca .animate-booted se duoc
  //     force fire ngay lap tuc, khong can IntersectionObserver.
  const fireAllAnimateBooted = (root = document) => {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll('.animate-booted:not(.animate__triggered)').forEach(el => {
      el.classList.add('animate__triggered', 'animate__animated', el.dataset.anim);
    });
  };

  // Fire ngay voi DOM hien tai
  fireAllAnimateBooted(document);

  // Dam bao section load nen (03-08) cung duoc fire khi inject
  const animateMutObs = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((node) => {
        if (node.nodeType !== 1 || !node.querySelectorAll) return;
        fireAllAnimateBooted(node);
      });
    }
  });
  animateMutObs.observe(document.body, { childList: true, subtree: true });

  // 12. Hero headline stagger — DISABLED per request (animation khi scroll da tat)
  //     Fire ngay tat ca .animate-hero-line, khong can IntersectionObserver.
  document.querySelectorAll('.animate-hero-line').forEach(line => {
    line.classList.add('is-fired');
  });
};

// Chờ section-loader inject xong 3 section above-the-fold rồi mới init
if (document.documentElement.hasAttribute('data-sections-ready')) {
  initApp();
} else {
  window.addEventListener('sections:loaded', initApp, { once: true });
  // Fallback: nếu section-loader lỗi (offline, blocked) hoặc fetch quá chậm
  // trên static hosting (vd GitHub Pages CDN lần đầu), vẫn chạy initApp sau 8s.
  // setMobileMenu() đã có guard null-check, nên chạy sớm không crash — chỉ
  // là navbar chưa có thì user phải đợi section inject xong để có menu mobile.
  setTimeout(() => {
    if (!document.documentElement.hasAttribute('data-sections-ready')) {
      console.warn('[script.js] sections:loaded timeout, chạy initApp fallback');
      initApp();
    }
  }, 8000);
}
