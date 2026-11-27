/*
 * Seva pentru iPhone, în lucru: interiorul aplicației (planșa, colecția, tabloul mare), adus din aplicația de Android.
 *
 * Tabloul îl desenează ../g/seva.js, același cod care arată darurile în browser și care e ținut, formă cu formă, la fel cu
 * aplicația de Android. Aici e doar ce ține de ecran și de telefon: urma degetului, butoanele, colecția păstrată local.
 *
 * Făcut până acum: planșa (proba 1), Păstrează, numele semnatarului și colecția (proba 2).
 * Urmează, pe rând: raritatea, limita zilei, darurile, preferințele, Despre, sunetele.
 */
(function () {
  "use strict";

  var BUILD = "probă 2";
  var lang = /^ro\b/i.test(navigator.language || "ro") ? "ro" : "en";
  var T = {
    ro: {
      hintPaper: "Desenează cu degetul\nuna sau mai multe forme.\nCât și unde desenezi contează.",
      hintMore: "Mai poți adăuga forme, sau apasă Compune.",
      hintComposed: "Același gest poate da și alt tablou.",
      compose: "Compune", clear: "Reia", keep: "Păstrează", another: "Alt tablou", again: "Gest nou",
      backToBoard: "Înapoi la planșă", tier0: "Tablou simplu", choiceKept: "%s. E în colecția ta.",
      collection: "Colecția", back: "Înapoi", del: "Șterge", cancel: "Renunță",
      collectionEmpty: "Colecția e goală deocamdată. Primul tablou te așteaptă pe ecranul de desen.",
      deleteAsk: "Ștergi tabloul din colecție?",
      nameTitle: "Cum te semnezi?",
      nameMessage: "Numele tău va apărea discret pe fiecare tablou, ca semnătura unui pictor. Fără cont, fără internet.",
      nameHint: "Numele tău", nameOk: "Gata",
      failed: "Tabloul nu a putut fi desenat."
    },
    en: {
      hintPaper: "Draw with your finger\none or more shapes.\nHow much and where\nyou draw matters.",
      hintMore: "Add more shapes, or tap Compose.",
      hintComposed: "The same gesture can become another piece.",
      compose: "Compose", clear: "Clear", keep: "Keep", another: "Another", again: "New gesture",
      backToBoard: "Back to the board", tier0: "Plain piece", choiceKept: "%s. It is in your collection.",
      collection: "Collection", back: "Back", del: "Delete", cancel: "Cancel",
      collectionEmpty: "Your collection is empty for now. The first piece is waiting on the drawing screen.",
      deleteAsk: "Remove this piece from your collection?",
      nameTitle: "How do you sign?",
      nameMessage: "Your name will appear discreetly on every piece, like a painter's signature. No account, no internet.",
      nameHint: "Your name", nameOk: "Done",
      failed: "The piece could not be drawn."
    }
  }[lang];
  document.documentElement.lang = lang;

  var $ = function (id) { return document.getElementById(id); };
  var BG = "#141318";
  var S = Seva.SHEET;
  var mk = function (w, h) { var c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
  var sheet = mk(S.w, S.h);    // coala pe care se compune orice tablou, mereu la aceeași mărime

  function freshSheet() {
    sheet.width = S.w;         // golește coala și îi uită toate transformările
    return new Seva.Canvas2D(sheet.getContext("2d"), S.w, S.h, mk);
  }
  /** Coala, micșorată în pânza dată. */
  function sheetInto(canvas) {
    var c = canvas.getContext("2d");
    c.imageSmoothingEnabled = true; c.imageSmoothingQuality = "high";
    c.drawImage(sheet, 0, 0, S.w, S.h, 0, 0, canvas.width, canvas.height);
  }
  /** Cea mai mare carte 3:5 care încape într-un loc de W pe H, cu marginile planșei; la mijloc. */
  function fitCard(W, H) {
    var aw = W - 28, ah = H - 16;
    var bw = Math.max(1, Math.floor(Math.min(aw, ah * S.w / S.h)));
    var bh = Math.round(bw * S.h / S.w);
    return { left: 14 + (aw - bw) / 2, top: 8 + (ah - bh) / 2, w: bw, h: bh };
  }
  function ratio() { return Math.min(window.devicePixelRatio || 1, 3); }

  // ================================================================ ce ține minte telefonul (Store.kt)

  var Store = (function () {
    var mem = {};
    function get(k) { try { var v = localStorage.getItem(k); return v === null ? (k in mem ? mem[k] : null) : v; } catch (e) { return k in mem ? mem[k] : null; } }
    function set(k, v) { mem[k] = v; try { localStorage.setItem(k, v); } catch (e) { } }
    var pieces = null;

    /** Tabloul, cum stă în memorie: întregii din cod, sămânța și semnele ca text (nu încap într-un număr obișnuit). */
    function pack(p) {
      return { id: p.id, seed: String(p.seed), createdAt: p.createdAt, author: p.author, aid: p.aid || "0", gen: p.gen,
        nervous: p.nervous, slow: p.slow, light: p.light, battery: p.battery,
        strokes: p.strokes.map(function (s) { var flat = []; s.forEach(function (q) { flat.push(q[0], q[1]); }); return flat; }) };
    }
    function unpack(o) {
      return { id: o.id, seed: BigInt(o.seed), createdAt: o.createdAt, author: o.author || "", aid: o.aid || "0", gen: o.gen | 0,
        nervous: o.nervous, slow: o.slow, light: o.light, battery: o.battery,
        strokes: o.strokes.map(function (flat) { var s = []; for (var i = 0; i + 1 < flat.length; i += 2) s.push([flat[i], flat[i + 1]]); return s; }) };
    }
    function load() {
      if (pieces) return pieces;
      pieces = [];
      try { pieces = JSON.parse(get("seva.pieces") || "[]").map(unpack); } catch (e) { pieces = []; }
      return pieces;
    }
    function save() { set("seva.pieces", JSON.stringify(pieces.map(pack))); }

    return {
      /** Numele semnatarului; null cât timp nu a fost întrebat. */
      author: function () { return get("seva.author"); },
      setAuthor: function (name) { set("seva.author", String(name).trim()); },
      /** Semnul acestei instalări: un număr la întâmplare, făcut o singură dată. Doi oameni cu același nume rămân diferiți. */
      authorId: function () {
        var have = get("seva.aid");
        if (have && have !== "0") return have;
        var id = 0n;
        while (id === 0n) {
          var a = new Uint32Array(2);
          (window.crypto || window.msCrypto).getRandomValues(a);
          id = BigInt.asIntN(64, (BigInt(a[0]) << 32n) | BigInt(a[1]));
        }
        set("seva.aid", String(id));
        return String(id);
      },
      /** Tablourile păstrate, cele mai noi întâi. */
      list: function () { return load().slice().sort(function (a, b) { return b.createdAt - a.createdAt; }); },
      add: function (p) { load(); if (pieces.some(function (x) { return x.id === p.id; })) return false; pieces.push(p); save(); return true; },
      remove: function (id) { load(); pieces = pieces.filter(function (x) { return x.id !== id; }); save(); }
    };
  })();

  /** Codec.idFor: același nume de tablou ca în aplicația de Android. */
  function idFor(seed, createdAt, author) {
    var h = 0;
    for (var i = 0; i < author.length; i++) h = (Math.imul(31, h) + author.charCodeAt(i)) | 0;   // String.hashCode din Java
    return "t" + BigInt.asUintN(64, seed ^ (BigInt(createdAt) * 31n) ^ BigInt(h)).toString(16);
  }

  /** Rarity.seedWithTier: prima sămânță, de la cea dată încolo, care poartă treapta cerută. */
  function seedWithTier(seed, tier) {
    var s = seed, k = 0;
    while (Seva.tierOf(s) !== tier && k < 200000) { s += 7919n; k++; }
    return s;
  }

  // ================================================================ fereastra de întrebat

  var modal = $("modal"), mInput = $("m-input"), mOk = $("m-ok"), mCancel = $("m-cancel"), mDone = null;
  /** o: { title, text, input (îndemnul câmpului), ok, cancel }. Întoarce, prin then, textul scris sau true; null la Renunță. */
  function ask(o) {
    return new Promise(function (resolve) {
      $("m-title").textContent = o.title || ""; $("m-title").hidden = !o.title;
      $("m-text").textContent = o.text || ""; $("m-text").hidden = !o.text;
      mInput.hidden = !o.input; mInput.value = ""; mInput.placeholder = o.input || "";
      mOk.textContent = o.ok; mCancel.textContent = o.cancel || ""; mCancel.hidden = !o.cancel;
      mDone = function (v) { mDone = null; mInput.blur(); modal.hidden = true; window.scrollTo(0, 0); resolve(v); };
      modal.hidden = false;
    });
  }
  mOk.addEventListener("click", function () { if (mDone) mDone(mInput.hidden ? true : mInput.value); });
  mCancel.addEventListener("click", function () { if (mDone) mDone(null); });
  mInput.addEventListener("keydown", function (e) { if (e.key === "Enter" && mDone) mDone(mInput.value); });
  // după ce tastatura se strânge, pagina revine la locul ei
  mInput.addEventListener("blur", function () { setTimeout(function () { window.scrollTo(0, 0); }, 60); });

  // ================================================================ ecranele

  var onShow = {};
  function go(view) {
    document.body.setAttribute("data-view", view);
    if (onShow[view]) onShow[view]();
  }

  // ================================================================ planșa de desen (GrowthView.kt, MainActivity.kt)

  var stage = $("stage"), board = $("board"), hint = $("hint");
  var btn = { clear: $("clear"), compose: $("compose"), keep: $("keep"), another: $("another"), again: $("again"), backBoard: $("back-board") };
  btn.clear.textContent = T.clear; btn.compose.textContent = T.compose; btn.keep.textContent = T.keep;
  btn.another.textContent = T.another; btn.again.textContent = T.again; btn.backBoard.textContent = T.backToBoard;
  $("to-collection").textContent = T.collection;
  $("build").textContent = BUILD;

  var strokes = [];            // formele desenate: { points: [{x, y}], times: [ms] }, în coordonatele cărții
  var current = null;          // forma care se desenează acum
  var pointer = null;          // degetul care desenează; celelalte nu contează
  var composed = false;
  var locked = false;          // după Păstrează, planșa stă pe loc până la „Înapoi la planșă”
  var piece = null;            // tabloul compus acum
  var seed = newSeed();
  var ink = 0xFFFFFFFF | 0;    // cerneala potrivită hârtiei
  var card = { left: 0, top: 0, w: 0, h: 0 };   // cartea, în puncte de ecran
  var dpr = 1;
  var paper = null;            // cartea desenată: hârtia goală sau tabloul
  var queued = false;

  /** Sămânța momentului. Până vine raritatea (proba următoare), toate tablourile se nasc simple. */
  function newSeed() {
    var s = BigInt(Date.now());
    if (typeof seed !== "undefined" && s <= seed) s = seed + 1n;
    return seedWithTier(s, 0);
  }

  function css(color, alpha) {
    return "rgba(" + ((color >>> 16) & 255) + "," + ((color >>> 8) & 255) + "," + (color & 255) + "," + alpha + ")";
  }

  /** Cartea e mereu 3:5, ca orice tablou Seva: cât încape, la mijloc. */
  function layout() {
    var W = stage.clientWidth, H = stage.clientHeight;
    if (W <= 0 || H <= 0) return;
    dpr = ratio();
    board.width = Math.round(W * dpr); board.height = Math.round(H * dpr);
    var old = { w: card.w, h: card.h };
    card = fitCard(W, H);
    // dacă mărimea se schimbă în timpul gestului (telefonul întors), formele desenate se mută odată cu cartea
    if (old.w > 0 && (old.w !== card.w || old.h !== card.h)) {
      var all = current ? strokes.concat([current]) : strokes;
      all.forEach(function (s) { s.points.forEach(function (q) { q.x = q.x * card.w / old.w; q.y = q.y * card.h / old.h; }); });
    }
    paper = mk(Math.round(card.w * dpr), Math.round(card.h * dpr));
    repaint();
  }

  /** Hârtia goală a seminței curente, cu rama ei. */
  function blank() {
    var p = Seva.paramsFromCase({ strokes: [], nervous: 0, slow: 0, light: 255, battery: 255, seed: seed, gen: Seva.GEN, reveal: false });
    ink = Seva.renderBlank(freshSheet(), S.w, S.h, S.dp, p);
    sheetInto(paper);
  }

  /** Parametrii de pe planșă: treapta rămâne ascunsă până la Păstrează (Renders.hidden). */
  function hiddenParams(p) {
    return Seva.paramsFromCase({ strokes: p.strokes, nervous: p.nervous, slow: p.slow, light: p.light, battery: p.battery,
      seed: p.seed, gen: p.gen, signature: Seva.signature(p.author, p.createdAt, lang), reveal: false });
  }

  function repaint() {
    if (!paper) return;
    try {
      if (composed && piece) {
        Seva.render(freshSheet(), S.w, S.h, S.dp, locked ? Seva.paramsFromPiece(piece, lang) : hiddenParams(piece));
        sheetInto(paper);
      } else blank();
    } catch (e) {
      hint.textContent = T.failed; hint.classList.remove("none");
      if (window.console) console.error(e);
    }
    invalidate();
  }

  function invalidate() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; draw(); });
  }

  function draw() {
    var c = board.getContext("2d");
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.fillStyle = BG;
    c.fillRect(0, 0, board.width / dpr, board.height / dpr);
    var L = card.left, Tp = card.top, R = card.left + card.w, B = card.top + card.h;
    // umbra: câteva margini translucide în jurul cărții
    c.fillStyle = "rgba(0,0,0,0.086)";
    for (var i = 3; i >= 1; i--) c.fillRect(L - i * 2, Tp - i * 1.2 + 2, (R + i * 2) - (L - i * 2), (B + i * 2.4) - (Tp - i * 1.2 + 2));
    if (paper) c.drawImage(paper, L, Tp, card.w, card.h);
    if (composed) return;
    c.save();
    c.beginPath(); c.rect(L, Tp, card.w, card.h); c.clip();
    if (strokes.length === 0 && !current) {
      // îndemnul scris pe hârtie cât timp nu s-a desenat nimic; dacă un rând e prea lung pentru carte, tot textul se micșorează
      var lines = T.hintPaper.split("\n"), size = 17;
      c.font = "italic " + size + "px Georgia, 'Times New Roman', serif";
      var widest = 0;
      lines.forEach(function (l) { widest = Math.max(widest, c.measureText(l).width); });
      var room = card.w * 0.78;
      if (widest > room) { size = size * room / widest; c.font = "italic " + size + "px Georgia, 'Times New Roman', serif"; }
      c.fillStyle = css(ink, 0.54); c.textAlign = "center"; c.textBaseline = "alphabetic";
      var y = Tp + card.h / 2 - (lines.length - 1) * 12;
      lines.forEach(function (l) { c.fillText(l, L + card.w / 2, y); y += 24; });
    }
    // urma degetului, ca o pensulă udă: un halou lat și palid, apoi linia
    c.lineCap = "round"; c.lineJoin = "round";
    for (var pass = 0; pass < 2; pass++) {
      c.strokeStyle = css(ink, pass === 0 ? 0.133 : 0.478);
      c.lineWidth = pass === 0 ? 11 : 5;
      strokes.forEach(function (s) { trace(c, s.points); });
      if (current) trace(c, current.points);
    }
    c.restore();
  }

  function trace(c, pts) {
    if (pts.length === 0) return;
    c.beginPath();
    c.moveTo(pts[0].x + card.left, pts[0].y + card.top);
    if (pts.length === 1) c.lineTo(pts[0].x + card.left + 0.01, pts[0].y + card.top);
    for (var i = 1; i < pts.length; i++) c.lineTo(pts[i].x + card.left, pts[i].y + card.top);
    c.stroke();
  }

  function at(e) {
    var r = board.getBoundingClientRect();
    return { x: e.clientX - r.left - card.left, y: e.clientY - r.top - card.top };
  }

  board.addEventListener("pointerdown", function (e) {
    e.preventDefault();
    if (locked || pointer !== null) return;    // tabloul păstrat își așteaptă alegerea: atingerea nu îl șterge
    pointer = e.pointerId;
    try { board.setPointerCapture(e.pointerId); } catch (x) { }
    if (composed) startNew();      // o atingere după compunere începe un tablou nou
    current = { points: [at(e)], times: [Math.round(e.timeStamp)] };
    invalidate();
  });

  board.addEventListener("pointermove", function (e) {
    if (e.pointerId !== pointer || !current) return;
    var evs = e.getCoalescedEvents ? e.getCoalescedEvents() : null;
    if (!evs || evs.length === 0) evs = [e];
    for (var i = 0; i < evs.length; i++) {
      var q = at(evs[i]), last = current.points[current.points.length - 1];
      if (Math.hypot(q.x - last.x, q.y - last.y) >= 2) {
        current.points.push(q);
        current.times.push(Math.round(evs[i].timeStamp || e.timeStamp));
      }
    }
    invalidate();
    e.preventDefault();
  });

  function lift(e) {
    if (e.pointerId !== pointer) return;
    pointer = null;
    if (current) strokes.push(current);
    current = null;
    state();
    invalidate();
  }
  board.addEventListener("pointerup", lift);
  board.addEventListener("pointercancel", lift);

  /** Butoanele și îndemnul momentului, ca în MainActivity. */
  function state() {
    var n = strokes.length;
    btn.compose.hidden = btn.clear.hidden = !(!composed && n > 0);
    btn.keep.hidden = btn.another.hidden = btn.again.hidden = !(composed && !locked);
    btn.backBoard.hidden = !locked;
    hint.textContent = locked ? T.choiceKept.replace("%s", T.tier0) : composed ? T.hintComposed : (n === 0 ? " " : T.hintMore);
    hint.classList.toggle("none", n === 0 && !composed);
  }

  function startNew() {
    composed = false; locked = false; piece = null;
    strokes = []; current = null;
    seed = newSeed();
    state();
    repaint();
  }

  function compose() {
    if (strokes.length === 0 || locked) return;
    var g = Seva.distill(strokes, card.w, card.h, -1, -1);
    var now = Date.now(), author = Store.author() || "";
    piece = { id: idFor(seed, now, author), seed: seed, createdAt: now, author: author, aid: Store.authorId(), gen: Seva.GEN,
      strokes: g.strokes, nervous: g.nervous, slow: g.slow, light: g.light, battery: g.battery };
    composed = true;
    state();
    repaint();
  }

  btn.compose.addEventListener("click", compose);
  btn.clear.addEventListener("click", function () {     // Reia: formele dispar, hârtia rămâne aceeași
    if (composed) return;
    strokes = []; current = null;
    state(); invalidate();
  });
  btn.another.addEventListener("click", function () {   // Alt tablou din același gest: se schimbă doar sămânța
    if (strokes.length === 0 || locked) return;
    seed = newSeed();
    compose();
  });
  btn.again.addEventListener("click", startNew);
  btn.keep.addEventListener("click", function () {      // Păstrează: tabloul intră în colecție și planșa îl ține la vedere
    if (!composed || !piece || locked) return;
    Store.add(piece);
    locked = true;
    state();
    repaint();
  });
  btn.backBoard.addEventListener("click", startNew);
  $("to-collection").addEventListener("click", function () { go("collection"); });

  // ================================================================ colecția (CollectionActivity.kt)

  var grid = $("grid"), gridWrap = $("grid-wrap"), colEmpty = $("col-empty");
  $("col-title").textContent = T.collection; $("col-back").textContent = T.back;
  colEmpty.textContent = T.collectionEmpty;
  var shown = [];              // tablourile din grilă, în ordinea în care se văd
  var thumbs = {};             // miniaturile făcute: id -> adresa imaginii
  var jobs = [], working = false;
  var watcher = null;

  /** Miniaturile se desenează pe rând, doar pentru căsuțele ajunse la vedere, ca derularea să rămână ușoară. */
  function work() {
    if (working) return;
    var job = jobs.shift();
    if (!job) return;
    if (!job.img.isConnected || thumbs[job.p.id]) { work(); return; }
    working = true;
    setTimeout(function () {
      try {
        Seva.render(freshSheet(), S.w, S.h, S.dp, Seva.paramsFromPiece(job.p, lang));
        var w = Math.round(Math.min(job.img.parentNode.clientWidth || 170, 220) * Math.min(ratio(), 2));
        var small = mk(w, Math.round(w * S.h / S.w));
        sheetInto(small);
        var done = function (url) { thumbs[job.p.id] = url; job.img.src = url; job.img.classList.add("ready"); small.width = 0; working = false; work(); };
        if (small.toBlob) small.toBlob(function (b) { done(b ? URL.createObjectURL(b) : small.toDataURL("image/jpeg", 0.9)); }, "image/jpeg", 0.9);
        else done(small.toDataURL("image/jpeg", 0.9));
      } catch (e) { if (window.console) console.error(e); working = false; work(); }
    }, 0);
  }

  onShow.collection = function () {
    shown = Store.list();
    colEmpty.hidden = shown.length > 0;
    grid.textContent = "";
    jobs = [];
    if (watcher) watcher.disconnect();
    watcher = window.IntersectionObserver ? new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        watcher.unobserve(en.target);
        jobs.push({ p: en.target._piece, img: en.target.firstChild });
      });
      work();
    }, { root: gridWrap, rootMargin: "400px 0px" }) : null;
    shown.forEach(function (p, i) {
      var cell = document.createElement("div");
      cell.className = "cell"; cell.setAttribute("role", "button");
      var img = document.createElement("img");
      img.alt = ""; img.draggable = false;
      cell.appendChild(img);
      cell._piece = p;
      if (thumbs[p.id]) { img.src = thumbs[p.id]; img.classList.add("ready"); }
      else if (watcher) watcher.observe(cell);
      else jobs.push({ p: p, img: img });
      cell.addEventListener("click", function () { openViewer(i); });
      grid.appendChild(cell);
    });
    work();
  };
  $("col-back").addEventListener("click", function () { go("board"); });

  // ================================================================ tabloul mare (ViewActivity.kt)

  var viewStage = $("view-stage"), view = $("view"), viewAt = 0;
  $("view-back").textContent = T.back; $("view-delete").textContent = T.del;

  function openViewer(i) { viewAt = i; go("viewer"); }

  function drawViewer() {
    var p = shown[viewAt];
    var W = viewStage.clientWidth, H = viewStage.clientHeight;
    if (!p || W <= 0 || H <= 0) return;
    var c = fitCard(W, H), k = ratio();
    view.style.left = c.left + "px"; view.style.top = c.top + "px"; view.style.width = c.w + "px"; view.style.height = c.h + "px";
    view.width = Math.round(c.w * k); view.height = Math.round(c.h * k);
    try {
      Seva.render(freshSheet(), S.w, S.h, S.dp, Seva.paramsFromPiece(p, lang));
      sheetInto(view);
    } catch (e) { if (window.console) console.error(e); }
  }
  onShow.viewer = drawViewer;

  // răsfoirea: degetul tras în lături duce la tabloul de alături
  var swipe = null;
  viewStage.addEventListener("pointerdown", function (e) { swipe = { id: e.pointerId, x: e.clientX, y: e.clientY }; });
  viewStage.addEventListener("pointerup", function (e) {
    if (!swipe || swipe.id !== e.pointerId) return;
    var dx = e.clientX - swipe.x, dy = e.clientY - swipe.y;
    swipe = null;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    var next = viewAt + (dx < 0 ? 1 : -1);
    if (next < 0 || next >= shown.length) return;
    viewAt = next;
    drawViewer();
  });
  viewStage.addEventListener("pointercancel", function () { swipe = null; });

  $("view-back").addEventListener("click", function () { go("collection"); });
  $("view-delete").addEventListener("click", function () {
    var p = shown[viewAt];
    if (!p) return;
    ask({ text: T.deleteAsk, ok: T.del, cancel: T.cancel }).then(function (yes) {
      if (!yes) return;
      Store.remove(p.id);
      if (thumbs[p.id]) { try { URL.revokeObjectURL(thumbs[p.id]); } catch (e) { } delete thumbs[p.id]; }
      // tabloul șters de pe planșă nu mai e „în colecția ta”: planșa pornește de la capăt
      if (piece && piece.id === p.id && locked) startNew();
      // după ștergere rămâi la tabloul vecin; colecția se arată doar dacă nu a mai rămas niciunul
      shown = Store.list();
      if (shown.length === 0) { go("collection"); return; }
      viewAt = Math.min(viewAt, shown.length - 1);
      drawViewer();
    });
  });

  // ================================================================ pornirea

  // pagina nu se mișcă, nu se mărește și nu își arată meniurile sub deget; doar colecția se derulează
  document.addEventListener("touchmove", function (e) {
    var t = e.target;
    if (t && t.closest && t.closest(".scroll")) return;
    e.preventDefault();
  }, { passive: false });
  document.addEventListener("gesturestart", function (e) { e.preventDefault(); });
  document.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  document.addEventListener("dblclick", function (e) { e.preventDefault(); });

  if (window.ResizeObserver) {
    new ResizeObserver(layout).observe(stage);
    new ResizeObserver(function () { if (document.body.getAttribute("data-view") === "viewer") drawViewer(); }).observe(viewStage);
  } else window.addEventListener("resize", function () { layout(); drawViewer(); });
  window.addEventListener("orientationchange", function () { setTimeout(layout, 250); });
  state();
  layout();

  // la prima deschidere: numele cu care vor fi semnate tablourile. Fără cont, fără verificare.
  if (Store.author() === null) {
    ask({ title: T.nameTitle, text: T.nameMessage, input: T.nameHint, ok: T.nameOk }).then(function (name) { Store.setAuthor(name || ""); });
  }

  // pentru probele din afara telefonului
  window.SevaApp = {
    state: function () {
      return { view: document.body.getAttribute("data-view"), strokes: strokes.length, composed: composed, locked: locked, piece: piece,
        card: card, seed: String(seed), author: Store.author(), kept: Store.list().length, thumbs: Object.keys(thumbs).length };
    }
  };
})();
