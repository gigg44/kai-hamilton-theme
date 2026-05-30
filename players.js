/* Kai-Hamilton blog — interactions (vanilla) */
(function () {
  /* --- nav shadow on scroll --- */
  const nav = document.querySelector('.nav');
  const onScroll = () => nav && nav.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- filter chips --- */
  const chips = document.querySelectorAll('.chip[data-filter]');
  const entries = [...document.querySelectorAll('.entry')];
  // counts
  chips.forEach((c) => {
    const f = c.dataset.filter;
    const ctEl = c.querySelector('.ct');
    if (!ctEl) return;
    const n = f === 'all' ? entries.length : entries.filter((e) => e.dataset.group === f).length;
    ctEl.textContent = n;
  });
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'));
      const f = chip.dataset.filter;
      // Use live querySelectorAll to include dynamically loaded entries
      document.querySelectorAll('.entry').forEach((e) => {
        e.classList.toggle('is-hidden', !(f === 'all' || e.dataset.group === f));
      });
    });
  });

  /* --- article expand --- */
  document.querySelectorAll('.read-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const art = btn.closest('.article');
      const open = art.classList.toggle('open');
      btn.querySelector('.lbl').textContent = open ? 'Show less' : 'Read article';
    });
  });

  /* --- audio-style players (podcast + music): fake animated progress --- */
  function fmt(s) {
    s = Math.max(0, Math.floor(s));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }
  document.querySelectorAll('[data-audio]').forEach((pl) => {
    const total = parseInt(pl.dataset.audio, 10) || 210; // seconds
    let cur = parseInt(pl.dataset.start, 10) || 0;
    let playing = false, timer = null;
    const fill = pl.querySelector('.fill');
    const knob = pl.querySelector('.knob');
    const tCur = pl.querySelector('[data-tcur]');
    const tTot = pl.querySelector('[data-ttot]');
    const btn = pl.querySelector('.pbtn');
    const scrub = pl.querySelector('.scrub');
    if (tTot) tTot.textContent = fmt(total);
    const paint = () => {
      const pct = (cur / total) * 100;
      if (fill) fill.style.width = pct + '%';
      if (knob) knob.style.left = pct + '%';
      if (tCur) tCur.textContent = fmt(cur);
    };
    const playIcon = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    const pauseIcon = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';
    const setIcon = () => { if (btn) btn.innerHTML = playing ? pauseIcon : playIcon; };
    const tick = () => {
      cur += 1;
      if (cur >= total) { cur = total; toggle(false); }
      paint();
    };
    function toggle(force) {
      playing = typeof force === 'boolean' ? force : !playing;
      // pause any other player
      if (playing) {
        document.querySelectorAll('[data-audio]').forEach((o) => {
          if (o !== pl && o.__pause) o.__pause();
        });
      }
      clearInterval(timer);
      if (playing) timer = setInterval(tick, 1000);
      setIcon();
    }
    pl.__pause = () => { playing = false; clearInterval(timer); setIcon(); };
    if (btn) btn.addEventListener('click', () => toggle());
    if (scrub) scrub.addEventListener('click', (e) => {
      const r = scrub.getBoundingClientRect();
      cur = Math.round(((e.clientX - r.left) / r.width) * total);
      paint();
    });
    setIcon(); paint();
  });

  /* --- OG thumbnail fetching for link cards --- */
  (function () {
    const CACHE_KEY = 'kh-og-cache-v1';
    let cache = {};
    try { cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}'); } catch {}
    function saveCache() { try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch {} }

    function applyThumb(card, url) {
      if (!url) return;
      const img = document.createElement('img');
      img.className = 'lc-thumb';
      img.src = url;
      img.alt = '';
      img.loading = 'lazy';
      img.onerror = () => img.remove();
      card.appendChild(img);
    }

    document.querySelectorAll('a.linkcard[data-fetch-thumb]').forEach(async (card) => {
      if (card.querySelector('.lc-thumb')) return;
      const link = card.dataset.fetchThumb;

      if (cache[link] !== undefined) {
        applyThumb(card, cache[link]);
        return;
      }

      // show skeleton while fetching
      const sk = document.createElement('div');
      sk.className = 'lc-thumb-sk';
      card.appendChild(sk);

      try {
        const res = await fetch('https://api.microlink.io/?url=' + encodeURIComponent(link));
        const data = await res.json();
        const imgUrl = data?.data?.image?.url || null;
        cache[link] = imgUrl;
        saveCache();
        sk.remove();
        applyThumb(card, imgUrl);
      } catch {
        sk.remove();
        cache[link] = null;
        saveCache();
      }
    });
  })();

  /* --- youtube video facade --> real embed on click --- */
  document.querySelectorAll('.yt-screen[data-yt]').forEach((screen) => {
    screen.addEventListener('click', () => {
      const id = screen.dataset.yt;
      const ifr = document.createElement('iframe');
      ifr.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0';
      ifr.setAttribute('allowfullscreen', '');
      ifr.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      ifr.setAttribute('title', 'YouTube video');
      ifr.style.cssText = 'width:100%;height:100%;border:0;display:block;';
      screen.replaceChildren(ifr);
      screen.style.cursor = 'default';
    });
  });
})();
