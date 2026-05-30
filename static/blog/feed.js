/* =========================================================================
   Kai-Hamilton — Timeline feed
   Real posts exported from micro.blog (kai-hamilton.de), newest first.
   Rendered into #tl, then players.js wires filters / interactions.
   ========================================================================= */
(function () {
  const U = 'https://kai-hamilton.de/uploads/';        // uploaded media
  const G = 'https://gigg44.micro.blog/uploads/';      // a few early uploads
  const BK = (isbn) => `https://cdn.micro.blog/books/${isbn}/cover.jpg`;
  const BL = (isbn) => `https://micro.blog/books/${isbn}`;
  const site = 'https://kai-hamilton.de';

  /* kicker glyphs */
  const K = {
    note: ['▍', 'Note'], write: ['✍', 'Note'], link: ['↗', 'Link'],
    finished: ['▣', 'Finished reading'], boty: ['★', 'Book of the year · 2025'],
    newbook: ['◆', 'New book'], travel: ['◆', 'Travel'], photos: ['◆', 'Photos'],
    culture: ['◆', 'Culture'], food: ['◆', 'Eating'], gadget: ['◆', 'Gadget'],
    watch: ['▶', 'Watching'], anime: ['▶', 'Anime'], manga: ['▶', 'Manga'],
    tv: ['▶', 'TV series'], play: ['▶', 'Playing'], pod: ['●', 'Podcast'],
    bestof: ['✍', 'Best of 2024'],
  };

  /* ----------------------------------------------------------------------
     POSTS — newest first
     fields: d (YYYY-MM-DD), t (HH:MM, optional), url, group, dt, k (kicker)
     plus per-kind fields. kind decides the layout.
     ---------------------------------------------------------------------- */
  const POSTS = [
    { kind:'link', d:'2026-04-05', t:'20:03', url:'/2026/04/05/gute-folge-kann-man-adhs.html',
      group:'listening', dt:'podcast', k:K.pod,
      body:'Gute Folge. Kann man ADHS unterscheiden — und kann man sich wirklich 100&nbsp;% fokussieren?',
      source:'overcast.fm', title:'Über Fokus, ADHS & die Aufmerksamkeit', link:'https://overcast.fm/+AAtTQbFYm3Y' },

    { kind:'link', d:'2026-03-11', t:'07:43', url:'/2026/03/11/as-long-as-they-get.html',
      group:'watching', dt:'video', k:['↗','Link · Anime'],
      body:'As long as they get the feel and the music right, this could be a banger.',
      source:'theverge.com', title:'A live-action Samurai Champloo is in the works',
      link:'https://www.theverge.com/entertainment/892675/a-live-action-samurai-champloo-is-in-the-works' },

    { kind:'book', d:'2026-03-04', t:'13:07', url:'/2026/03/04/finished-reading-superman-red-son.html',
      group:'books', dt:'book', k:K.finished,
      cover:BK('9781779526861'), title:'Superman: Red Son', meta:'Mark Millar · 2023 Edition',
      body:'What if Superman was born in the Soviet Union instead of America? A fascinating story about the ideals of communism — and what free human will really means.',
      link:BL('9781779526861') },

    { kind:'book', featured:true, d:'2026-01-02', t:'10:42', url:'/2026/01/02/my-book-of-the-year.html',
      group:'books', dt:'book', k:K.boty,
      cover:BK('9781668053393'), title:'Apple in China', meta:'Patrick McGee · 2025',
      body:'The rise of China from cheap labour to manufacturing superpower, told through Apple becoming the most valuable company of its time — contract manufacturing, the rise of Foxconn, and how Apple built its own biggest rival by teaching it, then got stuck there for the foreseeable future.|Why there can\u2019t be a second China, full stop. And the sheer scale: more money into China in a single year than the Marshall Plan in today\u2019s money.',
      link:BL('9781668053393') },

    { kind:'link', d:'2025-11-25', t:'06:33', url:'/2025/11/25/possible-scenarios-for-ai-all.html',
      group:'notes', dt:'link', k:K.link,
      body:'Possible scenarios for AI — all pretty much confirming the AI bubble.',
      source:'infosec.exchange', title:'David Chisnall — scenarios for AI',
      link:'https://infosec.exchange/@david_chisnall/115604534768736171' },

    { kind:'link', d:'2025-11-09', t:'13:56', url:'/2025/11/09/entshitification-formula-explains-more-then.html',
      group:'notes', dt:'link', k:K.link,
      body:'The enshittification formula explains a lot more than just why Google got bad.',
      source:'pluralistic.net', title:'The enshittification of labor',
      link:'https://pluralistic.net/2025/11/07/postwar-social-contract/#a-defense-of-social-contracts' },

    { kind:'quote', d:'2025-11-02', t:'09:43', url:'/2025/11/02/the-internet-was-made-for.html',
      group:'writing', dt:'note', k:K.write, qtitle:'The internet was made for privacy',
      quote:'Since the 1990s, whenever push came to shove, governments decided that they would rather preserve their ability to spy on us than keep us safe from private spying.',
      source:'pluralistic.net', link:'https://pluralistic.net/2025/10/31/losing-the-crypto-wars/#surveillance-monopolism' },

    { kind:'link', d:'2025-11-02', t:'07:38', url:'/2025/11/02/073834.html',
      group:'notes', dt:'link', k:K.link,
      body:'My Gamer Motivation Profile — fun little exercise.',
      source:'quanticfoundry.com', title:'Gamer Motivation Profile',
      link:'https://apps.quanticfoundry.com/profiles/gamerprofile/DEk4vZpC2a9yc4ZC4VQwBA/' },

    { kind:'note', d:'2025-09-25', t:'22:40', url:'/2025/09/25/is-still-a-pain-in.html',
      group:'writing', dt:'note', k:['✍','9/11 is still a pain'],
      body:'Oh how I love that, after security, to get on a plane you have <em>mandatory</em> security to get off said plane and board another. How can my luggage change — I\u2019ve been in the air? But no: shoes off, belt off… WHY?!? #securitytheatre' },

    { kind:'link', d:'2025-09-17', t:'13:32', url:'/2025/09/17/who-didnt-think-of-just.html',
      group:'notes', dt:'link', k:K.link,
      body:'Who didn\u2019t think of just connecting the game to the internet so the NPCs never repeat the same old lines? Now it\u2019s possible with AI.',
      source:'404media.co', title:'AI-Powered Animal Crossing Villagers Begin Organizing Against Tom Nook',
      link:'https://www.404media.co/ai-powered-animal-crossing-villagers-begin-organizing-against-tom-nook/' },

    { kind:'link', d:'2025-08-19', t:'05:50', url:'/2025/08/19/it-depends-on-what-you.html',
      group:'notes', dt:'link', k:K.link,
      body:'It depends on what you watch or read before bed — it can\u2019t be too exciting or rewarding. One thing\u2019s sure: it shouldn\u2019t be in bed.',
      source:'nytimes.com', title:'The health effects of blue light & screen use',
      link:'https://www.nytimes.com/2025/08/17/well/health-effects-blue-light-screen-use.html' },

    { kind:'link', d:'2025-08-10', t:'06:15', url:'/2025/08/10/yet-another-llm-rant-dennis.html',
      group:'notes', dt:'link', k:K.link,
      body:'This explains the difference between how our brains work and how an LLM does.',
      source:'overengineer.dev', title:'Yet another LLM rant — Dennis Schubert',
      link:'https://overengineer.dev/txt/2025-08-09-another-llm-rant/' },

    { kind:'link', d:'2025-07-30', t:'20:03', url:'/2025/07/30/httpsovercastfmaaztzshgq-this-is-one-of.html',
      group:'listening', dt:'podcast', k:K.pod,
      body:'One of the podcast episodes I\u2019ve come back to. To learn Google is to understand the modern internet.',
      source:'overcast.fm', title:'Understanding Google — and the modern internet',
      link:'https://overcast.fm/+AA_ztzSHGQ4' },

    { kind:'photo', d:'2025-07-14', t:'21:18', url:'/2025/07/14/new-book.html',
      group:'books', dt:'book', k:K.newbook,
      body:'Got my new book in the mail — <em>Apple in China</em>. Ever since that interview on The Daily Show I\u2019ve wanted to read it.',
      images:[{s:U+'2025/5d889d9eb7.jpg', portrait:true}] },

    { kind:'note', d:'2025-07-13', t:'10:18', url:'/2025/07/13/wieso-rechtspopulismus-so-gut-funktioniert.html',
      group:'notes', dt:'note', k:K.note,
      body:'Wieso Rechtspopulismus zurzeit so gut funktioniert: es ist die vermeintlich einfache Lösung — das Problem zu ignorieren und zu sagen, es sei zu schwer.',
      figure:{s:U+'2025/8a094bfa97.jpg'} },

    { kind:'photo', d:'2025-06-30', t:'14:48', url:'/2025/06/30/project-killswitch-has-arrived.html',
      group:'photos', dt:'gadget', k:K.gadget,
      body:'Project Killswitch has arrived.',
      images:[{s:U+'2025/e036d0155c7842509b15884424de8de0.jpg', land:true}] },

    { kind:'videofile', d:'2025-06-30', t:'10:25', url:'/2025/06/30/kriterien-fr-die-anwendung-von.html',
      group:'listening', dt:'podcast', k:['●','Lage der Nation'],
      body:'Kriterien für die Anwendung von KI — #LNP 527.',
      mp4:U+'2025/image.mp4', poster:U+'2025/poster.png' },

    { kind:'photo', d:'2025-06-30', t:'09:30', url:'/2025/06/30/caught-up-on-ichi-the.html',
      group:'watching', dt:'video', k:K.manga,
      body:'Caught up on <em>Ichi the Witch</em>.',
      images:[{s:U+'2025/5150e6ac6a.jpg', land:true}] },

    { kind:'note', d:'2025-06-29', t:'15:31', url:'/2025/06/29/i-find-it-interesting-how.html',
      group:'notes', dt:'note', k:K.note,
      body:'Interesting how Verstappen reacted the way he did with Antonelli — you\u2019d expect him to be angrier. Could it be he already knows he\u2019s going to be his new teammate? #F1' },

    { kind:'link', d:'2025-06-26', t:'17:11', url:'/2025/06/26/first-time-i-have-heard.html',
      group:'notes', dt:'link', k:K.link,
      body:'First time I\u2019ve heard about surveillance pricing. One more for the dystopian playbook.',
      source:'pluralistic.net', title:'Surveillance pricing & price discrimination',
      link:'https://pluralistic.net/2025/06/24/price-discrimination/' },

    { kind:'note', d:'2025-06-26', t:'15:54', url:'/2025/06/26/zusammenfassung-von-maskenbericht.html',
      group:'writing', dt:'note', k:['✍','Maskenbericht'],
      body:'Politisches Versagen und strukturelle Inkompetenz, sehr deutlich dokumentiert. Das Handeln war im Kontext der Pandemie zunächst nachvollziehbar — aber die Ausführung war überstürzt, chaotisch und voller vermeidbarer Fehler. <a href="https://fragdenstaat.de/dokumente/271600-maskenbericht-sudhoff/" target="_blank" rel="noopener">FragDenStaat</a>' },

    { kind:'photo', d:'2025-06-14', t:'06:42', url:'/2025/06/14/interesting-new-manga-i-just.html',
      group:'watching', dt:'video', k:K.manga,
      body:'Interesting new manga I found on Jump. <em>War of the Adults</em> is a clever spin on society: what happens when adulthood is decided not by age, but by good deeds? Who decides what\u2019s good — and what happens to criminals?',
      images:[{s:U+'2025/69d63110f74247bc8b5b3e9624d35f49.png', portrait:true}] },

    { kind:'book', d:'2025-06-03', t:'21:27', url:'/2025/06/03/finished-reading-digitalwste-deutschland-by.html',
      group:'books', dt:'book', k:K.finished,
      cover:BK('9783641291280'), title:'Digitalwüste Deutschland', meta:'Prof. Dr. Michael Resch',
      body:'', link:BL('9783641291280') },

    { kind:'photo', d:'2025-06-03', t:'15:50', url:'/2025/06/03/witcher-looks-amazing-in-unreal.html',
      group:'watching', dt:'video', k:K.play,
      body:'The Witcher 4 looks amazing in Unreal.',
      images:[{s:U+'2025/5a72f740cd.png', land:true}] },

    { kind:'photo', d:'2025-04-18', t:'09:57', url:'/2025/04/18/watched-the-amateur-last-night.html',
      group:'watching', dt:'video', k:K.watch,
      body:'Watched <em>The Amateur</em> last night.',
      images:[{s:U+'2025/5ed350b3f4824821b1e40769337da205.jpg', land:true}] },

    { kind:'video', d:'2025-04-13', t:'06:01', url:'/2025/04/13/we-are-getting-a-new.html',
      group:'watching', dt:'video', k:K.anime,
      body:'We\u2019re getting a new <em>Ghost in the Shell</em> anime next year — and this time it looks like it\u2019ll be true to the original manga art style.',
      yt:'rk27MbUoBQ8', capTitle:'Ghost in the Shell — new anime announcement', channel:'YouTube' },

    { kind:'photo', d:'2025-04-09', t:'19:40', url:'/2025/04/09/just-finished-season-of-jet.html',
      group:'watching', dt:'video', k:K.watch,
      body:'Just finished Season 13 of <em>Jet Lag: The Game</em>.',
      images:[{s:U+'2025/d8a51443700d4ebcb8b9905c92accebf.png', land:true}] },

    { kind:'note', d:'2025-04-01', t:'06:34', url:'/2025/04/01/im-very-happy-to-have.html',
      group:'notes', dt:'note', k:K.note,
      body:'Very happy I kickstarted the MCON. The love and attention poured into this project is one of the main reasons I backed it. Super excited — can\u2019t wait for mine to arrive. <a href="https://youtube.com/watch?v=ac9R6nepNKk" target="_blank" rel="noopener">youtube.com</a>' },

    { kind:'link', d:'2025-04-01', t:'06:05', url:'/2025/04/01/050554.html',
      group:'watching', dt:'video', k:['↗','Anime · April Fools'],
      body:'Bleach, April Fools edition.',
      source:'comicbook.com', title:'Bleach anime… dating sim?',
      link:'https://comicbook.com/anime/news/bleach-anime-dating-sim/' },

    { kind:'photo', d:'2025-04-01', t:'06:02', url:'/2025/04/01/hab-das-buch-zum-podcast.html',
      group:'books', dt:'book', k:K.finished,
      body:'Hab das Buch zum Podcast von <em>Lage der Nation</em> gestern Abend zu Ende gelesen.',
      images:[{s:U+'2025/8c5bdc60df7e476ba3f715a8cd8ca2ba.png', land:true}] },

    { kind:'photo', d:'2025-03-27', t:'09:03', url:'/2025/03/27/i-finally-caught-up-on.html',
      group:'watching', dt:'video', k:K.anime,
      body:'Finally caught up on Season 5 of <em>Blue Exorcist</em>.',
      images:[{s:U+'2025/150b9d01d6cf480cb3c4b3613ee1e5a8.png', land:true}] },

    { kind:'photo', d:'2025-03-21', t:'23:56', url:'/2025/03/21/just-watched-the-brutalist-it.html',
      group:'watching', dt:'video', k:K.watch,
      body:'Just watched <em>The Brutalist</em> — it didn\u2019t feel like a three-hour movie.',
      images:[{s:U+'2025/aac47fbc0cf6415f8a52df48de83f9c8.png', land:true}] },

    { kind:'photo', d:'2025-03-16', t:'22:38', url:'/2025/03/16/just-watched-the-report.html',
      group:'watching', dt:'video', k:K.watch,
      body:'Just watched <em>The Report</em>.',
      images:[{s:U+'2025/9406f6fc02904a2981bd0c190a5e50ef.png', land:true}] },

    { kind:'photo', d:'2025-03-10', t:'23:34', url:'/2025/03/10/just-watched-anora.html',
      group:'watching', dt:'video', k:K.watch,
      body:'Just watched <em>Anora</em>.',
      images:[{s:U+'2025/7c5c7c15fb9e473c9055224f1b7bfad8.png', land:true}] },

    { kind:'photo', d:'2025-03-09', t:'09:40', url:'/2025/03/09/watched-flow-yesterday.html',
      group:'watching', dt:'video', k:K.watch,
      body:'Watched <em>Flow</em> yesterday.',
      images:[{s:U+'2025/9dd25f81a9e44390811bc6c03895dad5.jpg', land:true}] },

    { kind:'photo', d:'2025-03-06', t:'10:48', url:'/2025/03/06/last-night-i-watched-mickey.html',
      group:'watching', dt:'video', k:K.watch,
      body:'Last night I watched <em>Mickey 17</em>.',
      images:[{s:U+'2025/016c71e72d9e4c48bc9c0ec504f999d8.png', land:true}] },

    { kind:'quote', d:'2025-03-03', t:'07:00', url:'/2025/03/03/payback.html',
      group:'writing', dt:'note', k:['✍','Payback'],
      intro:'Genau das fehlt mir in der Verteidigungsdebatte. Wenn die USA / NATO einseitig Artikel&nbsp;5 aufkündigen — wieso erlauben wir ihnen dann US-Basen bei uns? Ohne Ramstein und Landstuhl wäre die USA massiv eingeschränkt.',
      quote:'Germany\u2019s got the best US bases in the world. Beautiful bases. Tremendous. And, frankly, we\u2019re giving them to the US for free. It\u2019s nasty what they\u2019re doing to us. So we want a better deal. The US\u2019s gotta pay.',
      source:'bsky.app · satire', link:'https://bsky.app/profile/drfranksauer.bsky.social/post/3lj7vv3n7lc2f' },

    { kind:'photo', d:'2025-02-28', t:'20:24', url:'/2025/02/28/food-in-spain.html',
      group:'photos', dt:'food', k:K.food,
      body:'Food in Spain — and a few that weren\u2019t. Calamari 9/10, churros 8/10, tapas 7/10, tortilla 6/10. The freshly-caught calamari at the beach looked disgusting and tasted incredible.',
      images:[
        {s:U+'2025/67e55cb066.jpg'},{s:U+'2025/d8005de99f.jpg'},{s:U+'2025/img-6128.jpg'},
        {s:U+'2025/f5af65963c.jpg'},{s:U+'2025/9396814c96.jpg'},{s:U+'2025/80e7e61915.jpg'} ] },

    { kind:'photo', d:'2025-02-27', t:'18:03', url:'/2025/02/27/just-watched-umamusume-movie.html',
      group:'watching', dt:'video', k:K.anime,
      body:'Just watched the <em>Umamusume</em> movie.',
      images:[{s:U+'2025/c0792bec7c144f6eb30d9de679249a1f.jpg', land:true}] },

    { kind:'link', d:'2025-02-25', t:'10:01', url:'/2025/02/25/this-documentary-about-the-creator.html',
      group:'watching', dt:'video', k:['↗','Anime · Documentary'],
      body:'This documentary about Aoyama Gosho, creator of <em>Detective Conan</em>, shows for the first time ever how Conan is made.',
      source:'nhk.or.jp', title:'How Detective Conan is created — NHK World',
      link:'https://www3.nhk.or.jp/nhkworld/en/shows/4003192/' },

    { kind:'video', d:'2025-02-23', t:'06:40', url:'/2025/02/23/bocchi-is-back-for-a.html',
      group:'watching', dt:'video', k:K.anime,
      body:'<em>Bocchi the Rock!</em> is back for a season 2.',
      yt:'2z5nOlwq9XU', capTitle:'Bocchi the Rock! — Season 2', channel:'bocchi.rocks' },

    { kind:'photo', d:'2025-02-19', t:'17:56', url:'/2025/02/19/just-watched-gundam-requiem-for.html',
      group:'watching', dt:'video', k:K.anime,
      body:'Just watched <em>Gundam: Requiem for Revenge</em>.',
      images:[{s:U+'2025/578306b5b4414b29804431566a447c41.jpg', land:true}] },

    { kind:'quote', d:'2025-02-17', t:'23:12', url:'/2025/02/17/221046.html',
      group:'writing', dt:'note', k:['✍','1994, 2007, 2022'],
      quote:'1994 was the start of getting to all the information. 2007 was the start of getting everything else, anywhere, instantly. 2022 was the start of getting everything, anywhere, not just instantly — but also personalised, augmented and automated.',
      source:'crazystupidtech.com · OM + Fred', link:'https://crazystupidtech.com/archive/what-to-expect-from-us-n-2025/' },

    { kind:'link', d:'2025-02-09', t:'23:38', url:'/2025/02/09/a-brutal-take-on-america.html',
      group:'notes', dt:'link', k:K.link,
      body:'A brutal take on America, from a Canadian perspective.',
      source:'cbc.ca', title:'CBC — the watch', link:'https://www.cbc.ca/player/play/video/9.6634032' },

    { kind:'link', d:'2025-02-06', t:'06:33', url:'/2025/02/06/state-of-the-internet-nearing.html',
      group:'notes', dt:'link', k:K.link,
      body:'State of the internet — nearing a dystopian future.',
      source:'arstechnica.com', title:'As internet enshittification marches on — the worst offenders',
      link:'https://arstechnica.com/gadgets/2025/02/as-internet-enshittification-marches-on-here-are-some-of-the-worst-offenders/' },

    { kind:'photo', d:'2025-02-05', t:'18:21', url:'/2025/02/05/finished-indiana-jones-and-the.html',
      group:'watching', dt:'video', k:K.play,
      body:'👾 Finished <em>Indiana Jones and the Great Circle</em>.',
      images:[{s:U+'2025/f52b237b15ae456bb112cb46d37d313b.jpg', land:true}] },

    { kind:'note', d:'2025-01-19', t:'15:34', url:'/2025/01/19/cdu-mindestlohn.html',
      group:'notes', dt:'note', k:['✍','CDU Mindestlohn'],
      body:'Wer Mindestlohn verdient, sollte nicht die CDU wählen.',
      figure:{s:U+'2025/image.jpeg'} },

    { kind:'photo', d:'2025-01-12', t:'23:15', url:'/2025/01/12/okitsura.html',
      group:'watching', dt:'video', k:K.anime,
      body:'<em>OKITSURA</em> — “Fell in Love with an Okinawan Girl, but I Just Wish I Knew What She\u2019s Saying” — is my favourite anime of winter 2025. Part gag, part parody, with what looks like a real romance brewing. The references go all out: episode one nodded to <em>Evangelion</em>, this week we got a JoJo pose.',
      images:[
        {s:U+'2025/a1bf0ef0bb.jpg'},{s:U+'2025/76f6eb90ca.jpg'},{s:U+'2025/3b154a0d39.jpg'},
        {s:U+'2025/85c7a6d859.jpg'},{s:U+'2025/493151f7f8.jpg'} ] },

    { kind:'quote', d:'2025-01-08', t:'15:47', url:'/2025/01/08/words-to-live-by-in.html',
      group:'writing', dt:'note', k:['✍','Words to live by'],
      quote:'My take on Trump post-election has been to stop paying attention, as best I can, to anything he <em>says</em>. I\u2019m only paying attention to what he <em>does</em>.',
      source:'John Gruber · Daring Fireball', link:'https://daringfireball.net/2025/01/meta_zuck_content_moderation_zig_zag' },

    { kind:'article', d:'2024-12-31', t:'15:07', url:'/2024/12/31/140652.html',
      group:'writing', dt:'read', k:K.bestof,
      hero:U+'2024/best-series-of-2024.png',
      meta:'Year in review · 31 Dec 2024',
      title:'Best of 2024', excerpt:'My favourite series, films and games of the year — from Arcane to Astro Bot. (Next year there\u2019ll be more games — I\u2019m building a gaming PC again.)',
      full:`<h4 class="bl-h">Best series (anime & TV)</h4>
        <ol class="bestlist"><li>Arcane — Season 2</li><li>The Penguin</li><li>Dandadan</li><li>Mushoku Tensei — Season 2</li><li>Hibike! Euphonium — Season 3</li><li>Jellyfish Can\u2019t Swim in the Night</li><li>GIRLS BAND CRY</li><li>Firefighter Daigo: Rescuer in Orange</li></ol>
        <h4 class="bl-h">Best films</h4>
        <ol class="bestlist"><li>Blue Giant</li><li>Wallace & Gromit: Vengeance Most Fowl</li><li>Robot Dreams</li><li>Look Back</li><li>The Zone of Interest</li><li>Conclave</li><li>Wolfs</li><li>Challengers</li></ol>
        <img class="gameshot" src="${U}2024/best-games-of-2024.png" loading="lazy" alt="Best games of 2024">
        <h4 class="bl-h">Best games</h4>
        <ol class="bestlist"><li>Astro Bot</li><li>Indiana Jones and the Great Circle</li><li>CarX Street (PC)</li><li>Call of Duty: Black Ops 6</li></ol>` },

    { kind:'photo', d:'2024-12-28', t:'12:06', url:'/2024/12/28/christmas-loot.html',
      group:'photos', dt:'gadget', k:['◆','Christmas loot'],
      body:'Christmas loot 2024.',
      images:[{s:U+'2024/afc26f9208.jpg', land:true}] },

    { kind:'photo', d:'2024-10-23', t:'14:16', url:'/2024/10/23/just-got-my.html',
      group:'photos', dt:'gadget', k:K.gadget,
      body:'Just got my HIBY × Evangelion R4 in the post. It looks absolutely amazing.',
      images:[
        {s:U+'2024/56da476d24.jpg'},{s:U+'2024/dec590ecd1.jpg'},
        {s:U+'2024/4b71737817.jpg'},{s:U+'2024/3d6702f3fc.jpg'} ] },

    { kind:'photo', d:'2024-10-12', t:'10:52', url:'/2024/10/12/we-are-witnessing.html',
      group:'watching', dt:'video', k:K.anime,
      body:'We are witnessing something great. How <em>DAN DA DAN</em> played with colour in episode 2 was a joy to watch. #anime',
      images:[
        {s:U+'2024/985a7a5ee7.jpg'},{s:U+'2024/dd39431b13.jpg'},
        {s:U+'2024/77ba5e72fc.jpg'},{s:U+'2024/405df73375.jpg'} ] },

    { kind:'photo', d:'2024-09-28', t:'22:35', url:'/2024/09/28/watched-first-episode.html',
      group:'watching', dt:'video', k:K.tv,
      body:'Watched the first episode of <em>The Penguin</em> — an HBO show in the Batman universe. What a great combo.',
      images:[{s:U+'2024/1c271186-237e-4111-b0e1-ac000057005f.jpg', poster:true}] },

    { kind:'photo', d:'2024-09-27', t:'21:44', url:'/2024/09/27/fratopia-the-alte.html',
      group:'photos', dt:'photo', k:K.culture,
      body:'The Alte Oper in Frankfurt had a free-entrance event. I saw ensemble reflektor with composer Holly Hyon Choe playing Beethoven.',
      images:[
        {s:U+'2024/700dd287-86d0-4ca7-a481-3d4205b4c827.jpg'},
        {s:U+'2024/whatsapp-image-2024-09-27-at-19.35.07.jpeg'} ] },

    { kind:'photo', d:'2024-09-26', t:'17:45', url:'/2024/09/26/since-when-does.html',
      group:'photos', dt:'photo', k:K.travel,
      body:'Since when does the ICE stop at the regional station at Frankfurt Airport?',
      images:[{s:U+'2024/a9fff16c0c474ccc9d69ff747f61ac4e.jpg', portrait:true}] },

    { kind:'photo', d:'2024-09-25', t:'12:25', url:'/2024/09/25/istanbul-phablo-mano.html',
      group:'photos', dt:'photo', k:K.travel,
      body:'Found a wonderful little shop of hand-crafted leather goods near Galata Tower. Turns out the maker is German — he learned his craft in Offenbach, then moved to Istanbul in 2007. I bought a leather band for my Apple Watch.',
      images:[
        {s:U+'2024/img-5278.jpeg'},
        {s:U+'2024/whatsapp-image-2024-09-25-at-12-kopie.12.40.jpeg'},
        {s:U+'2024/whatsapp-image-2024-09-25-at-12.12.40.jpeg'} ] },

    { kind:'photo', d:'2024-09-24', t:'11:00', url:'/2024/09/24/istanbul-city-of.html',
      group:'photos', dt:'photo', k:K.travel,
      body:'Istanbul has to be the most pet-friendly city I\u2019ve ever been to. Cats everywhere — pavements, chairs, roofs, the bonnet of a parked car. The locals feed them and let them be. They live in perfect harmony in the city of cute. 🐱',
      images:[{s:G+'2024/image.jpg'},{s:G+'2024/3e1ca37f99.jpg'}] },
  ];

  /* ---------------------------------------------------------------------- */
  const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function dateBits(d) {
    const [y, m, day] = d.split('-').map(Number);
    return { b: MON[m - 1] + ' ' + day, yr: String(y) };
  }
  const esc = (s) => s;
  const paras = (body) => body ? body.split('|').map((p) => `<p>${p}</p>`).join('') : '';

  function permalink(p) {
    const { b, yr } = dateBits(p.d);
    const when = (p.t ? p.t + ' · ' : '') + b + ' ' + yr;
    return `<a class="permalink" href="${site}${p.url}" target="_blank" rel="noopener">→ permalink · ${when}</a>`;
  }
  function kicker(p) { return `<div class="kicker"><span class="gl">${p.k[0]}</span>${p.k[1]}</div>`; }

  function imagesBlock(imgs) {
    if (imgs.length === 1) {
      const i = imgs[0];
      const cls = i.poster ? 'p-poster' : ('p-single' + (i.land ? ' land' : ''));
      return `<img class="${cls}" src="${i.s}" loading="lazy" alt="">`;
    }
    const g = 'g' + Math.min(imgs.length, 6);
    return `<div class="p-grid ${g}">` +
      imgs.map((i) => `<img src="${i.s}" loading="lazy" alt="">`).join('') + `</div>`;
  }

  function render(p) {
    const head = `<div class="date"><b>${dateBits(p.d).b}</b><small>${dateBits(p.d).yr}</small></div><div class="node"></div>`;
    let inner = '', wrap = 'media';

    if (p.kind === 'book' && p.featured) {
      wrap = 'media';
      inner = kicker(p) + `<div class="book-feature">
        <img class="bf-cover" src="${p.cover}" loading="lazy" alt="${p.title} cover">
        <div><h2>${p.title}</h2><div class="b-meta">${p.meta}</div>${paras(p.body)}
        <a class="booklink" href="${p.link}" target="_blank" rel="noopener">Go to book →</a></div></div>`;
    } else if (p.kind === 'book') {
      wrap = 'measure';
      const cover = p.cover ? `<img class="b-cover" src="${p.cover}" loading="lazy" alt="${p.title} cover">` : '';
      const head2 = p.title ? `<h3>${p.title}</h3><div class="b-meta">${p.meta || ''}</div>` : '';
      const link = p.link ? `<a class="booklink" href="${p.link}" target="_blank" rel="noopener" style="display:inline-block;margin-top:8px;">Go to book →</a>` : '';
      const img = (p.images && p.images.length) ? imagesBlock(p.images) : '';
      inner = kicker(p) + `<div class="book">${cover}<div>${head2}` +
        (p.body ? `<p class="body-text" style="margin-top:8px;">${p.body}</p>` : '') +
        link + `</div></div>` + img;
      // book-with-photo (no cover): show the photo full under text
      if (!p.cover && img) {
        inner = kicker(p) + (p.body ? `<p class="body-text measure" style="margin-bottom:12px;">${p.body}</p>` : '') + img;
        wrap = 'media';
      }
    } else if (p.kind === 'photo') {
      wrap = 'media';
      inner = kicker(p) +
        (p.body ? `<p class="body-text measure" style="margin-bottom:14px;">${p.body}</p>` : '') +
        imagesBlock(p.images);
    } else if (p.kind === 'video') {
      wrap = 'media';
      inner = kicker(p) +
        (p.body ? `<p class="body-text measure" style="margin-bottom:14px;">${p.body}</p>` : '') +
        `<div class="player pl-video"><div class="yt-screen" data-yt="${p.yt}" role="button" tabindex="0" aria-label="Play video">
          <img src="https://img.youtube.com/vi/${p.yt}/hqdefault.jpg" alt="" loading="lazy">
          <div class="scrim"></div><span class="yt-badge">YOUTUBE</span><div class="yt-play"></div></div>
          <div class="yt-cap"><h4>${p.capTitle}</h4><div class="ch">${p.channel}</div></div></div>`;
    } else if (p.kind === 'videofile') {
      wrap = 'media';
      inner = kicker(p) +
        (p.body ? `<p class="body-text measure" style="margin-bottom:14px;">${p.body}</p>` : '') +
        `<div class="p-videofile"><video controls playsinline preload="none" poster="${p.poster}">
          <source src="${p.mp4}" type="video/mp4"></video></div>`;
    } else if (p.kind === 'note') {
      wrap = 'measure';
      const fig = p.figure ? `<div class="p-figure"><img src="${p.figure.s}" loading="lazy" alt=""></div>` : '';
      inner = kicker(p) + `<div class="body-text">${p.body}</div>` + fig + permalink(p);
    } else if (p.kind === 'quote') {
      wrap = 'measure';
      const title = p.qtitle ? `<div class="q-title">${p.qtitle}</div>` : '';
      const intro = p.intro ? `<p class="body-text" style="margin-bottom:12px;">${p.intro}</p>` : '';
      const cite = p.source ? `<a class="q-cite" href="${p.link}" target="_blank" rel="noopener">— ${p.source}</a>` : '';
      inner = kicker(p) + title + intro + `<blockquote class="q-block de">${p.quote}</blockquote>` + cite;
    } else if (p.kind === 'link') {
      wrap = 'measure';
      const thumb = p.thumb ? `<img class="lc-thumb" src="${p.thumb}" loading="lazy" alt="">` : '';
      inner = kicker(p) +
        `<p class="body-text" style="margin-bottom:12px;">${p.body}</p>` +
        `<a class="linkcard" href="${p.link}" target="_blank" rel="noopener">
          <div class="lc-text"><div class="lc-src">${p.source}</div><div class="lc-title">${p.title}</div></div>${thumb}</a>` +
        permalink(p);
    } else if (p.kind === 'article') {
      wrap = 'media';
      inner = kicker(p) + `<div class="article">
        <img class="hero-img" src="${p.hero}" loading="lazy" alt="">
        <div class="art-body"><div class="art-meta">${p.meta}</div>
        <h2>${p.title}</h2><p class="excerpt">${p.excerpt}</p>
        <div class="full">${p.full}</div>
        <button class="read-btn"><span class="lbl">Read article</span><span class="arr">→</span></button></div></div>`;
    }

    const el = document.createElement('article');
    el.className = 'entry' + (p.featured ? ' featured' : '');
    el.dataset.type = p.dt;
    el.dataset.group = p.group;
    el.innerHTML = head + `<div class="${wrap}">${inner}</div>`;
    return el;
  }

  const tl = document.getElementById('tl');
  POSTS.forEach((p) => tl.appendChild(render(p)));
  tl.insertAdjacentHTML('beforeend',
    '<div class="tl-end">— that\u2019s the start of the log · Sep 2024 —</div>');
})();
