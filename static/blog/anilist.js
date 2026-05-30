/* Shared AniList list renderer — used by Anime.html and Manga.html.
   Call: AniList({ user, type:'ANIME'|'MANGA', rootId, countId }) */
window.AniList = function (opts) {
  const USER = opts.user;
  const TYPE = opts.type; // 'ANIME' | 'MANGA'
  const root = document.getElementById(opts.rootId || 'list-root');
  const countEl = document.getElementById(opts.countId || 'list-count');
  if (!root) return;

  const isAnime = TYPE === 'ANIME';

  const QUERY = `query ($u: String, $t: MediaType) {
    MediaListCollection(userName: $u, type: $t) {
      lists {
        entries {
          status score progress
          media {
            id
            title { romaji english }
            coverImage { large }
            siteUrl episodes chapters format seasonYear
          }
        }
      }
    }
  }`;

  const SECTIONS = isAnime ? [
    { key: 'CURRENT',   label: 'Currently watching' },
    { key: 'REPEATING', label: 'Rewatching' },
    { key: 'COMPLETED', label: 'Completed' },
    { key: 'PAUSED',    label: 'On hold' },
    { key: 'PLANNING',  label: 'Plan to watch' },
    { key: 'DROPPED',   label: 'Dropped' },
  ] : [
    { key: 'CURRENT',   label: 'Currently reading' },
    { key: 'REPEATING', label: 'Rereading' },
    { key: 'COMPLETED', label: 'Completed' },
    { key: 'PAUSED',    label: 'On hold' },
    { key: 'PLANNING',  label: 'Plan to read' },
    { key: 'DROPPED',   label: 'Dropped' },
  ];

  const FMT = isAnime
    ? { TV: 'TV', TV_SHORT: 'TV', MOVIE: 'Film', OVA: 'OVA', ONA: 'ONA', SPECIAL: 'Special', MUSIC: 'Music' }
    : { MANGA: 'Manga', NOVEL: 'Light novel', ONE_SHOT: 'One-shot' };

  const fmtFormat = (f) => FMT[f] || (f || '').replace(/_/g, ' ');
  const esc = (s) => (s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const titleOf = (m) => m.title.english || m.title.romaji;

  function card(e) {
    const m = e.media;
    const title = esc(titleOf(m));
    const cover = m.coverImage && m.coverImage.large;
    const score = e.score && e.score > 0 ? e.score : null;
    const bits = [];
    if (m.format) bits.push(fmtFormat(m.format));
    const count = isAnime ? m.episodes : m.chapters;
    if (count) bits.push(count + (isAnime ? ' ep' : ' ch'));
    else if (m.seasonYear) bits.push(m.seasonYear);
    const sub = bits.join(' · ');
    return `<article class="book-card">
      <a class="cover" href="${m.siteUrl}" target="_blank" rel="noopener">
        ${cover ? `<img src="${cover}" alt="${title} cover" loading="lazy">` : ''}
        ${score ? `<span class="score-badge"><span class="st">★</span>${score}</span>` : ''}
      </a>
      <a class="bc-title" href="${m.siteUrl}" target="_blank" rel="noopener">${title}</a>
      ${sub ? `<div class="bc-sub">${esc(sub)}</div>` : ''}
    </article>`;
  }

  function section(label, entries) {
    return `<section class="shelf">
      <h2><span class="lbl">${esc(label)}</span><span class="rule"></span><span class="ct">${entries.length}</span></h2>
      <div class="shelf-grid">${entries.map(card).join('')}</div>
    </section>`;
  }

  function render(entries) {
    const byId = new Map();
    entries.forEach((e) => { if (e.media && !byId.has(e.media.id)) byId.set(e.media.id, e); });
    const all = [...byId.values()];
    if (countEl) countEl.textContent = all.length + (all.length === 1 ? ' title' : ' titles');

    const html = SECTIONS.map((s) => {
      const list = all.filter((e) => e.status === s.key);
      if (!list.length) return '';
      list.sort((a, b) => (b.score || 0) - (a.score || 0) || titleOf(a.media).localeCompare(titleOf(b.media)));
      return section(s.label, list);
    }).join('');

    root.innerHTML = html || `<section class="shelf"><div class="errbox">No public entries found for @${USER}.</div></section>`;
  }

  function fail() {
    const path = isAnime ? 'animelist' : 'mangalist';
    root.innerHTML = `<section class="shelf"><div class="errbox">
      Couldn't reach AniList right now. View the full list directly →
      <a href="https://anilist.co/user/${USER}/${path}" target="_blank" rel="noopener">anilist.co/user/${USER}</a>
    </div></section>`;
  }

  root.innerHTML = `<section class="shelf">
    <h2><span class="lbl">Loading from AniList…</span><span class="rule"></span></h2>
    <div class="shelf-grid">${'<div class="sk"></div>'.repeat(6)}</div>
  </section>`;

  fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ query: QUERY, variables: { u: USER, t: TYPE } }),
  })
    .then((r) => r.json())
    .then((d) => {
      const lists = d && d.data && d.data.MediaListCollection && d.data.MediaListCollection.lists;
      if (!lists) return fail();
      render(lists.flatMap((l) => l.entries || []));
    })
    .catch(fail);
};
