/* ============================================================
   section-loader.js
   - Fetch song song tất cả section từ /sections/*.fragment
   - Inject HTML vào placeholder <div data-section="XX">
   - Preload ảnh hero để tránh Chrome cảnh báo "preloaded but
     not used within a few seconds" (vì hero được inject sau DOM
     ready, không thể preload tĩnh trong <head>)
   - Báo hiệu cho script.js biết DOM đã sẵn sàng
   - Ưu tiên section above-the-fold (00, 01, 02) trước,
     các section còn lại chạy nền bằng requestIdleCallback
   ============================================================ */
(() => {
  'use strict';

  const SECTIONS_DIR = 'sections/';
  // Thứ tự load ưu tiên (above-the-fold trước)
  const PRIORITY_ORDER = [
    '00-scroll-progress', '01-navbar', '02-hero',
    '03-work', '04-about', '05-experience',
    '06-capabilities', '09-testimonials', '07-contact',
    '08-footer'
  ];

  // VS Code Live Server chen client reload vao moi response .html. Voi cac
  // fragment khong co <body>, doan script co the bi chen ngay truoc </svg>,
  // lam hong icon/anh SVG khi fragment duoc gan bang innerHTML.
  const stripInjectedLiveServerClient = (html) => html.replace(
    /<!--\s*Code injected by live-server\s*-->[\s\S]*?<\/script>/gi,
    ''
  );

  // 1. Fetch một section, inject HTML, preload ảnh đầu tiên nếu có
  const fetchSection = async (name) => {
    const slot = document.querySelector(`[data-section="${name}"]`);
    if (!slot) return;
    try {
      // Khi phát triển local, luôn lấy fragment mới nhất. Tránh trường hợp trình
      // duyệt giữ nguyên section cũ dù file HTML đã được cập nhật.
      const isLocal = ['localhost', '127.0.0.1', '[::1]', ''].includes(window.location.hostname);
      const res = await fetch(SECTIONS_DIR + name + '.fragment', {
        cache: isLocal ? 'no-store' : 'default'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = stripInjectedLiveServerClient(await res.text());
      slot.innerHTML = html;

      // Preload ảnh đầu tiên trong section (thường là ảnh LCP/hero) NGAY SAU khi inject
      // để Chrome <img> trong DOM match với preload → không cảnh báo
      const firstImg = slot.querySelector('img[src]');
      if (firstImg) {
        const imgUrl = firstImg.getAttribute('src');
        preloadImage(imgUrl);
      }
    } catch (err) {
      console.error(`[section-loader] Loi load section "${name}":`, err);
      slot.innerHTML = `<p style="color:#EF4444;padding:1rem">Section "${name}" không tải được. Vui lòng thử lại.</p>`;
    }
  };

  // 2. Preload helper — chèn <link rel="preload"> vào <head>
  const preloadImage = (url) => {
    // Tránh tạo trùng
    if (document.querySelector(`link[rel="preload"][href="${url}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    link.setAttribute('fetchpriority', 'high');
    document.head.appendChild(link);
  };

  // 3. Load nhóm ưu tiên (above-the-fold) ngay khi DOM ready
  const loadPriority = () => {
    const priority = PRIORITY_ORDER
      .filter(name => document.querySelector(`[data-section="${name}"]`))
      .slice(0, 3);
    return Promise.all(priority.map(fetchSection));
  };

  // 4. Load các section còn lại khi trình duyệt rảnh
  const loadRest = () => {
    const rest = PRIORITY_ORDER.slice(3).filter(name =>
      document.querySelector(`[data-section="${name}"]`)
    );
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        rest.forEach(fetchSection);
      }, { timeout: 1500 });
    } else {
      setTimeout(() => rest.forEach(fetchSection), 100);
    }
  };

  // 5. Báo cho script.js biết section đã sẵn sàng
  const notifyReady = () => {
    document.documentElement.setAttribute('data-sections-ready', 'true');
    window.dispatchEvent(new CustomEvent('sections:loaded'));
  };

  // 6. Chạy khi DOMContentLoaded (vì script có defer)
  const start = () => {
    loadPriority().then(() => {
      // Ưu tiên load xong thì báo ready để script.js có thể bind các phần tử above-the-fold
      // (navbar, hero) ngay
      notifyReady();
      loadRest();
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
