# Kai-Hamilton Blog — Micro.blog plug-in

A Micro.blog **plug-in** that turns your blog into the custom site built here:

- **Homepage (`/`)** → the Timeline (overrides Hugo's `layouts/index.html`)
- **`/films.html`** → Letterboxd diary (live, via your Cloudflare Worker)
- **`/anime.html`**, **`/manga.html`** → AniList lists (live)
- **`/books.html`** → curated shelf

All shared CSS/JS lives in `static/blog/`, served at `/blog/…`.

---

## Structure

```
plugin.json                      ← plug-in manifest (required)
layouts/
  index.html                     ← becomes your homepage
static/
  films.html  anime.html  manga.html  books.html
  image-slots.state.json         ← baked-in images for the timeline slots
  blog/
    blog.css  films.js  anilist.js  players.js
    image-slot.js  tweaks-panel.jsx  tweaks.jsx
```

Everything under `static/` is served verbatim at the site root. `layouts/index.html`
overrides the homepage template so your Timeline replaces the default post list.

---

## Deploy (≈3 minutes)

1. **Create a public GitHub repo** (e.g. `kai-hamilton-blog`) and push these files
   to the root of its default branch:

   ```bash
   cd microblog-deploy
   git init
   git add .
   git commit -m "Kai-Hamilton blog plug-in"
   git branch -M main
   git remote add origin https://github.com/<you>/kai-hamilton-blog.git
   git push -u origin main
   ```

2. In Micro.blog: **Design → Edit Custom Themes → New Plug-in**
   (or **New Theme**), paste the repo's **Clone URL**
   (`https://github.com/<you>/kai-hamilton-blog.git`), and save.

3. Micro.blog pulls the repo and applies it on top of your current theme.
   The homepage becomes the Timeline; the four media pages are live at their URLs.

To update later: push to the repo, then in Micro.blog click **Update** next to the
plug-in under Design.

---

## Notes

- **Images:** the Timeline's photo/cover slots are baked from
  `image-slots.state.json`. Only the avatar is filled right now — fill the rest in
  the editor, then this file gets regenerated and the new images ship on the next push.
- **Letterboxd:** `films.js` points at your Worker
  (`https://lb-proxy.email-16d.workers.dev`) first, with public proxies as fallback.
- **Hugo version:** built against Micro.blog's standard Hugo. If the homepage doesn't
  override, bump the Hugo version under Design to the current default.
