/*
 * Seva pentru iPhone, în lucru: interiorul aplicației (planșa, colecția, tabloul mare), adus din aplicația de Android.
 *
 * Tabloul îl desenează ../g/seva.js, același cod care arată darurile în browser și care e ținut, formă cu formă, la fel cu
 * aplicația de Android. Aici e doar ce ține de ecran și de telefon: urma degetului, butoanele, colecția păstrată local.
 *
 * Făcut până acum: planșa (proba 1), Păstrează, numele semnatarului și colecția (proba 2), raritatea cu momentul ei (proba 3),
 * dăruitul: fereastra darului, linkul scris ca în aplicație, urmele celor dăruite (proba 4),
 * primirea unui dar: intră în colecție, se întoarce pe spate, gândul top secret arde, sărbătoarea ocaziei (proba 5).
 * Urmează, pe rând: limita zilei și abonamentul, preferințele, Despre, sunetele.
 */
(function () {
  "use strict";

  var BUILD = "probă 5";
  var lang = /^ro\b/i.test(navigator.language || "ro") ? "ro" : "en";
  var T = {
    ro: {
      hintPaper: "Desenează cu degetul\nuna sau mai multe forme.\nCât și unde desenezi contează.",
      hintMore: "Mai poți adăuga forme, sau apasă Compune.",
      hintComposed: "Același gest poate da și alt tablou.",
      compose: "Compune", clear: "Reia", keep: "Păstrează", another: "Alt tablou", again: "Gest nou",
      backToBoard: "Înapoi la planșă", tier0: "Tablou simplu", choiceKept: "%s. E în colecția ta.",
      tiers: [null, "Piesă rară", "Piesă de colecție", "Seva de aur"], rareFound: "Un tablou rar și-a găsit rama.", goldSub: "cel mai rar dintre tablouri",
      often: "rare des",
      gift: "Dăruiește", giftLang: "r", gifted: "Dăruit", givenTab: "Dăruite", giftFailed: "Nu am putut pregăti darul.", linkCopied: "Linkul darului a fost copiat.",
      giftAsk: "Tabloul va pleca din colecția ta și va rămâne doar amintirea lui. Pleacă într-un plic închis; cine îl primește îl deschide și, dacă are Seva, îl adaugă în colecția lui.\n\nÎn WhatsApp, așteaptă o clipă să apară plicul deasupra mesajului, apoi trimite.",
      giftAskNow: "Tabloul pleacă într-un plic închis; cine îl primește îl deschide și, dacă are Seva, îl adaugă în colecția lui. La tine rămâne doar amintirea lui.\n\nÎn WhatsApp, așteaptă o clipă să apară plicul deasupra mesajului, apoi trimite.",
      giftNoteHint: "Un gând pentru cel care îl primește (opțional)", secretCheck: "Top secret", occasionBirthday: "Zi de naștere", occasionChristmas: "Crăciun",
      givenEmpty: "Nu ai dăruit încă niciun tablou. Când o vei face, urma lui va rămâne aici.",
      turnOver: "Întoarce", fromWho: "de la %s", topSecret: "TOP SECRET",
      stamp: ["", "LA MULȚI ANI", "CRĂCIUN FERICIT"], wish: ["", "La mulți ani!", "Crăciun fericit!"],
      giftBad: "Linkul nu conține un tablou valid.", giftNewer: "E făcut cu o Seva mai nouă decât pagina aceasta.",
      giftReceived: "Un tablou de la %s a intrat în colecția ta.", giftReceivedMine: "Un tablou de-al tău a intrat în colecția ta.",
      giftReturned: "Tabloul s-a întors la tine, de la %s.", giftReturnedMine: "Tabloul tău s-a întors la tine.",
      giftOwnLink: "Acest tablou l-ai dăruit deja; el este acum la cel care l-a primit.", giftAlready: "Tabloul acesta era deja în colecția ta.",
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
      tiers: [null, "Rare piece", "Collector's piece", "Golden Seva"], rareFound: "A rare piece has found its frame.", goldSub: "the rarest of all pieces",
      often: "rare often",
      gift: "Give", giftLang: "e", gifted: "Given", givenTab: "Given", giftFailed: "Could not prepare the gift.", linkCopied: "The gift link has been copied.",
      giftAsk: "The piece will leave your collection and only its memory will remain. It travels in a sealed envelope; whoever receives it opens it and, if they have Seva, adds it to their collection.\n\nIn WhatsApp, wait a moment for the envelope to appear above the message, then send.",
      giftAskNow: "The piece travels in a sealed envelope; whoever receives it opens it and, if they have Seva, adds it to their collection. Only its memory stays with you.\n\nIn WhatsApp, wait a moment for the envelope to appear above the message, then send.",
      giftNoteHint: "A thought for whoever receives it (optional)", secretCheck: "Top secret", occasionBirthday: "Birthday", occasionChristmas: "Christmas",
      givenEmpty: "You have not given any piece yet. When you do, its trace will stay here.",
      turnOver: "Turn over", fromWho: "from %s", topSecret: "TOP SECRET",
      stamp: ["", "HAPPY BIRTHDAY", "MERRY CHRISTMAS"], wish: ["", "Happy birthday!", "Merry Christmas!"],
      giftBad: "This link does not hold a valid piece.", giftNewer: "Made with a newer Seva than this page.",
      giftReceived: "A piece from %s has joined your collection.", giftReceivedMine: "A piece of yours has joined your collection.",
      giftReturned: "The piece has come back to you, from %s.", giftReturnedMine: "Your piece has come back to you.",
      giftOwnLink: "You already gave this piece away; it is with its receiver now.", giftAlready: "This piece was already in your collection.",
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
      var o = { id: p.id, seed: String(p.seed), createdAt: p.createdAt, author: p.author, aid: p.aid || "0", gen: p.gen,
        nervous: p.nervous, slow: p.slow, light: p.light, battery: p.battery,
        strokes: p.strokes.map(function (s) { var flat = []; s.forEach(function (q) { flat.push(q[0], q[1]); }); return flat; }) };
      // de la cine a venit, când a plecat în dar și spatele cărții poștale, doar dacă există (ca în Piece.toJson)
      if (p.from) o.from = p.from;
      if (p.fromId && p.fromId !== "0") o.fid = p.fromId;
      if (p.giftedAt) o.giftedAt = p.giftedAt;
      if (p.note) o.note = p.note;
      if (p.note || p.burned || p.occasion) { o.noteBy = p.noteBy || ""; o.noteAt = p.noteAt || 0; }
      if (p.occasion) o.occasion = p.occasion;
      if (p.secret) o.secret = true;
      if (p.burned) o.burned = true;
      return o;
    }
    function unpack(o) {
      return { id: o.id, seed: BigInt(o.seed), createdAt: o.createdAt, author: o.author || "", aid: o.aid || "0", gen: o.gen | 0,
        nervous: o.nervous, slow: o.slow, light: o.light, battery: o.battery,
        strokes: o.strokes.map(function (flat) { var s = []; for (var i = 0; i + 1 < flat.length; i += 2) s.push([flat[i], flat[i + 1]]); return s; }),
        from: o.from || null, fromId: o.fid || "0", giftedAt: o.giftedAt || null,
        note: o.note || null, noteBy: o.noteBy === undefined ? null : o.noteBy, noteAt: o.noteAt || 0,
        secret: !!o.secret, burned: !!o.burned, occasion: o.occasion | 0 };
    }
    function load() {
      if (pieces) return pieces;
      pieces = [];
      try { pieces = JSON.parse(get("seva.pieces") || "[]").map(unpack); } catch (e) { pieces = []; }
      // colecția stă în ordinea sosirii, cel mai nou tablou primul (ca în aplicație); cea de dinainte de proba 5 se așază o dată
      if (get("seva.order") !== "1") { pieces.sort(function (a, b) { return b.createdAt - a.createdAt; }); set("seva.order", "1"); if (pieces.length) save(); }
      return pieces;
    }
    function save() { set("seva.pieces", JSON.stringify(pieces.map(pack))); }

    return {
      get: get, set: set,
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
      list: function () { return load().filter(function (x) { return !x.giftedAt; }); },
      /** Urmele celor dăruite. */
      given: function () { return load().filter(function (x) { return !!x.giftedAt; }); },
      /** Tabloul schimbat (spatele scris, plecarea în dar) se scrie la loc. */
      update: function (p) { load(); var i = pieces.findIndex(function (x) { return x.id === p.id; }); if (i >= 0) pieces[i] = p; else pieces.unshift(p); save(); },
      /**
       * Pune un tablou primit în colecție (Store.add din aplicație). Al meu, după semn: fără „de la”. Dăruit de mine și deschis
       * tot de mine: nu se întoarce, e la cel care l-a primit. Dăruit de mine și trimis înapoi de altcineva: se întoarce.
       * Întoarce "NEW", "ALREADY", "OWN" sau "RETURNED".
       */
      receive: function (p) {
        load();
        var myId = this.authorId(), myName = this.author() || "";
        var mine = p.aid && p.aid !== "0" ? p.aid === myId : (p.author.trim().length > 0 && p.author === myName);
        var sentByMe = !!p.fromId && p.fromId !== "0" && p.fromId === myId;
        if (mine) { p.from = null; p.fromId = "0"; }
        // un gând secret care a ars deja aici nu se mai poate citi, nici dacă linkul e deschis din nou
        var burnt = []; try { burnt = JSON.parse(get("seva.burned") || "[]"); } catch (e) { }
        if (p.secret && burnt.indexOf(p.id) >= 0) { p.note = null; p.secret = false; p.burned = true; }
        var i = pieces.findIndex(function (x) { return x.id === p.id; });
        if (i >= 0) {
          var have = pieces[i];
          if (!have.giftedAt) return "ALREADY";
          // propriul link, deschis de mine: darul e la cel care l-a primit. Cu „rare des” pornit se întoarce, ca să poată fi probat de unul singur.
          if (sentByMe && get("seva.test_often") !== "1") return "OWN";
          pieces.splice(i, 1);
          have.giftedAt = null;
          if (!mine && p.from) { have.from = p.from; have.fromId = p.fromId; }
          // spatele vine cum a ajuns la celălalt: întreg sau ars
          have.note = p.note; have.noteBy = p.noteBy; have.noteAt = p.noteAt; have.secret = p.secret; have.burned = p.burned; have.occasion = p.occasion;
          pieces.unshift(have); save();
          return "RETURNED";
        }
        pieces.unshift(p); save();
        return "NEW";
      },
      /** Arde gândul secret al unui tablou: în telefon nu mai rămâne nimic din el, doar urma. Se cheamă în clipa în care mesajul e arătat. */
      burn: function (p) {
        load();
        p.note = null; p.secret = false; p.burned = true;
        save();
        var burnt = []; try { burnt = JSON.parse(get("seva.burned") || "[]"); } catch (e) { }
        if (burnt.indexOf(p.id) < 0) { burnt.push(p.id); set("seva.burned", JSON.stringify(burnt)); }
      },
      add: function (p) { load(); if (pieces.some(function (x) { return x.id === p.id; })) return false; pieces.unshift(p); save(); return true; },
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

  // ================================================================ raritatea (Rarity.kt)
  //
  // Raritatea rămâne a seminței (Seva.tierOf). Aici se hotărăște doar ce treaptă să poarte sămânța tabloului compus:
  // darul de bun venit (câte unul din fiecare treaptă în primele zece păstrate), apoi norocul zilei, de cel mult zece ori pe zi.
  // Garanția colecționarului vine odată cu abonamentul.

  var Rarity = (function () {
    var TICKETS = 10, P_GOLD = 0.02, P_COLLECTOR = 0.06, P_RARE = 0.20;
    var int = function (k) { return parseInt(Store.get("seva." + k) || "0", 10) || 0; };
    var flag = function (k) { return Store.get("seva." + k) === "1"; };
    function today() { var d = new Date(), two = function (x) { return String(x).padStart(2, "0"); }; return d.getFullYear() + "-" + two(d.getMonth() + 1) + "-" + two(d.getDate()); }
    /** Al câtelea tablou păstrat aduce fiecare treaptă: altfel pentru fiecare om, dar mereu în aceleași ferestre. */
    function slots() {
      var r = new Seva.Random(BigInt.asIntN(64, BigInt(Store.authorId()) ^ 0x57454C43n));
      return [0, 2 + r.nextIntUntil(3), 5 + r.nextIntUntil(3), 8 + r.nextIntUntil(3)];
    }
    /** Treapta care e la rând pentru următorul tablou păstrat, sau 0 dacă hotărăște norocul. */
    function due() {
      var next = int("rare_n") + 1;
      if (next > 10) return 0;
      var s = slots();
      for (var tier = 1; tier <= 3; tier++) if (!flag("rare_got" + tier) && next >= s[tier]) return tier;
      return 0;
    }
    function used() { return Store.get("seva.luck_day") === today() ? int("luck_used") : 0; }
    return {
      TICKETS: TICKETS,
      /** Doar în pagina de probă: tablourile rare apar des și fără limita zilei, ca treptele și efectele lor să poată fi văzute. */
      often: function () { return flag("test_often"); },
      setOften: function (on) { Store.set("seva.test_often", on ? "1" : "0"); },
      ticketsLeft: function () { return Math.max(0, TICKETS - used()); },
      /** Sămânța tabloului compus acum: poartă treapta care i se cuvine. */
      pick: function (seed) {
        var welcome = due();
        if (welcome > 0) return seedWithTier(seed, welcome);
        var often = flag("test_often");
        if (!often && TICKETS - used() <= 0) return seedWithTier(seed, 0);
        var roll = new Seva.Random(BigInt.asIntN(64, seed ^ 0x4C55434Bn)).nextFloat();
        var want = often ? (roll < 0.15 ? 3 : roll < 0.35 ? 2 : roll < 0.6 ? 1 : 0)
          : (roll < P_GOLD ? 3 : roll < P_GOLD + P_COLLECTOR ? 2 : roll < P_GOLD + P_COLLECTOR + P_RARE ? 1 : 0);
        return seedWithTier(seed, want);
      },
      /** La Păstrează: numără darul de bun venit și încercarea zilei. Întoarce true dacă a fost ultima încercare a zilei. */
      onKeep: function (tier) {
        Store.set("seva.rare_n", String(int("rare_n") + 1));
        if (tier >= 1 && tier <= 3) Store.set("seva.rare_got" + tier, "1");
        var n = used() + 1;
        Store.set("seva.luck_day", today()); Store.set("seva.luck_used", String(n));
        return n === TICKETS;
      }
    };
  })();

  // ================================================================ fereastra de întrebat

  var modal = $("modal"), mInput = $("m-input"), mOk = $("m-ok"), mCancel = $("m-cancel"), mDone = null, mSync = null;
  var toastEl = $("toast"), toastTimer = 0;
  /** Un rând scurt care apare și trece. */
  function toast(text) {
    toastEl.textContent = text; toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 2800);
  }
  /** o: { title, text, input (îndemnul câmpului), ok, cancel }. Întoarce, prin then, textul scris sau true; null la Renunță. */
  function ask(o) {
    return new Promise(function (resolve) {
      $("m-title").textContent = o.title || ""; $("m-title").hidden = !o.title;
      $("m-text").textContent = o.text || ""; $("m-text").hidden = !o.text;
      mInput.hidden = !o.input; mInput.value = ""; mInput.placeholder = o.input || "";
      mOk.textContent = o.ok; mCancel.textContent = o.cancel || ""; mCancel.hidden = !o.cancel;
      $("m-gift").hidden = !o.gift;
      mSync = o.sync || null;
      mDone = function (v) { mDone = null; mInput.blur(); modal.hidden = true; window.scrollTo(0, 0); resolve(v); };
      modal.hidden = false;
    });
  }
  mOk.addEventListener("click", function () {
    if (!mDone) return;
    var v = mInput.hidden ? true : mInput.value, now = mSync;
    mSync = null;
    if (now) now(v);      // pe loc, în aceeași atingere
    mDone(v);
  });
  mCancel.addEventListener("click", function () { if (mDone) mDone(null); });
  mInput.addEventListener("keydown", function (e) { if (e.key === "Enter" && mDone) mDone(mInput.value); });
  // după ce tastatura se strânge, pagina revine la locul ei
  mInput.addEventListener("blur", function () { setTimeout(function () { window.scrollTo(0, 0); }, 60); });

  // ================================================================ darul (Gift.kt)
  //
  // Întâi întrebarea, cu gândul de pe spate; apoi plicul, adică linkul, prin ce aplicație alege omul.
  // Linkul e scris de Seva.encode, la fel ca în aplicația de Android: un dar de pe iPhone se deschide la fel oriunde.

  var gNote = $("g-note"), gSecret = $("g-secret"), gBirthday = $("g-birthday"), gChristmas = $("g-christmas");
  gNote.placeholder = T.giftNoteHint;
  $("g-secret-t").textContent = T.secretCheck; $("g-birthday-t").textContent = T.occasionBirthday; $("g-christmas-t").textContent = T.occasionChristmas;
  // cel mult o ocazie
  gBirthday.addEventListener("change", function () { if (gBirthday.checked) gChristmas.checked = false; });
  gChristmas.addEventListener("change", function () { if (gChristmas.checked) gBirthday.checked = false; });
  gNote.addEventListener("blur", function () { setTimeout(function () { window.scrollTo(0, 0); }, 60); });

  /** Are ceva pe spate: un gând, urma unuia ars, sau ștampila unei ocazii. */
  function hasBack(p) { return !!p.note || !!p.burned || (p.occasion | 0) !== 0; }

  /** Crăciunul se poate alege doar în sezon, de la 1 decembrie până la 6 ianuarie. În pagina de probă, cu „rare des”, se vede mereu. */
  function christmasSeason() {
    if (Rarity.often()) return true;
    var d = new Date();
    return d.getMonth() === 11 || (d.getMonth() === 0 && d.getDate() <= 6);
  }

  /** Linkul darului: plicul din familia de culori a tabloului, în limba celui care dăruiește, apoi codul. */
  function giftLink(p) {
    var envelope = T.giftLang + Seva.envelopeKey(Seva.paramsFromPiece(p, lang)) + (p.secret && p.note ? "s" : "") + (p.occasion === 1 ? "b" : p.occasion === 2 ? "c" : "");
    return "https://sevarao.com/g/" + envelope + "/#" + Seva.encode(p, Store.author() || "", Store.authorId());
  }

  /** Fereastra de partajare a telefonului. Întoarce, prin then, true dacă darul a plecat și false dacă omul a închis fereastra. */
  function share(link) {
    if (window.SevaTestShare) return Promise.resolve(window.SevaTestShare(link));
    if (navigator.share) return navigator.share({ url: link }).then(function () { return true; }, function (e) { if (e && e.name === "AbortError") return false; throw e; });
    // fără fereastră de partajare (un browser de birou): linkul se copiază
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(link).then(function () { toast(T.linkCopied); return true; });
    return Promise.reject(new Error("fara partajare"));
  }

  /**
   * Întrebarea dinaintea darului și plecarea lui. Dacă spatele e gol, se poate scrie un gând (o singură dată), se poate face
   * top secret și se poate alege ocazia. `fresh` = tabloul abia compus, dăruit de pe planșă. `done` se cheamă după ce a plecat.
   * Dacă fereastra de partajare e închisă fără să fie ales nimic, nu s-a întâmplat nimic: tabloul rămâne cum era.
   */
  function giveAway(p, fresh, done) {
    var write = !hasBack(p);
    gNote.value = ""; gSecret.checked = false; gBirthday.checked = false; gChristmas.checked = false;
    $("g-christmas-row").hidden = !christmasSeason();
    ask({ title: T.gift, text: fresh ? T.giftAskNow : T.giftAsk, gift: write, ok: T.gift, cancel: T.cancel, sync: function () {
      var before = { note: p.note, noteBy: p.noteBy, noteAt: p.noteAt, secret: p.secret, occasion: p.occasion };
      var undo = function () { p.note = before.note; p.noteBy = before.noteBy; p.noteAt = before.noteAt; p.secret = before.secret; p.occasion = before.occasion; };
      if (write) {
        var text = gNote.value.trim().substring(0, Seva.NOTE_MAX);
        var occasion = gBirthday.checked ? 1 : (gChristmas.checked && christmasSeason() ? 2 : 0);
        if (text.length > 0 || occasion !== 0) {
          // spatele se scrie o singură dată: gândul, dacă e, și ocazia, cu numele și clipa celui care dăruiește
          if (text.length > 0) p.note = text;
          p.noteBy = Store.author() || ""; p.noteAt = Date.now();
          p.secret = text.length > 0 && gSecret.checked;
          p.occasion = occasion;
        }
      }
      var link;
      try { link = giftLink(p); } catch (e) { undo(); toast(T.giftFailed); if (window.console) console.error(e); return; }
      share(link).then(function (sent) {
        if (!sent) { undo(); return; }
        p.giftedAt = Date.now();
        Store.update(p);
        done();
      }, function (e) { undo(); toast(T.giftFailed); if (window.console) console.error(e); });
    } });
  }

  // ================================================================ ecranele

  var onShow = {};
  function go(view) {
    document.body.setAttribute("data-view", view);
    if (onShow[view]) onShow[view]();
  }

  // ================================================================ planșa de desen (GrowthView.kt, MainActivity.kt)

  var stage = $("stage"), board = $("board"), hint = $("hint");
  var btn = { clear: $("clear"), compose: $("compose"), keep: $("keep"), another: $("another"), again: $("again"), backBoard: $("back-board"), give: $("give") };
  btn.clear.textContent = T.clear; btn.compose.textContent = T.compose; btn.keep.textContent = T.keep;
  btn.another.textContent = T.another; btn.again.textContent = T.again; btn.backBoard.textContent = T.backToBoard; btn.give.textContent = T.gift;
  $("to-collection").textContent = T.collection;
  // doar în pagina de probă: atingerea numărului probei face tablourile rare să apară des, ca efectele lor să poată fi văzute
  function paintBuild() { $("build").textContent = BUILD + (Rarity.often() ? " · " + T.often : ""); }
  $("build").addEventListener("click", function () {
    Rarity.setOften(!Rarity.often());
    paintBuild();
    if (!composed && !locked && strokes.length === 0 && !current) { seed = newSeed(); repaint(); }
  });

  var strokes = [];            // formele desenate: { points: [{x, y}], times: [ms] }, în coordonatele cărții
  var current = null;          // forma care se desenează acum
  var pointer = null;          // degetul care desenează; celelalte nu contează
  var composed = false;
  var locked = false;          // după Păstrează, planșa stă pe loc până la „Înapoi la planșă”
  var piece = null;            // tabloul compus acum
  var lastStamp;
  var seed = newSeed();
  var ink = 0xFFFFFFFF | 0;    // cerneala potrivită hârtiei
  var card = { left: 0, top: 0, w: 0, h: 0 };   // cartea, în puncte de ecran
  var dpr = 1;
  var paper = null;            // cartea desenată: hârtia goală sau tabloul
  var queued = false;

  /** Sămânța momentului, cu treapta pe care o poartă (ascunsă până la Păstrează). Gustul vine mai târziu. */
  function newSeed() {
    var s = BigInt(Date.now());
    if (typeof lastStamp !== "undefined" && s <= lastStamp) s = lastStamp + 1n;
    lastStamp = s;
    return Rarity.pick(s);
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
    if (rv) { drawReveal(c); return; }
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
    // cât tabloul rar își primește rama, atingerea doar scurtează momentul
    if (rv) { if (performance.now() - rv.start > (rv.tier === 3 ? 2600 : 900)) endReveal(); return; }
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
    btn.backBoard.hidden = btn.give.hidden = !locked || !!rv;
    var tier = locked && piece ? Seva.tierOf(piece.seed) : 0;
    hint.textContent = rv ? T.rareFound : locked ? T.choiceKept.replace("%s", T.tiers[tier] || T.tier0) : composed ? T.hintComposed : (n === 0 ? "\u00a0" : T.hintMore);
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
    // raritatea se află abia acum; tabloul intră în colecție înainte de orice efect, ca nimic să nu-l poată pierde
    var tier = Seva.tierOf(piece.seed);
    Store.add(piece);
    Rarity.onKeep(tier);
    if (tier === 0) { locked = true; state(); repaint(); }
    else reveal(tier, T.tiers[tier], tier === 3 ? T.goldSub : "", function () { state(); invalidate(); });
  });
  btn.backBoard.addEventListener("click", startNew);
  btn.give.addEventListener("click", function () {      // darul de pe planșă, imediat după ce tabloul și-a arătat treapta
    var p = piece;
    if (!p || !locked || rv) return;
    // între timp putea fi șters sau dăruit din colecție
    if (!Store.list().some(function (x) { return x.id === p.id; })) { startNew(); return; }
    giveAway(p, true, function () { forget(p.id); startNew(); });
  });
  $("to-collection").addEventListener("click", function () { go("collection"); });

  // ---------------------------------------------------------------- momentul în care un tablou rar își primește rama (GrowthView.reveal)

  var rv = null;
  var BURSTS = [0.62, 1.1, 1.62, 2.2, 2.9, 3.55, 4.3];
  function rgba(rgb, a) { return "rgba(" + ((rgb >> 16) & 255) + "," + ((rgb >> 8) & 255) + "," + (rgb & 255) + "," + Math.max(0, Math.min(1, a)) + ")"; }
  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function dice(seedBig) {       // numere la întâmplare pentru scântei; aici nu trebuie să fie aceleași ca pe Android
    var s = Number(BigInt.asUintN(32, seedBig)) || 1;
    var f = function () { s |= 0; s = s + 0x6D2B79F5 | 0; var t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    return { f: f, i: function (n) { return Math.floor(f() * n); } };
  }

  /**
   * La Păstrează, un tablou rar: rama obișnuită se topește în rama lui, o lumină trece peste tablou, scântei se ridică
   * de pe ramă (la Seva de aur plouă și praf de aur), iar numele treptei apare o clipă. La sfârșit cheamă onDone.
   */
  function reveal(tier, label, sub, onDone) {
    var old = mk(paper.width, paper.height);
    old.getContext("2d").drawImage(paper, 0, 0);
    locked = true;
    repaint();                    // de acum cartea poartă rama treptei
    var total = tier === 3 ? 6.7 : tier === 2 ? 3.3 : 2.5;
    var r = dice(piece.seed);
    var L = card.left, Tp = card.top, R = card.left + card.w, B = card.top + card.h, w = card.w, h = card.h;
    var colors = tier === 3 ? [0xFFE9A6, 0xF6C95A, 0xFFF8E0] : tier === 2 ? [0xFFFFFF, 0xDCE6F5, 0xF2E6CF] : [0xF2E6CF, 0xFFFFFF];
    var sparks = [], fires = [], leaves = [], burstXY = [], i, k;
    // scânteile de pe ramă: se nasc pe marginea cărții și se ridică încet
    for (i = 0, k = tier === 3 ? 110 : tier === 2 ? 36 : 18; i < k; i++) {
      var side = r.i(4), u = r.f();
      sparks.push({ x: side <= 1 ? L + w * u : side === 2 ? L + 3 : R - 3, y: side === 0 ? Tp + 3 : side === 1 ? B - 3 : Tp + h * u,
        vx: (r.f() * 2 - 1) * 12, vy: -(6 + r.f() * 18), born: 0.15 + r.f() * (total - 1.5), life: 0.7 + r.f() * 0.7, size: 2.2 + r.f() * 3.4, color: colors[r.i(colors.length)] });
    }
    if (tier === 3) {
      // praful de aur: cade de sus, peste tablou
      for (i = 0; i < 90; i++) sparks.push({ x: L + w * r.f(), y: Tp + h * 0.35 * r.f(), vx: (r.f() * 2 - 1) * 8, vy: 40 + r.f() * 90,
        born: 0.3 + r.f() * (total - 2.2), life: 1.1 + r.f() * 0.9, size: 0.9 + r.f() * 1.6, color: colors[r.i(colors.length)] });
      // artificiile: fiecare izbucnire își are locul, clipa și culoarea ei; ultima e cea mai mare
      BURSTS.forEach(function (bt, bi) {
        var bx = L + w * (0.18 + r.f() * 0.64), by = Tp + h * (0.13 + r.f() * 0.42), tint = colors[r.i(colors.length)];
        burstXY.push(bx, by);
        for (var j = 0, m = bi === BURSTS.length - 1 ? 84 : 52; j < m; j++) fires.push({ x: bx, y: by, ang: r.f() * 6.2832, speed: 70 + r.f() * 170, born: bt,
          life: 0.9 + r.f() * 0.8, size: 1.3 + r.f() * 1.7, color: r.f() < 0.65 ? tint : colors[r.i(colors.length)] });
      });
      // foițele de aur: cad de sus, răsucindu-se
      var golds = [0xF6C95A, 0xFFE9A6, 0xD4A93C, 0xFFF4C8, 0xE8B84A];
      for (i = 0; i < 150; i++) leaves.push({ x: L + w * r.f(), born: 0.6 + r.f() * 3.4, fall: 110 + r.f() * 150, sway: 10 + r.f() * 28, freq: 1.2 + r.f() * 2.2,
        phase: r.f() * 6.28, spin: 2 + r.f() * 5, w: 4.5 + r.f() * 5.5, h: 2.4 + r.f() * 2.8, color: golds[r.i(golds.length)] });
    }
    rv = { tier: tier, label: label, sub: sub, done: onDone, start: performance.now(), total: total, old: old, sparks: sparks, fires: fires, leaves: leaves, burstXY: burstXY };
    state();
    invalidate();
  }

  function endReveal() {
    if (!rv) return;
    var done = rv.done;
    rv.old.width = 0;
    rv = null;
    invalidate();
    if (done) done();
  }

  function roundRect(c, x0, y0, x1, y1, rad) {
    c.beginPath();
    c.moveTo(x0 + rad, y0); c.arcTo(x1, y0, x1, y1, rad); c.arcTo(x1, y1, x0, y1, rad); c.arcTo(x0, y1, x0, y0, rad); c.arcTo(x0, y0, x1, y0, rad);
    c.closePath();
  }

  function drawReveal(c) {
    var t = (performance.now() - rv.start) / 1000, total = rv.total, tier = rv.tier;
    var L = card.left, Tp = card.top, w = card.w, h = card.h;
    var cx = L + w / 2, cy = Tp + h / 2, W = board.width / dpr, H = board.height / dpr, k, g, a;
    // cu cât se apropie sfârșitul, totul se stinge lin
    var out = clamp01((total - t) / 0.7);
    if (tier === 3) {
      // Seva de aur: tabloul se întunecă o clipă și o lumină crește din mijloc, apoi izbucnește și lasă în urmă rama de aur
      if (t < 0.42) {
        c.drawImage(rv.old, L, Tp, w, h);
        k = t / 0.42;
        c.fillStyle = rgba(0x0A0806, 0.66 * k); c.fillRect(L, Tp, w, h);
        var rad = w * (0.04 + 0.5 * k * k);
        g = c.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g.addColorStop(0, rgba(0xFFF6D8, 1)); g.addColorStop(0.45, rgba(0xF6C95A, 0.75)); g.addColorStop(1, rgba(0xF6C95A, 0));
        c.fillStyle = g; c.beginPath(); c.arc(cx, cy, rad, 0, 6.2832); c.fill();
      } else {
        // razele: un evantai de lumină care se rotește încet în spatele sărbătorii
        var ra = clamp01(Math.min((t - 0.42) / 0.5, (5.2 - t) / 1.4)) * out;
        if (ra > 0) {
          var reach = Math.hypot(W, H);
          c.save(); c.translate(cx, cy); c.rotate(t * 15 * Math.PI / 180);
          c.beginPath();
          for (k = 0; k < 14; k++) {
            var a0 = k * 0.4488, a1 = a0 + 0.15;
            c.moveTo(0, 0); c.lineTo(Math.cos(a0) * reach, Math.sin(a0) * reach); c.lineTo(Math.cos(a1) * reach, Math.sin(a1) * reach); c.closePath();
          }
          c.fillStyle = rgba(0xFFE9A6, 0.204 * ra); c.fill();
          c.restore();
        }
        // izbucnirea: totul e lumină, apoi se limpezește
        var fl = clamp01(1 - (t - 0.42) / 0.85);
        if (fl > 0) { c.fillStyle = rgba(0xFFF6D8, 0.957 * fl * fl); c.fillRect(0, 0, W, H); }
        // rama pulsează în aur
        var s2 = Math.sin(t * 5.4), pulse = (0.45 + 0.55 * s2 * s2) * out;
        for (k = 0; k < 3; k++) {
          c.lineWidth = 16 - k * 6;
          c.strokeStyle = rgba(0xFFD978, (0x16 + k * 0x1E) / 255 * pulse);
          c.strokeRect(L, Tp, w, h);
        }
      }
    } else {
      // rama obișnuită se topește în cea nouă
      a = clamp01(1 - t / 0.8);
      if (a > 0) { c.globalAlpha = a; c.drawImage(rv.old, L, Tp, w, h); c.globalAlpha = 1; }
    }
    c.save();
    c.beginPath(); c.rect(L, Tp, w, h); c.clip();
    // lumina care trece pieziș peste tablou: o dată, de două ori, iar la Seva de aur de patru ori
    var tint = tier === 3 ? 0xFFE9A6 : 0xFFFFFF;
    for (k = 0; k < (tier === 3 ? 4 : tier); k++) {
      var s = (t - ((tier === 3 ? 1.0 : 0.3) + k * 0.85)) / 0.95;
      if (s <= 0 || s >= 1) continue;
      var band = w * 0.34, x = L - band * 2 + (w + band * 4) * s;
      g = c.createLinearGradient(x - band, 0, x + band, 0);
      g.addColorStop(0, rgba(tint, 0)); g.addColorStop(0.5, rgba(tint, 0.345)); g.addColorStop(1, rgba(tint, 0));
      c.save(); c.translate(cx, cy); c.rotate(18 * Math.PI / 180); c.translate(-cx, -cy);
      c.fillStyle = g; c.fillRect(x - band, Tp - h * 0.3, band * 2, h * 1.6);
      c.restore();
    }
    c.restore();
    if (tier === 3 && t >= 0.42) drawFeast(c, t, out, H);
    // scânteile: stele mici cu patru colțuri, care clipesc o dată și se sting
    rv.sparks.forEach(function (sp) {
      var age = t - sp.born;
      if (age <= 0 || age >= sp.life) return;
      var al = Math.sin(Math.PI * age / sp.life), x = sp.x + sp.vx * age, y = sp.y + sp.vy * age, rr = sp.size * (0.55 + 0.45 * al);
      c.fillStyle = rgba(sp.color, 0.22 * al);
      c.beginPath(); c.arc(x, y, rr * 1.9, 0, 6.2832); c.fill();
      c.fillStyle = rgba(sp.color, 0.94 * al);
      c.beginPath();
      c.moveTo(x, y - rr); c.quadraticCurveTo(x, y, x + rr, y); c.quadraticCurveTo(x, y, x, y + rr); c.quadraticCurveTo(x, y, x - rr, y); c.quadraticCurveTo(x, y, x, y - rr);
      c.fill();
    });
    // numele treptei: apare, stă, se stinge
    var from = tier === 3 ? 1.15 : 0.55;
    var la = clamp01(Math.min((t - from) / (tier === 3 ? 0.25 : 0.45), (total - 0.25 - t) / 0.5));
    if (la > 0 && rv.label) {
      var gold = tier === 3, size = gold ? 36 : 26, two = gold && !!rv.sub;
      var font = function (px) { return "italic " + px + "px Georgia, 'Times New Roman', serif"; };
      c.font = font(16); var subW = two ? c.measureText(rv.sub).width : 0;
      c.font = font(size);
      var tw = Math.max(c.measureText(rv.label).width, subW);
      // pe un telefon îngust, numele se strânge cât să încapă pe carte
      var padX = gold ? 34 : 26, half = two ? 46 : 27, fitK = Math.min(1, (w * 0.94) / (tw + padX * 2));
      c.save();
      c.translate(cx, cy);
      if (gold) {   // numele sare în față și se așază
        var uu = clamp01((t - from) / 0.5), pop = 0.55 + 0.45 * uu + 0.22 * Math.sin(Math.PI * uu);
        c.scale(pop, pop);
      }
      c.scale(fitK, fitK);
      roundRect(c, -tw / 2 - padX, -half, tw / 2 + padX, half, half);
      c.fillStyle = rgba(0x141318, 0.77 * la); c.fill();
      c.lineWidth = 1.2; c.strokeStyle = rgba(gold ? 0xF1DC96 : 0xF2E6CF, 0.565 * la); c.stroke();
      c.textAlign = "center"; c.textBaseline = "alphabetic";
      c.fillStyle = rgba(gold ? 0xF6E4A4 : 0xF2E6CF, la);
      if (two) {
        c.fillText(rv.label, 0, 3);
        c.font = font(16); c.fillStyle = rgba(0xF2E6CF, 0.85 * la);
        c.fillText(rv.sub, 0, 28);
      } else c.fillText(rv.label, 0, size * 0.34);
      c.restore();
    }
    if (t >= total) setTimeout(endReveal, 0); else invalidate();
  }

  /** Sărbătoarea de la Seva de aur: foițe de aur care cad răsucindu-se și artificii care izbucnesc peste tablou. */
  function drawFeast(c, t, out, H) {
    var Tp = card.top, g;
    rv.leaves.forEach(function (lf) {
      var age = t - lf.born;
      if (age <= 0) return;
      var y = Tp - 24 + lf.fall * age;
      if (y > H + 20) return;
      var x = lf.x + Math.sin(age * lf.freq + lf.phase) * lf.sway;
      // foița se răsucește: lățimea ei se strânge și se desface, și prinde lumina când e cu fața
      var turn = Math.abs(Math.cos(age * lf.spin + lf.phase));
      var a = (0.55 + 0.45 * turn) * out * Math.min(1, age / 0.25), hw = lf.w * 0.5 * Math.max(turn, 0.15);
      c.save(); c.translate(x, y); c.rotate(((age * lf.spin * 40 + lf.phase * 57) % 360) * Math.PI / 180);
      c.fillStyle = rgba(lf.color, 0.94 * a);
      c.fillRect(-hw, -lf.h * 0.5, hw * 2, lf.h);
      c.restore();
    });
    // artificiile: clipa izbucnirii, apoi dârele care se deschid, încetinesc și cad
    BURSTS.forEach(function (bt, bi) {
      var age = t - bt;
      if (age < 0 || age >= 0.22) return;
      var k = 1 - age / 0.22, rad = 26 + 90 * (1 - k), bx = rv.burstXY[bi * 2], by = rv.burstXY[bi * 2 + 1];
      g = c.createRadialGradient(bx, by, 0, bx, by, rad);
      g.addColorStop(0, rgba(0xFFF8E0, 0.88 * k)); g.addColorStop(1, rgba(0xFFE9A6, 0));
      c.fillStyle = g; c.beginPath(); c.arc(bx, by, rad, 0, 6.2832); c.fill();
    });
    var reach = function (a) { return (1 - Math.exp(-2.4 * a)) / 2.4; };
    c.lineCap = "round";
    rv.fires.forEach(function (f) {
      var age = t - f.born;
      if (age <= 0 || age >= f.life) return;
      var k = age / f.life, a0 = Math.max(0, age - 0.09), d = reach(age), d0 = reach(a0), cs = Math.cos(f.ang), sn = Math.sin(f.ang);
      var x = f.x + cs * f.speed * d, y = f.y + sn * f.speed * d + 60 * age * age;
      var x0 = f.x + cs * f.speed * d0, y0 = f.y + sn * f.speed * d0 + 60 * a0 * a0;
      // spre sfârșit scânteia pâlpâie
      var a = (1 - k) * out;
      if (k > 0.6) a *= 0.55 + 0.45 * Math.sin(age * 46 + f.ang * 9);
      c.lineWidth = f.size; c.strokeStyle = rgba(f.color, 0.69 * a);
      c.beginPath(); c.moveTo(x0, y0); c.lineTo(x, y); c.stroke();
      c.fillStyle = rgba(f.color, a);
      c.beginPath(); c.arc(x, y, f.size * 0.85, 0, 6.2832); c.fill();
    });
  }

  // ================================================================ colecția (CollectionActivity.kt)

  var grid = $("grid"), gridWrap = $("grid-wrap"), colEmpty = $("col-empty");
  $("col-back").textContent = T.back;
  var tabKept = $("tab-kept"), tabGiven = $("tab-given"), givenTab = false;
  tabKept.textContent = T.collection; tabGiven.textContent = T.givenTab;
  tabKept.addEventListener("click", function () { givenTab = false; onShow.collection(); });
  tabGiven.addEventListener("click", function () { givenTab = true; onShow.collection(); });
  /** Miniatura unui tablou nu mai e bună (a fost șters sau a plecat în dar). */
  function forget(id) {
    [id, id + "-d"].forEach(function (k) { if (thumbs[k]) { try { URL.revokeObjectURL(thumbs[k]); } catch (e) { } delete thumbs[k]; } });
  }
  /** Urma unui tablou dăruit: tabloul stins, cu „Dăruit” și data peste el (CollectionActivity.trace). */
  function fade(small, p) {
    var c = small.getContext("2d"), w = small.width, h = small.height;
    var img = c.getImageData(0, 0, w, h), d = img.data, a = 0x5C / 255;
    for (var i = 0; i < d.length; i += 4) {
      var lum = 0.213 * d[i] + 0.715 * d[i + 1] + 0.072 * d[i + 2];
      d[i] = 0x1E * (1 - a) + (lum * 0.8 + d[i] * 0.2) * a;
      d[i + 1] = 0x1D * (1 - a) + (lum * 0.8 + d[i + 1] * 0.2) * a;
      d[i + 2] = 0x24 * (1 - a) + (lum * 0.8 + d[i + 2] * 0.2) * a;
      d[i + 3] = 255;
    }
    c.putImageData(img, 0, 0);
    // un văl întunecat la mijloc, ca textul să se citească pe orice tablou
    c.fillStyle = "rgba(30,29,36,0.706)"; c.fillRect(0, h * 0.38, w, h * 0.24);
    var day = new Date(p.giftedAt), month;
    try { month = new Intl.DateTimeFormat(lang, { month: "long" }).format(day); } catch (e) { month = String(day.getMonth() + 1); }
    c.fillStyle = "#B8B2A6"; c.textAlign = "center"; c.textBaseline = "alphabetic";
    c.font = "italic " + (w * 0.075) + "px Georgia, 'Times New Roman', serif";
    c.fillText(T.gifted, w / 2, h / 2 - w * 0.05);
    c.font = "italic " + (w * 0.06) + "px Georgia, 'Times New Roman', serif";
    c.fillText(day.getDate() + " " + month + " " + day.getFullYear(), w / 2, h / 2 + w * 0.07);
  }
  var shown = [];              // tablourile din grilă, în ordinea în care se văd
  var thumbs = {};             // miniaturile făcute: id -> adresa imaginii
  var jobs = [], working = false;
  var watcher = null;

  /** Miniaturile se desenează pe rând, doar pentru căsuțele ajunse la vedere, ca derularea să rămână ușoară. */
  function work() {
    if (working) return;
    var job = jobs.shift();
    if (!job) return;
    if (!job.img.isConnected || thumbs[job.key]) { work(); return; }
    working = true;
    setTimeout(function () {
      try {
        Seva.render(freshSheet(), S.w, S.h, S.dp, Seva.paramsFromPiece(job.p, lang));
        var w = Math.round(Math.min(job.img.parentNode.clientWidth || 170, 220) * Math.min(ratio(), 2));
        var small = mk(w, Math.round(w * S.h / S.w));
        sheetInto(small);
        if (job.given) fade(small, job.p);
        var done = function (url) { thumbs[job.key] = url; job.img.src = url; job.img.classList.add("ready"); small.width = 0; working = false; work(); };
        if (small.toBlob) small.toBlob(function (b) { done(b ? URL.createObjectURL(b) : small.toDataURL("image/jpeg", 0.9)); }, "image/jpeg", 0.9);
        else done(small.toDataURL("image/jpeg", 0.9));
      } catch (e) { if (window.console) console.error(e); working = false; work(); }
    }, 0);
  }

  onShow.collection = function () {
    shown = Store.list();
    var given = givenTab, list = given ? Store.given() : shown;
    tabKept.classList.toggle("on", !given); tabGiven.classList.toggle("on", given);
    colEmpty.textContent = given ? T.givenEmpty : T.collectionEmpty;
    colEmpty.hidden = list.length > 0;
    grid.textContent = "";
    jobs = [];
    if (watcher) watcher.disconnect();
    watcher = window.IntersectionObserver ? new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        watcher.unobserve(en.target);
        jobs.push({ p: en.target._piece, key: en.target._key, given: given, img: en.target.firstChild });
      });
      work();
    }, { root: gridWrap, rootMargin: "400px 0px" }) : null;
    list.forEach(function (p, i) {
      var cell = document.createElement("div"), key = p.id + (given ? "-d" : "");
      cell.className = given ? "cell given" : "cell";
      if (!given) cell.setAttribute("role", "button");
      cell._key = key;
      var img = document.createElement("img");
      img.alt = ""; img.draggable = false;
      cell.appendChild(img);
      cell._piece = p;
      if (thumbs[key]) { img.src = thumbs[key]; img.classList.add("ready"); }
      else if (watcher) watcher.observe(cell);
      else jobs.push({ p: p, key: key, given: given, img: img });
      // urma unui tablou dăruit nu se deschide: tabloul e la cel care l-a primit
      if (!given) cell.addEventListener("click", function () { openViewer(i, false); });
      grid.appendChild(cell);
    });
    work();
  };
  $("col-back").addEventListener("click", function () { givenTab = false; go("board"); });

  // ================================================================ focul unui gând top secret (Burn.kt)
  //
  // Fiecare tablou are câmpul lui de ardere, născut din sămânță: când ajunge focul în fiecare loc, unde arde hârtia de tot
  // și cât de afumată rămâne în rest. Același câmp desenează și focul în mișcare, și urma lui de după.
  // Socotelile sunt cele din aplicația de Android, ca hârtia arsă a unui tablou să arate la fel pe orice telefon.

  var Burn = (function () {
    var EXTENT = 0.58, HOLE = 0.63, INSET = 0.046, LIVE_COLS = 128, FINAL_COLS = 256;
    var f = Math.fround, MUL = 1274126177;
    var CHAR = 0x17120E, SCORCH = 0x3A2412;

    /** Cât stă mesajul la vedere: 5 secunde pentru cele scurte, câte o secundă în plus la fiecare 25 de litere, cel mult 12. */
    function seconds(length) { return Math.min(12, 5 + Math.max(0, length - 60) / 25); }

    // amestecul din Burn.hash lucrează pe 64 de biți; aici e făcut din jumătăți de 32, fiindcă BigInt ar fi prea încet
    // la sutele de mii de celule ale câmpului
    function mulHi(a, b) {       // jumătatea de sus a produsului a doi întregi fără semn de 32 de biți
      var a0 = a & 0xFFFF, a1 = a >>> 16, b0 = b & 0xFFFF, b1 = b >>> 16;
      var p00 = a0 * b0, p01 = a0 * b1, p10 = a1 * b0, p11 = a1 * b1;
      var mid = (p00 >>> 16) + (p01 & 0xFFFF) + (p10 & 0xFFFF);
      return (p11 + (p01 >>> 16) + (p10 >>> 16) + (mid >>> 16)) >>> 0;
    }
    /** seed * 1442695040888963407, pe 64 de biți, ca două jumătăți: partea care nu ține de celulă. */
    function salt(seed) {
      var v = BigInt.asUintN(64, BigInt.asIntN(64, seed) * 1442695040888963407n);
      return { lo: Number(v & 0xFFFFFFFFn), hi: Number(v >> 32n) };
    }
    function hash(ix, iy, s) {
      var a = ix * 374761393 + iy * 668265263;                       // încape întreg într-un număr obișnuit
      var lo = (a % 4294967296) + s.lo, carry = lo >= 4294967296 ? 1 : 0;
      var hi = (Math.floor(a / 4294967296) + s.hi + carry) >>> 0;
      lo = lo >>> 0;
      var ylo = (lo ^ ((lo >>> 13) | (hi << 19))) >>> 0, yhi = (hi ^ (hi >>> 13)) >>> 0;        // x xor (x ushr 13)
      var zlo = Math.imul(ylo, MUL) >>> 0, zhi = (mulHi(ylo, MUL) + Math.imul(yhi, MUL)) >>> 0;  // * 1274126177
      var w = zlo ^ ((zlo >>> 16) | (zhi << 16));                                             // x xor (x ushr 16)
      return f((w & 0xFFFFFF) / 0xFFFFFF);
    }
    function smooth(t) { var c = t < 0 ? 0 : t > 1 ? 1 : t; return f(c * c * (3 - 2 * c)); }
    function noise(x, y, s) {
      var ix = Math.floor(x), iy = Math.floor(y);
      var fx = smooth(x - ix), fy = smooth(y - iy);
      var a = hash(ix, iy, s), b = hash(ix + 1, iy, s), c = hash(ix, iy + 1, s), d = hash(ix + 1, iy + 1, s);
      return f((a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy);
    }
    function fbm(x, y, s) { return f(noise(x, y, s[0]) * 0.55 + noise(x * 2, y * 2, s[1]) * 0.30 + noise(x * 4, y * 4, s[2]) * 0.15); }

    /** java.util.Random, doar cât trebuie: nextFloat. */
    function javaRandom(seed) {
      var mask = (1n << 48n) - 1n, s = (BigInt.asUintN(64, seed) ^ 0x5DEECE66Dn) & mask;
      return { nextFloat: function () { s = (s * 0x5DEECE66Dn + 0xBn) & mask; return f(Number(s >> 24n) / 16777216); } };
    }

    function field(seed, w, h, cols) {
      var rows = Math.max(cols >> 1, Math.min(cols * 3, Math.trunc(cols * h / Math.max(w, 1))));
      var aspect = f(rows / cols);
      var r = javaRandom(BigInt.asIntN(64, seed ^ 0x5EC2E7n));
      // trei puncte de aprindere, răspândite prin zona scrisului: sus-stânga, mijloc-dreapta, jos
      var px = [0.2 + r.nextFloat() * 0.2, 0.6 + r.nextFloat() * 0.2, 0.3 + r.nextFloat() * 0.4];
      var py = [0.30 + r.nextFloat() * 0.13, 0.42 + r.nextFloat() * 0.14, 0.60 + r.nextFloat() * 0.15];
      var S = function (k) { return salt(seed + BigInt(k)); };
      var s0 = [S(0), S(1), S(2)], s9 = [S(9), S(10), S(11)], s21 = [S(21), S(22), S(23)], s5 = S(5), s6 = S(6);
      var n = cols * rows, arrive = new Float32Array(n), hole = new Float32Array(n), stain = new Float32Array(n);
      for (var cy = 0; cy < rows; cy++) {
        var v = (cy + 0.5) / rows;
        for (var cx = 0; cx < cols; cx++) {
          var u = (cx + 0.5) / cols, d = Infinity;
          for (var k = 0; k < 3; k++) d = Math.min(d, Math.hypot(u - px[k], (v - py[k]) * aspect));
          var x = d / 0.75 * 0.6 + fbm(u * 5, v * 5 * aspect, s0) * 0.5;
          // zona scrisului arde sigur și devreme; trecerea spre restul hârtiei e lină, ca să nu se vadă un dreptunghi
          var inside = smooth((u - 0.02) / 0.08) * smooth((0.98 - u) / 0.08) * smooth((v - 0.16) / 0.08) * smooth((0.90 - v) / 0.06);
          x *= 1 - 0.5 * inside;
          // jos, semnătura rămâne: focul nu coboară până la ea
          if (v > 0.90) x += (v - 0.90) / 0.05 * 0.9;
          var i = cy * cols + cx, near = d / 0.10;
          arrive[i] = x;
          // găurile: pete mari neregulate, mai sigure lângă punctele de aprindere, cu margine zdrențuită
          hole[i] = fbm(u * 3.2, v * 3.2 * aspect, s9) + 0.30 * Math.exp(-near * near) +
            0.10 * (noise(u * 16, v * 16 * aspect, s5) - 0.5) + 0.05 * (noise(u * 40, v * 40 * aspect, s6) - 0.5);
          stain[i] = fbm(u * 7, v * 7 * aspect, s21);
        }
      }
      return { cols: cols, rows: rows, arrive: arrive, hole: hole, stain: stain };
    }

    function put(d, i, rgb, a) { var o = i * 4; d[o] = (rgb >> 16) & 255; d[o + 1] = (rgb >> 8) & 255; d[o + 2] = rgb & 255; d[o + 3] = Math.max(0, Math.min(255, Math.trunc(a * 255))); }
    function lerp(a, b, t) {
      var c = t < 0 ? 0 : t > 1 ? 1 : t, ch = function (s) { var x = (a >> s) & 255; return Math.trunc(x + (((b >> s) & 255) - x) * c) & 255; };
      return (ch(16) << 16) | (ch(8) << 8) | ch(0);
    }

    /** Urma rece a focului: găuri carbonizate, margini înnegrite, hârtie afumată inegal. O culoare pe celulă. */
    function finalMask(fl, d) {
      for (var i = 0; i < fl.arrive.length; i++) {
        var x = fl.arrive[i];
        if (x >= EXTENT) { put(d, i, 0, 0); continue; }
        var ramp = Math.min(1, (EXTENT - x) / 0.30);
        var hd = (fl.hole[i] - HOLE) * ramp - (1 - ramp) * 0.2;
        if (hd > 0.015) put(d, i, CHAR, 1);
        else if (hd > -0.05) { var t = (hd + 0.05) / 0.065; put(d, i, lerp(SCORCH, CHAR, t * t), 0.30 + 0.68 * t); }
        else put(d, i, SCORCH, (0.04 + 0.30 * fl.stain[i]) * ramp * Math.sqrt(ramp));
      }
    }

    /**
     * Focul în mișcare, când a ajuns la `cur`: `behind` e opac acolo unde focul a trecut deja (acolo se vede hârtia de după,
     * fără scris); `glow` e muchia incandescentă și hârtia care se închide la culoare chiar înaintea ei.
     */
    function liveMasks(fl, cur, behind, glow) {
      var band = 0.04, ahead = 0.05;
      for (var i = 0; i < fl.arrive.length; i++) {
        var x = fl.arrive[i];
        put(behind, i, 0, x < cur ? 1 : 0);
        if (x >= EXTENT + 0.02 || x < cur - band) put(glow, i, 0, 0);
        else if (x < cur) {
          // de la galben, pe muchia focului, prin portocaliu, la roșu care se stinge în urma lui
          var t = (cur - x) / band;
          var c = t < 0.35 ? lerp(0xFFEDA8, 0xFF8A1F, t / 0.35) : lerp(0xFF8A1F, 0x7A1E08, (t - 0.35) / 0.65);
          put(glow, i, c, t < 0.55 ? 1 : 1 - (t - 0.55) / 0.45);
        } else if (x < cur + ahead) { var a = 1 - (x - cur) / ahead; put(glow, i, SCORCH, a * a * 0.75); }
        else put(glow, i, 0, 0);
      }
    }

    /** O mască de celule, ca pânză mică, gata de întins peste carte. */
    function maskCanvas(fl) { var c = mk(fl.cols, fl.rows); return { canvas: c, ctx: c.getContext("2d"), img: c.getContext("2d").createImageData(fl.cols, fl.rows) }; }

    /** Urma focului, pusă pe spatele unui tablou al cărui mesaj a ars; doar înăuntrul ramei. */
    function scorch(canvas, seed) {
      var fl = field(seed, canvas.width, canvas.height, FINAL_COLS), m = maskCanvas(fl);
      finalMask(fl, m.img.data);
      m.ctx.putImageData(m.img, 0, 0);
      var c = canvas.getContext("2d"), inset = canvas.width * INSET;
      c.save();
      c.beginPath(); c.rect(inset, inset, canvas.width - 2 * inset, canvas.height - 2 * inset); c.clip();
      c.imageSmoothingEnabled = true; c.imageSmoothingQuality = "high";
      c.drawImage(m.canvas, 0, 0, canvas.width, canvas.height);
      c.restore();
      m.canvas.width = 0;
    }

    return { EXTENT: EXTENT, INSET: INSET, LIVE_COLS: LIVE_COLS, seconds: seconds, field: field, liveMasks: liveMasks, maskCanvas: maskCanvas, scorch: scorch, _hash: hash, _salt: salt };
  })();

  // ================================================================ tabloul mare (ViewActivity.kt)
  //
  // Fața și spatele sunt două pânze lipite spate în spate; cartea se întoarce cu totul. Peste spate se desenează,
  // când e cazul, numărătoarea unui gând top secret și focul lui.

  var viewStage = $("view-stage"), vcard = $("vcard"), view = $("view"), viewBack = $("view-back-face"), viewAt = 0;
  var viewFrom = $("view-from"), viewTurn = $("view-turn");
  $("view-back").textContent = T.back; $("view-delete").textContent = T.del; $("view-give").textContent = T.gift;
  viewTurn.textContent = T.turnOver;
  var sheetB = mk(S.w, S.h);       // coala spatelui
  var backBase = null;             // spatele desenat, la mărimea cărții; null dacă tabloul nu are spate
  var turned = false;
  var secret = null;               // gândul top secret care se numără sau arde acum
  var arrivalTimers = [];

  function openViewer(i, arrived) {
    viewAt = i;
    drawnKey = "";
    go("viewer");
    if (arrived) arrive(shown[viewAt]);
  }

  /** Spatele unui tablou, la mărimea cărții: gândul, semnatarul, timbrul; după foc, hârtia arsă, fără scris (Renders.back). */
  function backOf(p, gone) {
    if (!hasBack(p)) return null;
    var isGone = !!p.burned || gone;
    var params = Seva.paramsFromPiece(p, lang);
    var fcv = freshSheet();
    Seva.render(fcv, S.w, S.h, S.dp, params);                 // fața, pentru timbru
    sheetB.width = S.w;
    var bcv = new Seva.Canvas2D(sheetB.getContext("2d"), S.w, S.h, mk);
    var at = p.noteAt > 0 ? p.noteAt : p.createdAt;
    Seva.renderBack(bcv, S.w, S.h, S.dp, params, isGone ? "" : (p.note || ""), Seva.signature(p.noteBy || "", at, lang), Seva.stampDate(at),
      Seva.stampFor(bcv, S.w, S.h, S.dp, params, fcv), isGone || p.secret ? T.topSecret : null, p.occasion | 0, p.occasion ? T.stamp[p.occasion] : null);
    var out = mk(view.width, view.height), c = out.getContext("2d");
    c.imageSmoothingEnabled = true; c.imageSmoothingQuality = "high";
    c.drawImage(sheetB, 0, 0, S.w, S.h, 0, 0, out.width, out.height);
    if (isGone) Burn.scorch(out, p.seed);
    return out;
  }

  function showBack(canvas) {
    var c = viewBack.getContext("2d");
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, viewBack.width, viewBack.height);
    if (canvas) c.drawImage(canvas, 0, 0);
  }

  function setTurned(on, instant) {
    turned = on;
    if (instant) { vcard.style.transition = "none"; vcard.classList.toggle("turned", on); void vcard.offsetWidth; vcard.style.transition = ""; }
    else vcard.classList.toggle("turned", on);
  }

  var drawnKey = "";               // ce e desenat acum: tabloul, mărimea cărții și starea spatelui
  function drawViewer() {
    var p = shown[viewAt];
    var W = viewStage.clientWidth, H = viewStage.clientHeight;
    if (!p || W <= 0 || H <= 0) return;
    var c = fitCard(W, H), k = ratio();
    // același tablou, la aceeași mărime (ecranul doar s-a așezat): nimic de refăcut, iar numărătoarea și întoarcerea își văd de drum
    var key = p.id + "|" + c.w + "x" + c.h + "|" + (p.burned ? 1 : 0) + (hasBack(p) ? 1 : 0);
    if (key === drawnKey) return;
    var samePiece = drawnKey.split("|")[0] === p.id;
    drawnKey = key;
    endSecret();
    if (!samePiece) { arrivalTimers.forEach(clearTimeout); arrivalTimers = []; }
    var wasTurned = samePiece && turned;
    vcard.style.left = c.left + "px"; vcard.style.top = c.top + "px"; vcard.style.width = c.w + "px"; vcard.style.height = c.h + "px";
    view.width = viewBack.width = Math.round(c.w * k); view.height = viewBack.height = Math.round(c.h * k);
    setTurned(wasTurned, true);
    backBase = null;
    try {
      backBase = backOf(p, false);                             // întâi spatele: pentru timbru, fața e deja desenată pe coala ei
      if (!backBase) Seva.render(freshSheet(), S.w, S.h, S.dp, Seva.paramsFromPiece(p, lang));
      sheetInto(view);
      showBack(backBase);
    } catch (e) { if (window.console) console.error(e); }
    if (!backBase && turned) setTurned(false, true);
    viewTurn.hidden = !backBase;
    viewFrom.textContent = p.from ? T.fromWho.replace("%s", p.from) : "";
  }
  onShow.viewer = drawViewer;

  /** Întoarce cartea. Când spatele unui gând top secret ajunge la vedere, începe numărătoarea. */
  function flip() {
    if (!backBase) return;
    setTurned(!turned, false);
    var p = shown[viewAt];
    if (turned) setTimeout(function () { if (turned && shown[viewAt] === p && document.body.getAttribute("data-view") === "viewer") startSecret(p); }, 700);
  }
  viewTurn.addEventListener("click", flip);

  /** Un dar abia sosit: își arată sărbătoarea, dacă are, apoi se întoarce singur pe spate (ViewActivity, „flip”). */
  function arrive(p) {
    if (!p) return;
    if (p.occasion) arrivalTimers.push(setTimeout(function () { festive(p.occasion); }, 350));
    if (hasBack(p)) arrivalTimers.push(setTimeout(function () { if (shown[viewAt] === p && !turned) flip(); }, p.occasion ? 2600 : 900));
  }

  // ---------------------------------------------------------------- gândul top secret: numărătoarea și focul

  /**
   * Spatele unui gând top secret tocmai s-a arătat: în telefon gândul e ars din clipa asta (ieșirea din pagină nu-l salvează),
   * iar cititorul are câteva secunde până ia foc hârtia.
   */
  function startSecret(p) {
    if (!p || !p.secret || !p.note || secret) return;
    var total = Burn.seconds(p.note.length);
    Store.burn(p);
    secret = { p: p, total: total, start: performance.now(), fire: 0, after: null, fl: null, behind: null, glow: null, embers: [], tmp: null };
    // spatele de după și câmpul focului se pregătesc acum, cât se numără, ca hârtia să ia foc fără poticnire
    setTimeout(function () { if (secret && secret.p === p) prepareFire(); }, 60);
    requestAnimationFrame(secretFrame);
  }

  function prepareFire() {
    var s = secret;
    if (!s || s.after) return;
    try {
      s.after = backOf(s.p, true);
      // coala feței a fost folosită pentru timbru: fața de pe ecran nu se atinge
      s.fl = Burn.field(s.p.seed, view.width, view.height, Burn.LIVE_COLS);
      s.behind = Burn.maskCanvas(s.fl); s.glow = Burn.maskCanvas(s.fl);
      s.tmp = mk(view.width, view.height);
    } catch (e) { if (window.console) console.error(e); }
  }

  function secretFrame(now) {
    var s = secret;
    if (!s) return;
    var c = viewBack.getContext("2d"), w = viewBack.width, h = viewBack.height;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, w, h);
    c.drawImage(backBase, 0, 0);
    if (!s.fire) {
      var remaining = s.total - (now - s.start) / 1000;
      if (remaining > 0) {
        // cercul numărătorii, sub ștampilă: se golește până la zero
        var r = w * 0.052, cx = w * 0.135 + r, cy = w * 0.31 + r;
        c.lineCap = "round"; c.lineWidth = r * 0.16;
        c.strokeStyle = "rgba(208,74,58,0.25)"; c.beginPath(); c.arc(cx, cy, r, 0, 6.2832); c.stroke();
        c.strokeStyle = "rgb(208,74,58)"; c.beginPath(); c.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + 6.2832 * Math.min(1, remaining / s.total)); c.stroke();
        c.fillStyle = "rgb(208,74,58)"; c.textAlign = "center"; c.textBaseline = "alphabetic";
        c.font = "bold " + (r * 0.95) + "px Georgia, 'Times New Roman', serif";
        c.fillText(String(Math.ceil(remaining)), cx, cy + r * 0.34);
        requestAnimationFrame(secretFrame);
        return;
      }
      // hârtia ia foc: arsura pornește din câteva puncte și se întinde, iar în urma ei rămâne spatele fără scris
      if (!s.after) prepareFire();
      if (!s.after || !s.fl) { endSecret(); return; }
      s.fire = now;
    }
    var u = Math.min(1, (now - s.fire) / 3400), burnT = 1 - Math.pow(1 - u, 1.8), cur = burnT * (Burn.EXTENT + 0.05);
    Burn.liveMasks(s.fl, cur, s.behind.img.data, s.glow.img.data);
    s.behind.ctx.putImageData(s.behind.img, 0, 0); s.glow.ctx.putImageData(s.glow.img, 0, 0);
    var inset = w * Burn.INSET;
    // în urma focului se vede hârtia de după, fără scris
    var t = s.tmp.getContext("2d");
    t.globalCompositeOperation = "source-over"; t.clearRect(0, 0, w, h);
    t.drawImage(s.after, 0, 0);
    t.globalCompositeOperation = "destination-in"; t.imageSmoothingEnabled = true;
    t.drawImage(s.behind.canvas, 0, 0, w, h);
    c.save();
    c.beginPath(); c.rect(inset, inset, w - 2 * inset, h - 2 * inset); c.clip();
    c.imageSmoothingEnabled = true;
    c.drawImage(s.tmp, 0, 0);
    c.drawImage(s.glow.canvas, 0, 0, w, h);
    // scântei: se desprind de pe muchia focului și urcă, stingându-se
    var d = ratio(), fl = s.fl, i;
    for (i = 0; i < 24 && s.embers.length < 70; i++) {
      var j = Math.floor(Math.random() * fl.arrive.length), x = fl.arrive[j];
      if (x < cur && x > cur - 0.03 && x < Burn.EXTENT) s.embers.push([((j % fl.cols) + 0.5) / fl.cols * w, (Math.floor(j / fl.cols) + 0.5) / fl.rows * h,
        (Math.random() - 0.5) * 1.6 * d, -(1.2 + Math.random() * 2.4) * d, 1, (1 + Math.random() * 1.8) * d]);
    }
    s.embers = s.embers.filter(function (e) { e[0] += e[2]; e[1] += e[3]; e[2] += (Math.random() - 0.5) * 0.3 * d; e[4] -= 0.035; return e[4] > 0; });
    s.embers.forEach(function (e) {
      c.fillStyle = "rgba(255," + Math.min(255, Math.round(0x90 + 0x60 * e[4])) + ",48," + Math.max(0, Math.min(1, e[4])) + ")";
      c.beginPath(); c.arc(e[0], e[1], e[5] * (0.6 + 0.4 * e[4]), 0, 6.2832); c.fill();
    });
    c.restore();
    if (u >= 1) endSecret(); else requestAnimationFrame(secretFrame);
  }

  /**
   * Sfârșitul, oricum ar veni (focul s-a stins, omul a trecut la alt tablou, a ieșit sau dăruiește): gândul nu mai e
   * nici în memorie, iar spatele rămâne cu urma focului.
   */
  function endSecret() {
    var s = secret;
    if (!s) return;
    secret = null;
    forget(s.p.id);
    var after = s.after;
    if (!after && shown[viewAt] === s.p) { try { after = backOf(s.p, true); } catch (e) { } }
    if (after && shown[viewAt] === s.p) { backBase = after; showBack(backBase); drawnKey = drawnKey.replace(/\|[01]{2}$/, "|11"); }
    if (s.tmp) s.tmp.width = 0;
  }

  // ---------------------------------------------------------------- atingerea și răsfoirea

  // o atingere scurtă întoarce cartea; degetul tras în lături duce la tabloul de alături
  var swipe = null;
  viewStage.addEventListener("pointerdown", function (e) { swipe = { id: e.pointerId, x: e.clientX, y: e.clientY }; });
  viewStage.addEventListener("pointerup", function (e) {
    if (!swipe || swipe.id !== e.pointerId) return;
    var dx = e.clientX - swipe.x, dy = e.clientY - swipe.y;
    swipe = null;
    if (Math.abs(dx) < 12 && Math.abs(dy) < 12) { if (e.target === view || e.target === viewBack || e.target === vcard) flip(); return; }
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    var next = viewAt + (dx < 0 ? 1 : -1);
    if (next < 0 || next >= shown.length) return;
    viewAt = next;
    drawnKey = "";
    drawViewer();
  });
  viewStage.addEventListener("pointercancel", function () { swipe = null; });

  $("view-back").addEventListener("click", function () { endSecret(); go("collection"); });
  $("view-delete").addEventListener("click", function () {
    var p = shown[viewAt];
    if (!p) return;
    ask({ text: T.deleteAsk, ok: T.del, cancel: T.cancel }).then(function (yes) {
      if (!yes) return;
      endSecret();
      Store.remove(p.id);
      gone(p);
    });
  });
  /** După ce tabloul de pe ecran a fost șters sau dăruit: rămâi la vecinul lui; colecția se arată doar dacă nu a mai rămas niciunul. */
  function gone(p) {
    forget(p.id);
    // tabloul plecat de pe planșă nu mai e „în colecția ta”: planșa pornește de la capăt
    if (piece && piece.id === p.id && locked) startNew();
    shown = Store.list();
    if (shown.length === 0) { go("collection"); return; }
    viewAt = Math.min(viewAt, shown.length - 1);
    drawnKey = "";
    drawViewer();
  }
  $("view-give").addEventListener("click", function () {
    var p = shown[viewAt];
    if (!p) return;
    endSecret();
    giveAway(p, false, function () { gone(p); });
  });

  // ================================================================ primirea unui dar (MainActivity.receive, Store.add)

  /** Din codul unui link: tabloul intră în colecție și se arată, cu sărbătoarea și spatele lui. */
  function receive(code) {
    var d = Seva.decode(code);
    if (d && d.newer) { toast(T.giftNewer); return; }
    if (!d) { toast(T.giftBad); return; }
    var p = { id: idFor(BigInt(d.seed), d.createdAt, d.author), seed: BigInt(d.seed), createdAt: d.createdAt, author: d.author, aid: d.aid, gen: d.gen,
      nervous: d.nervous, slow: d.slow, light: d.light, battery: d.battery, strokes: d.strokes,
      from: d.from, fromId: d.fromId, giftedAt: null,
      note: d.note, noteBy: d.noteBy, noteAt: d.noteAt, secret: d.secret, burned: d.burned, occasion: d.occasion };
    var added = Store.receive(p);
    if (added === "OWN") { toast(T.giftOwnLink); return; }
    var kept = Store.list().find(function (x) { return x.id === p.id; }) || p;
    var msg = added === "NEW" ? (kept.from ? T.giftReceived : T.giftReceivedMine) : added === "RETURNED" ? (kept.from ? T.giftReturned : T.giftReturnedMine) : T.giftAlready;
    var wish = added !== "ALREADY" && kept.occasion ? T.wish[kept.occasion] + " " : "";
    toast(wish + msg.replace("%s", kept.from || ""));
    forget(kept.id);
    givenTab = false;
    shown = Store.list();
    openViewer(Math.max(0, shown.indexOf(kept)), added !== "ALREADY");
  }

  /** Linkul darului ajunge aici ca #g=COD (din pagina de dar). */
  function takeHash() {
    var m = /^#g=(.+)$/.exec(location.hash || "");
    if (!m) return;
    try { history.replaceState(null, "", location.pathname + location.search); } catch (e) { location.hash = ""; }
    receive(m[1].trim());
  }
  window.addEventListener("hashchange", takeHash);

  // ---------------------------------------------------------------- sărbătoarea unui dar de ocazie (Festive.kt)

  /** Confetti (zi de naștere) sau ninsoare (Crăciun), peste tot ecranul, câteva secunde. Tabloul rămâne neatins: ocazia e ambalajul darului. */
  function festive(kind) {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var cv = document.createElement("canvas");
    cv.id = "fest"; cv.setAttribute("aria-hidden", "true");
    document.body.appendChild(cv);
    var k = Math.min(window.devicePixelRatio || 1, 2), W = window.innerWidth, H = window.innerHeight;
    cv.width = Math.round(W * k); cv.height = Math.round(H * k);
    var c = cv.getContext("2d"); c.scale(k, k);
    var total = kind === 2 ? 8 : 5.2, bits = [], i;
    var cols = ["#E8B84A", "#E8705A", "#4FB3A5", "#9B7BD8", "#F2E6CF", "#6FA8E8", "#E86FA8"];
    if (kind === 2) {
      for (i = 0; i < 150; i++) {
        var big = Math.random() < 0.12;
        bits.push({ x: Math.random() * W, y: Math.random() * H * 1.5 - H * 0.6, vy: big ? 46 : 62 + Math.random() * 70, size: big ? 7 + Math.random() * 5 : 1.4 + Math.random() * 2.6,
          a: big ? 0.88 : 0.56 + Math.random() * 0.38, big: big, turn: Math.random() * 60, spin: (Math.random() - 0.5) * 40, ph: Math.random() * 6.28 });
      }
    } else {
      for (var side = 0; side < 2; side++) for (i = 0; i < 95; i++) {
        var ang = ((side === 0 ? -62 : -118) + (Math.random() - 0.5) * 44) * Math.PI / 180, sp = 760 + Math.random() * 760;
        bits.push({ x: side === 0 ? -8 : W + 8, y: H * 0.86, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, size: 3.2 + Math.random() * 3.6,
          col: cols[Math.floor(Math.random() * cols.length)], kind: Math.floor(Math.random() * 3), turn: Math.random() * 360, spin: (Math.random() - 0.5) * 900, ph: Math.random() * 6.28, delay: Math.random() * 0.22 });
      }
    }
    var t0 = 0, last = 0;
    function frame(now) {
      if (!t0) { t0 = now; last = now; }
      var t = (now - t0) / 1000, dt = Math.min((now - last) / 1000, 0.05); last = now;
      if (t >= total) { cv.remove(); return; }
      var fade = Math.min(t / 0.3, 1) * Math.max(0, Math.min((total - t) / 1.1, 1));
      c.clearRect(0, 0, W, H);
      for (var j = 0; j < bits.length; j++) {
        var b = bits[j];
        if (kind === 2) {
          b.y += b.vy * dt; b.turn += b.spin * dt;
          if (b.y > H + 20) b.y = -20;
          var x = b.x + Math.sin(t * 1.1 + b.ph) * 14;
          c.globalAlpha = b.a * fade;
          if (b.big) {
            c.save(); c.translate(x, b.y); c.rotate(b.turn * Math.PI / 180);
            c.strokeStyle = "#fff"; c.lineWidth = 1.1; c.lineCap = "round"; c.beginPath();
            for (var q = 0; q < 3; q++) {
              c.moveTo(-b.size, 0); c.lineTo(b.size, 0);
              c.moveTo(b.size * 0.6, 0); c.lineTo(b.size * 0.88, -b.size * 0.26); c.moveTo(b.size * 0.6, 0); c.lineTo(b.size * 0.88, b.size * 0.26);
              c.moveTo(-b.size * 0.6, 0); c.lineTo(-b.size * 0.88, -b.size * 0.26); c.moveTo(-b.size * 0.6, 0); c.lineTo(-b.size * 0.88, b.size * 0.26);
              c.rotate(Math.PI / 3);
            }
            c.stroke(); c.restore();
          } else { c.fillStyle = "#fff"; c.beginPath(); c.arc(x, b.y, b.size, 0, 6.2832); c.fill(); }
        } else {
          if (t < b.delay) continue;
          var drag = Math.pow(0.16, dt);
          b.vx *= drag; b.vy = Math.min(b.vy * drag + 1250 * dt, 210);
          b.x += (b.vx + Math.sin(t * 3.2 + b.ph) * 42) * dt; b.y += b.vy * dt; b.turn += b.spin * dt;
          if (b.y > H + 30) continue;
          c.globalAlpha = fade; c.fillStyle = b.col;
          c.save(); c.translate(b.x, b.y); c.rotate(b.turn * Math.PI / 180);
          var flat = 0.25 + 0.75 * Math.abs(Math.cos(t * 6 + b.ph));
          if (b.kind === 0) { c.beginPath(); c.arc(0, 0, b.size * 0.62, 0, 6.2832); c.fill(); }
          else if (b.kind === 1) c.fillRect(-b.size, -b.size * 0.42 * flat, b.size * 2, b.size * 0.84 * flat);
          else c.fillRect(-b.size * 1.5, -b.size * 0.22, b.size * 3, b.size * 0.44);
          c.restore();
        }
      }
      c.globalAlpha = 1;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

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
  } else window.addEventListener("resize", function () { layout(); if (document.body.getAttribute("data-view") === "viewer") drawViewer(); });
  window.addEventListener("orientationchange", function () { setTimeout(layout, 250); });
  paintBuild();
  state();
  layout();

  // la prima deschidere: numele cu care vor fi semnate tablourile. Fără cont, fără verificare.
  // un dar deschis din pagina de dar (#g=COD) intră în colecție după aceea
  if (Store.author() === null) {
    ask({ title: T.nameTitle, text: T.nameMessage, input: T.nameHint, ok: T.nameOk }).then(function (name) { Store.setAuthor(name || ""); takeHash(); });
  } else takeHash();

  // pentru probele din afara telefonului
  window.SevaApp = {
    state: function () {
      return { view: document.body.getAttribute("data-view"), strokes: strokes.length, composed: composed, locked: locked, piece: piece,
        card: card, seed: String(seed), author: Store.author(), kept: Store.list().length, given: Store.given().length, thumbs: Object.keys(thumbs).length,
        tier: Seva.tierOf(seed), revealing: rv ? rv.tier : 0, turned: turned, secret: secret ? (secret.fire ? "arde" : "numara") : null,
        viewing: shown[viewAt] ? { id: shown[viewAt].id, from: shown[viewAt].from, note: shown[viewAt].note, secret: shown[viewAt].secret, burned: shown[viewAt].burned, occasion: shown[viewAt].occasion } : null, ticketsLeft: Rarity.ticketsLeft(), often: Rarity.often() };
    }
  };
})();
