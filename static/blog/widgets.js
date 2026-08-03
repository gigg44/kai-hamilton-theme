/* Hero status line — last scrobbled track, last watched anime, last read manga.
   Fills the three slots in <div class="meta status" id="status">. Each slot stays
   hidden until its source answers, so a dead API leaves no empty row behind.

   Must live here, never inline in layouts/index.html: Hugo's html/template escaper
   mangles script bodies (it broke both widgets once already). */
(function () {
  var LASTFM_USER = 'G1GG44';
  var LASTFM_KEY = '361e6548ed532d56e24b22050bbfc7a3';
  var ANILIST_USER = 'Gigg44';

  function esc(s) {
    return String(s || '').replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function fill(key, label, text, href) {
    var el = document.querySelector('#status [data-w="' + key + '"]');
    if (!el || !text) return;
    el.innerHTML =
      '<i></i><b>' + esc(label) + '</b>' +
      '<a href="' + esc(href) + '" target="_blank" rel="noopener" title="' + esc(text) + '">' +
      esc(text) + '</a>';
    el.hidden = false;
  }

  // ---- Last.fm: now playing, else last played ----
  fetch('https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' +
        LASTFM_USER + '&api_key=' + LASTFM_KEY + '&format=json&limit=1')
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var t = d && d.recenttracks && d.recenttracks.track;
      t = Array.isArray(t) ? t[0] : t;
      if (!t) return;
      var nowPlaying = t['@attr'] && t['@attr'].nowplaying;
      var artist = t.artist && (t.artist['#text'] || t.artist.name);
      fill('music', nowPlaying ? 'Now playing' : 'Last played',
           artist ? artist + ' — ' + t.name : t.name,
           t.url || 'https://www.last.fm/user/' + LASTFM_USER);
    })
    .catch(function () {});

  // ---- AniList: last watched episode + last read chapter, one request ----
  // UPDATED_TIME_DESC also surfaces entries that were only added to a list, so
  // take the newest one that has actual progress on it.
  var QUERY =
    'query ($u: String) {' +
    '  anime: Page(perPage: 8) { mediaList(userName: $u, type: ANIME, sort: UPDATED_TIME_DESC) {' +
    '    progress media { title { english romaji } siteUrl } } }' +
    '  manga: Page(perPage: 8) { mediaList(userName: $u, type: MANGA, sort: UPDATED_TIME_DESC) {' +
    '    progress media { title { english romaji } siteUrl } } }' +
    '}';

  function newestWithProgress(page) {
    var list = (page && page.mediaList) || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].progress > 0) return list[i];
    }
    return null;
  }

  fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ query: QUERY, variables: { u: ANILIST_USER } }),
  })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var data = d && d.data;
      if (!data) return;
      var a = newestWithProgress(data.anime);
      if (a) {
        fill('anime', 'Last watched',
             (a.media.title.english || a.media.title.romaji) + ' — Ep ' + a.progress,
             a.media.siteUrl);
      }
      var m = newestWithProgress(data.manga);
      if (m) {
        fill('manga', 'Last read',
             (m.media.title.english || m.media.title.romaji) + ' — Ch ' + m.progress,
             m.media.siteUrl);
      }
    })
    .catch(function () {});
})();
