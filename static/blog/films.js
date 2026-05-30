/* Films page — reads the Letterboxd RSS diary for gigg44 via a CORS proxy.
   Letterboxd has no CORS-friendly API, so we must proxy the RSS.
   Swap PROXIES for your own proxy (you self-host) for best reliability. */
(function () {
  const USER = 'gigg44';
  const FEED = 'https://letterboxd.com/' + USER + '/rss/';

  // ── Your self-hosted Cloudflare Worker ──────────────────────────────────
  // Deploy blog/letterboxd-proxy.worker.js (instructions in that file), then
  // paste its URL here (no trailing slash). Leave '' to fall back to the public
  // proxies below. This is the reliable one — it's tried first.
  const PROXY_WORKER = 'https://lb-proxy.email-16d.workers.dev'; // e.g. 'https://lb-proxy.YOURNAME.workers.dev'

  // tried in order until one returns valid XML. `json` = response is JSON and
  // the feed text lives at that key. The Worker (if set) goes first.
  const PROXIES = [
    ...(PROXY_WORKER ? [{ make: (u) => PROXY_WORKER + '/?url=' + encodeURIComponent(u) }] : []),
    { make: (u) => 'https://api.codetabs.com/v1/proxy/?quest=' + encodeURIComponent(u) },
    { make: (u) => 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u) },
    { make: (u) => 'https://api.allorigins.win/get?url=' + encodeURIComponent(u), json: 'contents' },
    { make: (u) => 'https://thingproxy.freeboard.io/fetch/' + u },
    { make: (u) => 'https://corsproxy.io/?url=' + encodeURIComponent(u) },
  ];
  const root = document.getElementById('films-root');
  const countEl = document.getElementById('films-count');

  const esc = (s) => (s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const txt = (item, tag) => {
    const el = item.getElementsByTagName(tag)[0];
    return el ? el.textContent.trim() : '';
  };
  const stars = (n) => {
    const v = parseFloat(n);
    if (!v) return '';
    return '★'.repeat(Math.floor(v)) + (v % 1 >= 0.5 ? '½' : '');
  };

  function card(it) {
    const title = esc(it.title);
    const sub = [it.year, it.rewatch ? 'rewatch' : '', it.starStr].filter(Boolean).join(' · ');
    return `<article class="book-card">
      <a class="cover" href="${esc(it.link)}" target="_blank" rel="noopener">
        ${it.poster ? `<img src="${esc(it.poster)}" alt="${title} poster" loading="lazy">` : ''}
        ${it.rating ? `<span class="score-badge"><span class="st">★</span>${it.rating}</span>` : ''}
      </a>
      <a class="bc-title" href="${esc(it.link)}" target="_blank" rel="noopener">${title}</a>
      ${sub ? `<div class="bc-sub">${esc(sub)}</div>` : ''}
    </article>`;
  }

  function render(items) {
    if (countEl) countEl.textContent = 'latest ' + items.length + ' from my diary';
    root.innerHTML = `<section class="shelf">
      <h2><span class="lbl">Recently watched</span><span class="rule"></span><span class="ct">${items.length}</span></h2>
      <div class="shelf-grid">${items.map(card).join('')}</div>
    </section>`;
  }

  function fail() {
    root.innerHTML = `<section class="shelf"><div class="errbox">
      Couldn't load the Letterboxd feed right now (the proxy may be rate-limited). See everything directly →
      <a href="https://letterboxd.com/${USER}/films/" target="_blank" rel="noopener">letterboxd.com/${USER}</a>
    </div></section>`;
  }

  function parse(xmlText) {
    const doc = new DOMParser().parseFromString(xmlText, 'text/xml');
    if (doc.querySelector('parsererror')) return null;
    const items = [...doc.getElementsByTagName('item')].map((item) => {
      const filmTitle = txt(item, 'letterboxd:filmTitle');
      if (!filmTitle) return null; // skip lists / non-film items
      const rating = txt(item, 'letterboxd:memberRating');
      // poster lives in the CDATA description html
      let poster = '';
      const div = document.createElement('div');
      div.innerHTML = txt(item, 'description');
      const img = div.querySelector('img');
      if (img) poster = img.getAttribute('src') || '';
      return {
        title: filmTitle,
        year: txt(item, 'letterboxd:filmYear'),
        rating,
        starStr: stars(rating),
        rewatch: txt(item, 'letterboxd:rewatch') === 'Yes',
        link: txt(item, 'link'),
        poster,
      };
    }).filter(Boolean);
    return items;
  }

  function fetchText(p, url, ms) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    return fetch(p.make(url), { signal: ctrl.signal })
      .then((res) => {
        if (!res.ok) throw new Error('bad status ' + res.status);
        return p.json ? res.json().then((j) => j[p.json] || '') : res.text();
      })
      .finally(() => clearTimeout(t));
  }

  async function tryProxies(list) {
    for (const p of list) {
      try {
        const items = parse(await fetchText(p, FEED, 9000));
        if (items && items.length) { render(items); return true; }
      } catch (e) { /* next proxy */ }
    }
    return false;
  }

  // skeleton
  root.innerHTML = `<section class="shelf">
    <h2><span class="lbl">Loading from Letterboxd…</span><span class="rule"></span></h2>
    <div class="shelf-grid">${'<div class="sk"></div>'.repeat(6)}</div>
  </section>`;

  (async () => {
    if (await tryProxies(PROXIES)) return;
    await new Promise((r) => setTimeout(r, 1500)); // brief pause, then one more full pass
    if (await tryProxies(PROXIES)) return;
    fail();
  })();
})();
