/*
 * Seva pentru iPhone, în lucru: planșa de desen (GrowthView.kt și MainActivity.kt din aplicația de Android, aduse aici).
 *
 * Tabloul îl desenează ../g/seva.js, același cod care arată darurile în browser și care e ținut, formă cu formă, la fel cu
 * aplicația de Android. Aici e doar ce ține de ecran: urma degetului, butoanele și așezarea cărții.
 *
 * Ce urmează, pe rând: Păstrează și colecția, raritatea, darurile, preferințele, Despre, sunetele.
 */
(function () {
  "use strict";

  var BUILD = "probă 1";
  var lang = /^ro\b/i.test(navigator.language || "ro") ? "ro" : "en";
  var T = {
    ro: {
      hintPaper: "Desenează cu degetul\nuna sau mai multe forme.\nCât și unde desenezi contează.",
      hintMore: "Mai poți adăuga forme, sau apasă Compune.",
      hintComposed: "Același gest poate da și alt tablou.",
      compose: "Compune", clear: "Reia", another: "Alt tablou", again: "Gest nou",
      failed: "Tabloul nu a putut fi desenat."
    },
    en: {
      hintPaper: "Draw with your finger\none or more shapes.\nHow much and where\nyou draw matters.",
      hintMore: "Add more shapes, or tap Compose.",
      hintComposed: "The same gesture can become another piece.",
      compose: "Compose", clear: "Clear", another: "Another", again: "New gesture",
      failed: "The piece could not be drawn."
    }
  }[lang];
  document.documentElement.lang = lang;

  var $ = function (id) { return document.getElementById(id); };
  var stage = $("stage"), board = $("board"), hint = $("hint");
  var btn = { clear: $("clear"), compose: $("compose"), another: $("another"), again: $("again") };
  btn.clear.textContent = T.clear; btn.compose.textContent = T.compose; btn.another.textContent = T.another; btn.again.textContent = T.again;
  $("build").textContent = BUILD;

  var BG = "#141318";
  var S = Seva.SHEET;
  var mk = function (w, h) { var c = document.createElement("canvas"); c.width = w; c.height = h; return c; };

  // ---------------------------------------------------------------- starea planșei

  var strokes = [];            // formele desenate: { points: [{x, y}], times: [ms] }, în coordonatele cărții
  var current = null;          // forma care se desenează acum
  var pointer = null;          // degetul care desenează; celelalte nu contează
  var composed = false;
  var piece = null;            // tabloul compus acum
  var seed = newSeed();
  var author = "";             // numele semnatarului vine odată cu colecția
  var ink = 0xFFFFFFFF | 0;    // cerneala potrivită hârtiei
  var card = { left: 0, top: 0, w: 0, h: 0 };   // cartea, în puncte de ecran
  var dpr = 1;
  var paper = null;            // cartea desenată: hârtia goală sau tabloul
  var sheet = mk(S.w, S.h);    // coala pe care se compune orice tablou, mereu la aceeași mărime
  var queued = false;

  function newSeed() {
    var s = BigInt(Date.now());
    return (typeof seed !== "undefined" && s === seed) ? s + 1n : s;
  }

  function css(color, alpha) {
    return "rgba(" + ((color >>> 16) & 255) + "," + ((color >>> 8) & 255) + "," + (color & 255) + "," + alpha + ")";
  }

  // ---------------------------------------------------------------- cartea

  /** Cartea e mereu 3:5, ca orice tablou Seva: cât încape, la mijloc. */
  function layout() {
    var W = stage.clientWidth, H = stage.clientHeight;
    if (W <= 0 || H <= 0) return;
    dpr = Math.min(window.devicePixelRatio || 1, 3);
    board.width = Math.round(W * dpr); board.height = Math.round(H * dpr);
    var aw = W - 28, ah = H - 16;
    var bw = Math.max(1, Math.floor(Math.min(aw, ah * S.w / S.h)));
    var bh = Math.round(bw * S.h / S.w);
    var old = { w: card.w, h: card.h };
    card = { left: 14 + (aw - bw) / 2, top: 8 + (ah - bh) / 2, w: bw, h: bh };
    // dacă mărimea se schimbă în timpul gestului (telefonul întors), formele desenate se mută odată cu cartea
    if (old.w > 0 && (old.w !== bw || old.h !== bh)) {
      var all = current ? strokes.concat([current]) : strokes;
      all.forEach(function (s) { s.points.forEach(function (q) { q.x = q.x * bw / old.w; q.y = q.y * bh / old.h; }); });
    }
    paper = mk(Math.round(bw * dpr), Math.round(bh * dpr));
    repaint();
  }

  /** Coala, micșorată cât e cartea de pe ecran. */
  function show() {
    var c = paper.getContext("2d");
    c.imageSmoothingEnabled = true; c.imageSmoothingQuality = "high";
    c.drawImage(sheet, 0, 0, S.w, S.h, 0, 0, paper.width, paper.height);
  }

  function freshSheet() {
    sheet.width = S.w;           // golește coala și îi uită toate transformările
    return new Seva.Canvas2D(sheet.getContext("2d"), S.w, S.h, mk);
  }

  /** Hârtia goală a seminței curente, cu rama ei. */
  function blank() {
    var p = Seva.paramsFromCase({ strokes: [], nervous: 0, slow: 0, light: 255, battery: 255, seed: seed, gen: Seva.GEN, reveal: false });
    ink = Seva.renderBlank(freshSheet(), S.w, S.h, S.dp, p);
    show();
  }

  /** Tabloul compus; treapta lui rămâne ascunsă până la Păstrează. */
  function renderPiece() {
    var p = Seva.paramsFromCase({
      strokes: piece.strokes, nervous: piece.nervous, slow: piece.slow, light: piece.light, battery: piece.battery,
      seed: piece.seed, gen: piece.gen, signature: Seva.signature(piece.author, piece.createdAt, lang), reveal: false
    });
    Seva.render(freshSheet(), S.w, S.h, S.dp, p);
    show();
  }

  function repaint() {
    if (!paper) return;
    try {
      if (composed && piece) renderPiece(); else blank();
    } catch (e) {
      hint.textContent = T.failed; hint.classList.remove("none");
      if (window.console) console.error(e);
    }
    invalidate();
  }

  // ---------------------------------------------------------------- ce se vede

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

  // ---------------------------------------------------------------- degetul

  function at(e) {
    var r = board.getBoundingClientRect();
    return { x: e.clientX - r.left - card.left, y: e.clientY - r.top - card.top };
  }

  board.addEventListener("pointerdown", function (e) {
    if (pointer !== null) return;
    pointer = e.pointerId;
    try { board.setPointerCapture(e.pointerId); } catch (x) { }
    if (composed) startNew();      // o atingere după compunere începe un tablou nou
    current = { points: [at(e)], times: [Math.round(e.timeStamp)] };
    invalidate();
    e.preventDefault();
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

  // pagina nu se mișcă, nu se mărește și nu își arată meniurile sub deget
  document.addEventListener("touchmove", function (e) { e.preventDefault(); }, { passive: false });
  document.addEventListener("gesturestart", function (e) { e.preventDefault(); });
  document.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  document.addEventListener("dblclick", function (e) { e.preventDefault(); });

  // ---------------------------------------------------------------- butoanele

  /** Butoanele și îndemnul momentului, ca în MainActivity. */
  function state() {
    var n = strokes.length;
    btn.compose.hidden = btn.clear.hidden = !(!composed && n > 0);
    btn.another.hidden = btn.again.hidden = !composed;
    hint.textContent = composed ? T.hintComposed : (n === 0 ? " " : T.hintMore);
    hint.classList.toggle("none", n === 0 && !composed);
  }

  function startNew() {
    composed = false; piece = null;
    strokes = []; current = null;
    seed = newSeed();
    state();
    repaint();
  }

  function compose() {
    if (strokes.length === 0) return;
    var g = Seva.distill(strokes, card.w, card.h, -1, -1);
    piece = { seed: seed, createdAt: Date.now(), author: author, gen: Seva.GEN,
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
    if (strokes.length === 0) return;
    seed = newSeed();
    compose();
  });
  btn.again.addEventListener("click", startNew);

  // ---------------------------------------------------------------- pornirea

  if (window.ResizeObserver) new ResizeObserver(layout).observe(stage);
  else window.addEventListener("resize", layout);
  window.addEventListener("orientationchange", function () { setTimeout(layout, 250); });
  state();
  layout();

  // pentru probele din afara telefonului
  window.SevaApp = { state: function () { return { strokes: strokes.length, composed: composed, piece: piece, card: card, seed: String(seed) }; } };
})();
