/* ============================================================
   auto-reload.js — Dev-only auto-reload cho python -m http.server
   ------------------------------------------------------------
   python http.server KHONG co watch + KHONG day WebSocket event.
   Giai phap: polling nhẹ — moi 1.5s gui HEAD request toi index.html,
   so sanh Last-Modified + Content-Length. Neu doi → location.reload().

   Cach dung:
     1. Them  <script src="auto-reload.js" defer></script>
        vao cuoi <body> index.html (hoac ben canh section-loader.js).
     2. Mo trang qua http://localhost:8765/ — script tu kich hoat.
     3. Sua file bat ky (html/css/js trong sections/) → save → 1.5s sau
        trang se tu reload, khong can F5.

   Tat auto-reload:
     - Mo DevTools Console go: localStorage.setItem('autoreload','0')
     - Reload trang (hoac them ?autoreload=0 vao URL)
     - Bat lai:           localStorage.setItem('autoreload','1')

   Khong anh huong production:
     - File nay chi polling, khong sua DOM/khong can CSS.
     - Khi deploy that, xoa the <script> trong index.html la xong.
   ============================================================ */
(() => {
  'use strict';

  // 0. Guard: chi chay khi host la localhost / 127.0.0.1 / [::1].
  //    Tranh dot nhien reload trang production neu user copy nham file.
  const host = location.hostname;
  const isLocal = host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host === '';
  if (!isLocal) {
    console.info('[auto-reload] Khong phai local dev, script khong kich hoat.');
    return;
  }

  // 1. Cho phep tat/bat qua query string hoac localStorage
  const url = new URL(location.href);
  if (url.searchParams.has('autoreload')) {
    const flag = url.searchParams.get('autoreload');
    if (flag === '0') localStorage.setItem('autoreload', '0');
    else if (flag === '1') localStorage.setItem('autoreload', '1');
  }
  if (localStorage.getItem('autoreload') === '0') {
    console.info('[auto-reload] Da tat qua localStorage. Bat lai: localStorage.setItem("autoreload","1")');
    return;
  }

  // 2. Canh bao neu file <script> nay con o trong index.html khi deploy
  console.info(
    '%c[auto-reload] Dev mode ON — polling moi 1.5s. '
    + 'Nho XOA the <script src="auto-reload.js"> khi deploy!',
    'color:#F59E0B;font-weight:bold'
  );

  // 3. Fetch signature nhe (HEAD nhanh hon GET)
  //    Dung index.html lam "canh bao" vi no la entrypoint.
  //    Khi index.html thay doi (hoac bat ky file no import qua fetch
  //    trong section-loader.js), user thuong save lai index truoc.
  //    Cu them 1 GET nho vao 1 file import moi (style.css) de bat
  //    ca truong hop sua CSS ma khong sua index.html.
  const WATCH_TARGETS = [
    { url: 'index.html', parse: h => `${h.get('Last-Modified') || ''}|${h.get('Content-Length') || ''}` },
    { url: 'style.css',  parse: h => `${h.get('Last-Modified') || ''}|${h.get('Content-Length') || ''}` },
    { url: 'script.js',  parse: h => `${h.get('Last-Modified') || ''}|${h.get('Content-Length') || ''}` },
    { url: 'section-loader.js', parse: h => `${h.get('Last-Modified') || ''}|${h.get('Content-Length') || ''}` },
  ];

  const STORAGE_KEY = 'autoreload_signatures';
  const POLL_MS = 1500;

  // 4. Doc signatures da luu (neu co)
  const loadStored = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (_) {
      return {};
    }
  };
  const saveStored = (sigs) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sigs));
    } catch (_) { /* full quota — bo qua */ }
  };

  // 5. Poll mot vong: HEAD tung target, so sanh voi stored
  const poll = async () => {
    const stored = loadStored();
    const next = { ...stored };
    let changed = false;

    // Dung Promise.allSettled de 1 file loi khong chan cac file khac
    const results = await Promise.allSettled(
      WATCH_TARGETS.map(async (t) => {
        // cache: 'no-store' + timestamp query de TRÁNH HTTP cache cua browser.
        // python http.server tra Cache-Control mac dinh rat yeu, nhung
        // Chrome van co the tra 304 neu co ETag. cache:'no-store' tat het.
        const res = await fetch(t.url + '?_=' + Date.now(), {
          method: 'HEAD',
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const sig = t.parse(res.headers);
        if (stored[t.url] && stored[t.url] !== sig) {
          changed = true;
          console.info('[auto-reload] Thay doi:', t.url, '→ reload');
        }
        next[t.url] = sig;
      })
    );

    // Neu co loi fetch (vd dang reload trang, server bi giat), giu nguyen stored
    const allOk = results.every(r => r.status === 'fulfilled');
    if (allOk) {
      saveStored(next);
      if (changed) {
        // Luu lai ngay truoc khi reload, de lan sau khong reload lai ngay
        location.reload();
        return; // dung poll
      }
    }

    setTimeout(poll, POLL_MS);
  };

  // 6. Khoi dong sau khi page xong load (tranh canh tranh voi section-loader)
  if (document.readyState === 'complete') {
    setTimeout(poll, 500);
  } else {
    window.addEventListener('load', () => setTimeout(poll, 500), { once: true });
  }
})();
