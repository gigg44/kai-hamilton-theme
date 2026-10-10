/* Books page — live from micro.blog's bookshelves via books.json.
   The bookshelf API needs a token that can publish posts, so it can never be
   called from here; a script on Kusanagi (vault scripts/mb_books_json.py) holds the
   token, writes plain JSON every 30 min, and nginx serves it with CORS. */
(function () {
  var PROXY = 'https://todo.kai-hamilton.de/books.json';
  var root = document.getElementById('books-root');
  if (!root) return;

  // Editorial pins that micro.blog has no field for, keyed by ISBN.
  var BADGES = { '9781668053393': '★ Book of the year' };

  var SECTIONS = [
    { type: 'reading', label: 'Currently reading' },
    { type: 'finished', label: 'Recently finished' },
  ];

  function esc(s) {
    return String(s || '').replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function card(b) {
    var badge = BADGES[b.isbn];
    var title = esc(b.title);
    return '<article class="book-card">' +
      '<a class="cover" href="' + esc(b.url) + '">' +
      (b.cover ? '<img src="' + esc(b.cover) + '" alt="' + title + '" loading="lazy">' : '') +
      (badge ? '<span class="year-badge">' + esc(badge) + '</span>' : '') +
      '</a>' +
      '<a class="bc-title" href="' + esc(b.url) + '">' + title + '</a>' +
      (b.author ? '<div class="bc-author">' + esc(b.author) + '</div>' : '') +
      '</article>';
  }

  function section(label, books) {
    return '<section class="shelf">' +
      '<h2><span class="lbl">' + esc(label) + '</span><span class="rule"></span>' +
      '<span class="ct">' + books.length + '</span></h2>' +
      '<div class="shelf-grid">' + books.map(card).join('') + '</div>' +
      '</section>';
  }

  function fail() {
    root.innerHTML = '<section class="shelf"><div class="errbox">' +
      "Couldn't reach the bookshelf right now. " +
      '<a href="https://kai-hamilton.de/books/">The micro.blog shelf</a> still works.' +
      '</div></section>';
  }

  root.innerHTML = '<section class="shelf">' +
    '<h2><span class="lbl">Loading the shelf…</span><span class="rule"></span></h2>' +
    '<div class="shelf-grid">' + new Array(6).join('<div class="sk"></div>') + '</div></section>';

  fetch(PROXY)
    .then(function (r) { return r.json(); })
    .then(function (d) {
      if (!d || !d.shelves) return fail();
      var html = SECTIONS.map(function (s) {
        var shelf = d.shelves.filter(function (x) { return x.type === s.type; })[0];
        if (!shelf || !shelf.books.length) return '';
        // newest addition first — a shelf is a timeline, not an alphabet
        var books = shelf.books.slice().sort(function (a, b) {
          return String(b.added || '').localeCompare(String(a.added || ''));
        });
        return section(s.label, books);
      }).join('');
      root.innerHTML = html || '';
      if (!html) fail();
    })
    .catch(fail);
})();
