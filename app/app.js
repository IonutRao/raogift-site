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

  var BUILD = "probă 8";
  // limba: cea aleasă în Despre, altfel a telefonului
  var lang = (function () {
    var chosen = null;
    try { chosen = localStorage.getItem("seva.lang"); } catch (e) { }
    return chosen === "ro" || chosen === "en" ? chosen : /^ro\b/i.test(navigator.language || "ro") ? "ro" : "en";
  })();
  /** Un text cu locuri numerotate: {1}, {2}. */
  function fmt(s) { var a = arguments; return s.replace(/\{(\d)\}/g, function (m, k) { return String(a[+k]); }); }
  var T = {
    ro: {
      hintPaper: "Desenează cu degetul\nuna sau mai multe forme.\nCât și unde desenezi contează.",
      hintMore: "Mai poți adăuga forme, sau apasă Compune.",
      hintComposed: "Același gest poate da și alt tablou.",
      compose: "Compune", clear: "Reia", keep: "Păstrează", another: "Alt tablou", again: "Gest nou",
      backToBoard: "Înapoi la planșă", tier0: "Tablou simplu", choiceKept: "%s. E în colecția ta.",
      tiers: [null, "Piesă rară", "Piesă de colecție", "Seva de aur"], rareFound: "Un tablou rar și-a găsit rama.", goldSub: "cel mai rar dintre tablouri",
      often: "rare des",
      toCollection: "În colecție", kept: "Adăugată în colecție", choiceLoose: "%s. Păstrezi tabloul sau îl dăruiești?", choiceFull: "%s. Azi mai poți doar să dăruiești.",
      leftToday: "Azi mai poți păstra: %d.", giftedLeft: "A plecat în dar. Azi mai poți dărui pe loc: %d.",
      limitTitle: "Atât pe azi", limitFree: "Azi ai păstrat cinci tablouri și ai dăruit pe loc alte cinci. Mâine poți din nou; de încercat poți încerca în continuare oricât.",
      fullTitle: "Colecția de azi e plină", fullText: "Azi ai păstrat deja cinci tablouri. Pe acesta îl poți dărui.", fullDrop: "Renunț la tablou",
      collectorLater: "Abonamentul de colecționar, cu care păstrezi și dăruiești fără limită, va veni odată cu aplicația Seva pentru iPhone.",
      about: "Despre",
      aboutTitle: "Despre Seva",
      aboutTagline: "O carte poștală vie.",
      aboutShortTag: "PE SCURT",
      aboutHowTitle: "Cum funcționează",
      aboutStep1: "Desenezi cu degetul una sau mai multe forme.",
      aboutStep2: "Apeși Compune și din gest crește un tablou unic. Nu-ți place? Alt tablou.",
      aboutStep3: "Îl păstrezi în colecție sau îl dăruiești printr-un link.",
      aboutGestureTitle: "Gestul",
      aboutGestureShort: "Gestul nu e copiat: din direcția, întinderea și temperamentul lui crește tabloul. Același gest poate da și alt tablou.",
      aboutWhat: "O carte poștală vie. Desenezi cu degetul una sau mai multe forme, iar din ele se naște un tablou unic. Nicio imagine nu se repetă, pentru că niciun gest și niciun moment nu se repetă.",
      aboutGesture: "Gestul tău nu se desenează așa cum l-ai făcut: e redus la direcție, întindere și temperament, și din el crește o compoziție într-una din șase familii: ramuri, bule, panglici, constelație, mozaic sau cuburi, uneori două împreună. Cât de mult și unde desenezi hotărăște mărimea, locul și bogăția ei. Culorile le alege telefonul, de oriunde din cercul culorilor: de cele mai multe ori în armonie, uneori în pastel, în neon, într-o singură cerneală sau, rar, urâte cu intenție. Tabloul e semnat cu numele tău și cu momentul în care l-ai făcut.",
      aboutGiftTitle: "Daruri",
      aboutGiftB1: "Tabloul pleacă într-un plic închis, printr-un link.",
      aboutGiftB2: "Pe spate poți scrie un gând, o singură dată.",
      aboutGiftB3: "Top secret: se citește o dată, apoi arde.",
      aboutGiftB4: "De ocazie: zi de naștere sau Crăciun, cu plic de sărbătoare.",
      aboutGift: "Un tablou poate fi dăruit: pleacă din colecția ta și rămâne doar amintirea lui. Pleacă într-un plic închis, în culorile lui, ca să rămână o surpriză; cine îl primește îl deschide în Seva și îl adaugă în colecția lui, cu numele tău pe el. Când îl dăruiești poți scrie un gând pe spate: tabloul se întoarce cu o atingere. Gândul poate fi marcat top secret; ce se întâmplă atunci afli când primești unul. Poți spune și că darul e pentru o zi de naștere sau, în preajma sărbătorilor, pentru Crăciun: atunci ajunge într-un plic de sărbătoare, se deschide cu sărbătoarea lui și își poartă ștampila pe spate. Un tablou primit poate fi dăruit mai departe. Primirea și dăruirea sunt mereu gratuite.",
      aboutRarityTitle: "Tablouri rare",
      aboutRarityB1: "Raritatea se află abia când apeși Păstrează.",
      aboutRarityB2: "Zece șanse pe zi, la fel pentru toți.",
      aboutRarityB3: "Primele zece tablouri îți aduc câte una din fiecare treaptă.",
      aboutRarity: "Când apeși Păstrează, unele tablouri se dovedesc rare și își primesc rama și semnul: Piesă rară, cu ramă de lemn în culorile tabloului (20 din 100), Piesă de colecție, cu ramă de lemn sculptat (6 din 100), și Seva de aur, cu ramă aurită (2 din 100). Norocul se încearcă de cel mult zece ori pe zi, la fel pentru toți: primele zece tablouri păstrate sau dăruite pe loc într-o zi pot fi rare, următoarele sunt simple până a doua zi. Primele zece tablouri pe care le păstrezi îți aduc câte unul din fiecare treaptă, ca să le cunoști. Raritatea ține de tablou: nu poate fi aleasă, iar un tablou dăruit pleacă cu ea cu tot.",
      aboutOdds: "{1} din 100",
      aboutLuck: "Șanse la un tablou rar rămase azi: {1} din {2}.",
      aboutStatusFree: "Azi mai poți păstra {1} și dărui pe loc {2}.",
      aboutRuleTitle: "Regula păstrării",
      aboutMore: "Mai mult",
      aboutLess: "Mai puțin",
      aboutSettings: "SETĂRI",
      aboutTrust: "ÎNCREDERE",
      aboutTasteShort: "Seva învață din ce păstrezi și îți propune mai des tablouri pe gustul tău.",
      tasteTitle: "Preferințele tale",
      tasteIntro: "Seva învață, doar din tablourile pe care le păstrezi, ce fel de tablouri îți plac, și înclină încet compozițiile noi în direcția lor, fără să renunțe la surprize. Preferințele stau în telefonul tău și nu le vede nimeni.",
      tasteYoung: "Încă nu se vede nimic: {1} tablouri păstrate. După cinci începe să conteze.",
      tasteEven: "Din {1} tablouri păstrate, preferințele tale sunt încă echilibrate: îți plac de toate.",
      tasteLikes: "Din {1} tablouri păstrate, se vede că îți plac: {2}.",
      tasteDark: "paletele întunecate",
      tasteLight: "paletele luminoase",
      tasteWarm: "culorile calde",
      tasteCool: "culorile reci",
      tastePair: "compozițiile din două familii",
      tasteSolo: "compozițiile dintr-o singură familie",
      tasteReset: "Uită preferințele",
      tasteResetAsk: "Preferințele învățate până acum se șterg și Seva pornește din nou de la zero. Colecția rămâne neatinsă.",
      signTitle: "Semnătura",
      signChange: "Schimbă",
      signNow: "Te semnezi: {1}",
      signNone: "Tablourile tale nu poartă încă un nume.",
      signNote: "Numele nou apare pe tablourile de acum încolo. Cele de până acum își păstrează semnătura cu care s-au născut.",
      exportCollection: "Exportă colecția",
      importCollection: "Importă colecția",
      exportSubject: "Colecția mea Seva",
      exportFailed: "Nu am putut pregăti fișierul.",
      importDone: "Au intrat {1} tablouri noi în colecție.",
      importBad: "Fișierul nu pare o colecție Seva.",
      aboutPrivacyTitle: "Confidențialitate",
      aboutPolicyLink: "Politica de confidențialitate",
      aboutContact: "Contact:",
      aboutHowNote: "Fără cont, fără permisiuni.",
      aboutRule: "Poți încerca oricâte imagini vrei, gratuit, mereu. Păstrezi cinci tablouri pe zi: alegerea e ceea ce face colecția a ta. Alte cinci pe zi le poți dărui pe loc, imediat după Păstrează, fără să ocupe un loc în colecție. Primirea și dăruirea din colecție sunt mereu libere. Tablourile sunt la fel de frumoase pentru toți.",
      aboutMoveTitle: "Colecția la adăpost",
      aboutMoveShort: "Aici colecția stă în memoria browserului, nu într-un cont. Exportă din când în când o copie, ca fișier.",
      aboutMove: "Colecția e un fișier mic de text (parametri, nu imagini). Aici ea stă în memoria browserului de pe acest telefon, iar browserul o poate șterge dacă pagina nu mai e deschisă o vreme. Adaugă pagina pe ecranul principal și exportă din când în când colecția: fișierul poate fi importat oricând înapoi, aici sau în aplicația Seva de pe alt telefon. Importul adaugă doar ce lipsește.",
      aboutPrivacy: "Pagina nu cere nicio permisiune și nu are cont. Numele tău, colecția și preferințele învățate stau în memoria browserului, pe telefonul tău, și nu pleacă nicăieri. Colecția nu păstrează imagini, ci parametrii din care fiecare tablou renaște identic.",
      aboutVersion: "Varianta din browser",
      fam: ["ramurile", "bulele", "panglicile", "constelațiile", "mozaicurile", "cuburile"],
      reg: ["", "culorile neon", "pastelurile", "tablourile într-o singură cerneală", "culorile care se ceartă"],
      medalsTab: "Medalii",
      medalsIntro: "Medaliile se câștigă dăruind. Fiecare tablou plecat din colecția ta se numără.",
      medalNew: "Medalie nouă",
      medalAt: "la {1}",
      medalSince: "primită pe {1}",
      medalAll: "Ai toate medaliile de aici.",
      medalLadders: ["Daruri", "Top secret", "Aur"],
      medalNames: [["Primul plic", "Poștaș de ocazie", "Curier de artă", "Mână largă", "Darnic de meserie", "Furnizor oficial de bucurii", "Legenda poștei", "Ministrul bucuriei"], ["Confident", "Complice", "Agent secret", "Agent dublu", "Maestru al deghizării", "Șeful spionilor", "Eminența cenușie", "Secret de stat"], ["Inimă de aur", "Mină de aur", "Izvor de aur", "Epoca de aur"]],
      medalNext: [{"one": "Încă un dar până la „{2}”.", "few": "Încă {1} daruri până la „{2}”.", "other": "Încă {1} de daruri până la „{2}”."}, {"one": "Încă un dar secret până la „{2}”.", "few": "Încă {1} daruri secrete până la „{2}”.", "other": "Încă {1} de daruri secrete până la „{2}”."}, {"one": "Încă o Seva de aur dăruită până la „{2}”.", "few": "Încă {1} Seva de aur dăruite până la „{2}”.", "other": "Încă {1} Seva de aur dăruite până la „{2}”."}],
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
      toCollection: "To collection", kept: "Added to your collection", choiceLoose: "%s. Keep the piece or give it away?", choiceFull: "%s. Today you can only give it away.",
      leftToday: "You can still keep today: %d.", giftedLeft: "Gift sent. You can still give on the spot today: %d.",
      limitTitle: "That's all for today", limitFree: "Today you kept five pieces and gave five more away on the spot. Tomorrow you can again; you can go on trying as many images as you like.",
      fullTitle: "Today's collection is full", fullText: "You have already kept five pieces today. You can give this one away.", fullDrop: "Let it go",
      collectorLater: "The collector subscription, which lets you keep and give without limit, will come with the Seva app for iPhone.",
      about: "About",
      aboutTitle: "About Seva",
      aboutTagline: "A living postcard.",
      aboutShortTag: "IN SHORT",
      aboutHowTitle: "How it works",
      aboutStep1: "You draw one or more shapes with your finger.",
      aboutStep2: "You tap Compose and a unique piece grows from the gesture. Not for you? Another piece.",
      aboutStep3: "You keep it in your collection or give it away through a link.",
      aboutGestureTitle: "The gesture",
      aboutGestureShort: "The gesture is not copied: the piece grows from its direction, reach and temperament. The same gesture can give another piece.",
      aboutWhat: "A living postcard. You draw one or more shapes with your finger, and a unique piece grows from them. No image ever repeats, because no gesture and no moment ever repeats.",
      aboutGesture: "Your gesture is not drawn as you made it: it is reduced to direction, span and temperament, and from it a composition grows in one of six families: branches, bubbles, ribbons, constellation, mosaic or cubes, sometimes two together. How much and where you draw decides its size, place and richness. The phone picks the colors, from anywhere on the color wheel: most often in harmony, sometimes in pastel, in neon, in a single ink or, rarely, ugly on purpose. The piece is signed with your name and the moment you made it.",
      aboutGiftTitle: "Gifts",
      aboutGiftB1: "The piece leaves in a sealed envelope, through a link.",
      aboutGiftB2: "You can write a thought on the back, once.",
      aboutGiftB3: "Top secret: it is read once, then it burns.",
      aboutGiftB4: "For an occasion: a birthday or Christmas, in a festive envelope.",
      aboutGift: "A piece can be given: it leaves your collection and only its memory remains. It travels in a sealed envelope, in its own colors, so it stays a surprise; whoever receives it opens it in Seva and adds it to their collection, with your name on it. When you give it you can write a thought on the back: the piece turns over with a tap. The thought can be marked top secret; what happens then, you find out when you receive one. You can also say the gift is for a birthday or, around the holidays, for Christmas: it then arrives in a festive envelope, opens with its own celebration and carries its postmark on the back. A received piece can be given onward. Receiving and giving are always free.",
      aboutRarityTitle: "Rare pieces",
      aboutRarityB1: "Rarity shows only when you tap Keep.",
      aboutRarityB2: "Ten chances a day, the same for everyone.",
      aboutRarityB3: "Your first ten pieces bring you one of each tier.",
      aboutRarity: "When you tap Keep, some pieces turn out to be rare and receive their frame and mark: Rare piece, in a wooden frame in the colours of the picture (20 in 100), Collector's piece, in a carved wooden frame (6 in 100), and Golden Seva, in a gilded frame (2 in 100). Luck is tried at most ten times a day, the same for everyone: the first ten pieces you keep or give on the spot in a day can be rare, the following ones are plain until the next day. The first ten pieces you keep bring you one of each, so you get to know them. Rarity belongs to the piece: it cannot be chosen, and a gifted piece leaves with it.",
      aboutOdds: "{1} in 100",
      aboutLuck: "Chances at a rare piece left today: {1} of {2}.",
      aboutStatusFree: "Today you can still keep {1} and give {2} on the spot.",
      aboutRuleTitle: "The keeping rule",
      aboutMore: "More",
      aboutLess: "Less",
      aboutSettings: "SETTINGS",
      aboutTrust: "TRUST",
      aboutTasteShort: "Seva learns from what you keep and offers pieces to your taste more often.",
      tasteTitle: "What you like",
      tasteIntro: "Seva learns, only from the pieces you keep, what kind of pieces you like, and slowly leans new compositions their way without giving up surprises. What it learns stays on your phone and nobody sees it.",
      tasteYoung: "Nothing to see yet: {1} pieces kept. It starts to matter after five.",
      tasteEven: "From {1} pieces kept, what you like is still even: a bit of everything.",
      tasteLikes: "From {1} pieces kept, it shows that you like: {2}.",
      tasteDark: "dark palettes",
      tasteLight: "light palettes",
      tasteWarm: "warm colors",
      tasteCool: "cool colors",
      tastePair: "compositions of two families",
      tasteSolo: "compositions of a single family",
      tasteReset: "Forget what I like",
      tasteResetAsk: "What Seva has learned so far is erased and it starts again from scratch. Your collection is untouched.",
      signTitle: "Signature",
      signChange: "Change",
      signNow: "You sign as: {1}",
      signNone: "Your pieces do not carry a name yet.",
      signNote: "The new name appears on the pieces you make from now on. Earlier pieces keep the signature they were born with.",
      exportCollection: "Export collection",
      importCollection: "Import collection",
      exportSubject: "My Seva collection",
      exportFailed: "Could not prepare the file.",
      importDone: "{1} new pieces joined your collection.",
      importBad: "This file does not look like a Seva collection.",
      aboutPrivacyTitle: "Privacy",
      aboutPolicyLink: "Privacy policy",
      aboutContact: "Contact:",
      aboutHowNote: "No account, no permissions.",
      aboutRule: "You can try as many images as you like, free, always. You keep five pieces a day: choosing is what makes the collection yours. Five more a day can be given on the spot, right after Keep, without taking a place in the collection. Receiving and giving from the collection are always free. The pieces are just as beautiful for everyone.",
      aboutMoveTitle: "Keeping your collection safe",
      aboutMoveShort: "Here your collection lives in the browser's memory, not in an account. Export a copy now and then, as a file.",
      aboutMove: "The collection is a small text file (parameters, not images). Here it lives in this phone's browser memory, and the browser may clear it if the page is not opened for a while. Add the page to your Home Screen and export the collection now and then: the file can be imported back at any time, here or in the Seva app on another phone. Import only adds what is missing.",
      aboutPrivacy: "This page asks for no permission and has no account. Your name, your collection and the learned preferences stay in the browser's memory, on your phone, and go nowhere. The collection keeps no images, only the parameters from which each piece is reborn identically.",
      aboutVersion: "Browser version",
      fam: ["branches", "bubbles", "ribbons", "constellations", "mosaics", "cubes"],
      reg: ["", "neon colors", "pastels", "single-ink pieces", "colors that clash"],
      medalsTab: "Medals",
      medalsIntro: "Medals are earned by giving. Every piece that leaves your collection counts.",
      medalNew: "New medal",
      medalAt: "at {1}",
      medalSince: "earned on {1}",
      medalAll: "You have every medal here.",
      medalLadders: ["Gifts", "Top secret", "Gold"],
      medalNames: [["First envelope", "Part-time postman", "Art courier", "Open hand", "Generous by trade", "Official supplier of joy", "Legend of the post", "Minister of joy"], ["Confidant", "Accomplice", "Secret agent", "Double agent", "Master of disguise", "Spymaster", "Grey eminence", "State secret"], ["Heart of gold", "Gold mine", "Golden spring", "Golden age"]],
      medalNext: [{"one": "One more gift to reach \"{2}\".", "other": "{1} more gifts to reach \"{2}\"."}, {"one": "One more secret gift to reach \"{2}\".", "other": "{1} more secret gifts to reach \"{2}\"."}, {"one": "One more gifted Golden Seva to reach \"{2}\".", "other": "{1} more gifted Golden Seva to reach \"{2}\"."}],
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
      /** Tabloul dezvăluit care își așteaptă darul (colecția zilei era plină): ținut minte, ca o ieșire din pagină să nu-l piardă. */
      pending: function () { try { var s = get("seva.pending"); return s ? unpack(JSON.parse(s)) : null; } catch (e) { return null; } },
      setPending: function (p) { set("seva.pending", p ? JSON.stringify(pack(p)) : ""); },
      /** Toate tablourile, păstrate și dăruite (pentru export). */
      all: function () { return load().slice(); },
      setAuthorId: function (id) { set("seva.aid", String(id)); },
      /** Importul: adaugă ce lipsește; nu dublează, nu șterge nimic. Întoarce câte tablouri au intrat (Store.importJson). */
      addMissing: function (list) {
        load();
        var n = 0;
        list.forEach(function (p) { if (pieces.some(function (x) { return x.id === p.id; })) return; pieces.push(p); n++; });
        pieces.sort(function (a, b) { return b.createdAt - a.createdAt; });
        save();
        return n;
      },
      remove: function (id) { load(); pieces = pieces.filter(function (x) { return x.id !== id; }); save(); }
    };
  })();

  // ================================================================ preferințele (Taste.kt)
  //
  // Se învață doar din tablourile păstrate: fiecare Păstrează apropie puțin preferințele de trăsăturile tabloului (familie,
  // registru de culoare, fundal întunecat sau luminos, cald sau rece, cu sau fără a doua familie). Stau pe telefon.
  // La fiecare tablou nou se încearcă în tăcere câteva semințe și se ia cea mai apropiată de preferințe, cu o parte de
  // explorare, ca să nu se închidă. Tabloul rămâne unul obișnuit, cu sămânța și gestul lui; oricine îl reface identic.

  var Taste = (function () {
    var f = Math.fround;
    var RATE = f(0.15), EXPLORE = f(0.3), WARMUP = 5;
    var NOVICE = 10;      // primele tablouri ale unui om nou nu vin din registrul brut
    var FAMILIES = 5, DARK = 5, WARM = 6, PAIR = 7, CUBES = 9, REGISTER = 10, SIZE = REGISTER + Seva.REGISTERS;
    var SHARE = [0.52, 0.15, 0.15, 0.12, 0.06];     // Palettes.REGISTER_SHARE: cât apare fiecare registru de la sine
    function neutral(i) { return i < FAMILIES || i === CUBES ? f(1 / 6) : i >= REGISTER ? f(SHARE[i - REGISTER]) : 0.5; }
    function int(k) { return parseInt(Store.get("seva." + k) || "0", 10) || 0; }
    function load() {
      var out = [], i;
      for (i = 0; i < SIZE; i++) out.push(neutral(i));
      var s = Store.get("seva.taste");
      if (s) {
        var parts = s.split(",");
        for (i = 0; i < Math.min(SIZE, parts.length); i++) { var v = parseFloat(parts[i]); if (isFinite(v)) out[i] = f(Math.max(0, Math.min(1, v))); }
      }
      return out;
    }
    function count() { return int("taste_n"); }
    function save(t, n) { Store.set("seva.taste", t.map(function (v) { return v.toFixed(4); }).join(",")); Store.set("seva.taste_n", String(n)); }
    /** Cât de departe e un tablou de preferințe; mai mic e mai aproape. */
    function distance(t, fe) { var d = 0; for (var i = 0; i < SIZE; i++) d = f(d + Math.abs(f(fe[i] - t[i]))); return d; }
    /** Trăsăturile hârtiei goale a unei semințe: gestul încă nu există, lumina și bateria nu se știu aici. */
    function ofSeed(seed) { return Seva.features(Seva.paramsFromCase({ strokes: [], nervous: 0, slow: 0, light: 255, battery: 255, seed: seed, gen: Seva.GEN })); }
    return {
      WARMUP: WARMUP,
      load: load, count: count,
      reset: function () { Store.set("seva.taste", ""); Store.set("seva.taste_n", "0"); },
      /** La Păstrează: preferințele se apropie puțin de tabloul păstrat. */
      learn: function (piece) {
        var fe = Seva.features(Seva.paramsFromPiece(piece, lang)), t = load();
        for (var i = 0; i < SIZE; i++) t[i] = f(t[i] + f(f(fe[i] - t[i]) * RATE));
        save(t, count() + 1);
      },
      /**
       * Alege sămânța unui tablou nou: dintre câteva candidate, cea mai apropiată de preferințe, cu explorare.
       * Până se adună câteva tablouri păstrate, preferințele sunt neutre și sămânța e cea a momentului.
       */
      chooseSeed: function (now) {
        var composedN = int("composed_n");
        Store.set("seva.composed_n", String(composedN + 1));
        var novice = composedN < NOVICE, brut = REGISTER + Seva.BRUT, i;
        var candidate = function (k) { return now + BigInt(k) * 7919n; };
        var n = count(), rnd = new Seva.Random(now);
        if (n < WARMUP || rnd.nextFloat() < EXPLORE) {
          // fără preferințe: sămânța momentului; pentru un om nou, prima care nu e din registrul brut
          if (!novice) return now;
          for (i = 0; i < 8; i++) if (ofSeed(candidate(i))[brut] < 0.5) return candidate(i);
          return now;
        }
        var t = load(), best = now, bestD = Infinity;
        for (i = 0; i < 8; i++) {
          var fe = ofSeed(candidate(i));
          if (novice && fe[brut] > 0.5) continue;
          var d = distance(t, fe);
          if (d < bestD) { bestD = d; best = candidate(i); }
        }
        return best;
      },
      /** Ce a învățat, în cuvinte. */
      describe: function () {
        var n = count();
        if (n < WARMUP) return fmt(T.tasteYoung, n);
        var t = load(), parts = [], i;
        // familia: cea mai iubită, dacă iese vizibil din rând
        var fam = 0, famIdx = [0, 1, 2, 3, 4, CUBES];
        famIdx.forEach(function (k) { if (t[k] > t[fam]) fam = k; });
        if (t[fam] > f(0.30)) parts.push(T.fam[fam === CUBES ? 5 : fam]);
        // registrul: cel care a crescut cel mai mult peste cât apare de la sine
        var reg = 0, over = function (k) { return f(t[REGISTER + k] - f(SHARE[k])); };
        for (i = 1; i < Seva.REGISTERS; i++) if (over(i) > over(reg)) reg = i;
        if (reg !== Seva.ARMONIE && over(reg) > f(0.12)) parts.push(T.reg[reg]);
        if (t[DARK] > f(0.62)) parts.push(T.tasteDark); else if (t[DARK] < f(0.38)) parts.push(T.tasteLight);
        if (t[WARM] > f(0.62)) parts.push(T.tasteWarm); else if (t[WARM] < f(0.38)) parts.push(T.tasteCool);
        if (t[PAIR] > f(0.6)) parts.push(T.tastePair); else if (t[PAIR] < f(0.25)) parts.push(T.tasteSolo);
        return parts.length === 0 ? fmt(T.tasteEven, n) : fmt(T.tasteLikes, n, parts.join(", "));
      }
    };
  })();

  // ================================================================ regula păstrării (Plan.kt)
  //
  // Încerci oricât; păstrezi cinci tablouri pe zi. Pe lângă ele, cinci pe zi pot fi dăruite pe loc, de pe planșă, fără să
  // ocupe un loc din cele cinci păstrate. Primirea și dăruirea din colecție sunt mereu libere. În pagina din browser nu
  // există abonament: colecționarii vin odată cu aplicația din App Store, unde plata se face prin Apple.

  var Plan = (function () {
    var FREE_PER_DAY = 5, FREE_GIFTS_PER_DAY = 5;
    function today() { var d = new Date(), two = function (x) { return String(x).padStart(2, "0"); }; return "" + d.getFullYear() + two(d.getMonth() + 1) + two(d.getDate()); }
    function count(what) { return Store.get("seva." + what + "_day") === today() ? (parseInt(Store.get("seva." + what + "_count") || "0", 10) || 0) : 0; }
    function put(what, n) { Store.set("seva." + what + "_day", today()); Store.set("seva." + what + "_count", String(n)); }
    return {
      FREE_PER_DAY: FREE_PER_DAY, FREE_GIFTS_PER_DAY: FREE_GIFTS_PER_DAY,
      keptToday: function () { return count("kept"); },
      leftToday: function () { return Math.max(0, FREE_PER_DAY - count("kept")); },
      canKeep: function () { return FREE_PER_DAY - count("kept") > 0; },
      recordKeep: function () { put("kept", count("kept") + 1); },
      /** Un tablou păstrat și apoi dăruit pe loc își dă locul înapoi: nu a rămas în colecție. */
      refundKeep: function () { var n = count("kept"); if (n > 0) put("kept", n - 1); },
      giftedToday: function () { return count("gifted"); },
      giftsLeftToday: function () { return Math.max(0, FREE_GIFTS_PER_DAY - count("gifted")); },
      canGiftNow: function () { return FREE_GIFTS_PER_DAY - count("gifted") > 0; },
      recordGift: function () { put("gifted", count("gifted") + 1); }
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
      mInput.hidden = !o.input; mInput.value = o.value || ""; mInput.placeholder = o.input || "";
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
        Medals.later();
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

  var strokes = [];            // formele desenate: { points: [{x, y}], times: [ms] }, în coordonatele cărții
  var current = null;          // forma care se desenează acum
  var pointer = null;          // degetul care desenează; celelalte nu contează
  var composed = false;
  var locked = false;          // după Păstrează, planșa stă pe loc până la „Înapoi la planșă”
  var loose = false;           // colecția zilei era plină la Păstrează: tabloul nu a intrat în colecție și poate doar pleca în dar
  var piece = null;            // tabloul compus acum
  var lastStamp;
  var seed = newSeed();
  var ink = 0xFFFFFFFF | 0;    // cerneala potrivită hârtiei
  var card = { left: 0, top: 0, w: 0, h: 0 };   // cartea, în puncte de ecran
  var dpr = 1;
  var paper = null;            // cartea desenată: hârtia goală sau tabloul
  var queued = false;

  /** Sămânța momentului, înclinată de preferințe, cu treapta pe care o poartă (ascunsă până la Păstrează). */
  function newSeed() {
    var s = BigInt(Date.now());
    if (typeof lastStamp !== "undefined" && s <= lastStamp) s = lastStamp + 1n;
    lastStamp = s;
    return Rarity.pick(Taste.chooseSeed(s));
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
    // un tablou păstrat e deja în colecție: se spune limpede. Doar când colecția zilei era plină mai e ceva de hotărât.
    var full = locked && loose && !Plan.canKeep();
    btn.backBoard.textContent = locked && loose ? T.toCollection : T.backToBoard;
    btn.backBoard.classList.toggle("dim", full);
    var choice = full ? T.choiceFull : loose ? T.choiceLoose : T.choiceKept;
    hint.textContent = rv ? T.rareFound : locked ? choice.replace("%s", T.tiers[tier] || T.tier0) : composed ? T.hintComposed : (n === 0 ? "\u00a0" : T.hintMore);
    hint.classList.toggle("none", n === 0 && !composed);
  }

  function startNew() {
    composed = false; locked = false; piece = null; loose = false;
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
    var canKeep = Plan.canKeep();
    if (!canKeep && !Plan.canGiftNow()) {
      ask({ title: T.limitTitle, text: T.limitFree + "\n\n" + T.collectorLater, ok: T.back });
      return;
    }
    // raritatea se află abia acum. Cât mai e loc în colecția zilei, tabloul intră în ea înainte de orice efect, ca nimic
    // să nu-l poată pierde; dacă apoi e dăruit pe loc, își dă locul înapoi. Când colecția zilei e plină, ia un loc dintre daruri.
    var tier = Seva.tierOf(piece.seed);
    if (canKeep) { Store.add(piece); Plan.recordKeep(); }
    else { Plan.recordGift(); Store.setPending(piece); }
    loose = !canKeep;
    Taste.learn(piece);
    Rarity.onKeep(tier);
    if (tier === 0) { locked = true; state(); repaint(); }
    else reveal(tier, T.tiers[tier], tier === 3 ? T.goldSub : "", function () { state(); invalidate(); });
  });
  /** Alegerea s-a încheiat: planșa e din nou goală. */
  function done() { Store.setPending(null); startNew(); }
  /** Un tablou păstrat la Păstrează mai e la locul lui? (între timp putea fi șters sau dăruit din colecție) */
  function stillKept(p) { return Store.list().some(function (x) { return x.id === p.id; }); }
  btn.backBoard.addEventListener("click", function () {  // „Înapoi la planșă”, sau „În colecție” când colecția zilei era plină
    var p = piece;
    if (!p || !locked || rv) return;
    if (!loose) {
      // tabloul e de la Păstrează în colecție; omul află câte mai poate păstra azi
      if (stillKept(p)) toast(T.leftToday.replace("%d", Plan.leftToday()));
      done();
    } else if (Plan.canKeep()) {
      // între timp s-a făcut loc (o zi nouă)
      Store.add(p); Plan.recordKeep();
      toast(T.kept);
      done();
    } else {
      ask({ title: T.fullTitle, text: T.fullText + "\n\n" + T.collectorLater, ok: T.back, cancel: T.fullDrop }).then(function (v) { if (v === null) done(); });
    }
  });
  btn.give.addEventListener("click", function () {      // darul de pe planșă, imediat după ce tabloul și-a arătat treapta
    var p = piece;
    if (!p || !locked || rv) return;
    var wasLoose = loose;
    if (!wasLoose && !stillKept(p)) { done(); return; }
    giveAway(p, true, function () {
      // darul de pe planșă nu ocupă un loc din colecția zilei, cât timp mai sunt daruri pe azi
      if (!wasLoose && Plan.canGiftNow()) { Plan.refundKeep(); Plan.recordGift(); }
      toast(T.giftedLeft.replace("%d", Plan.giftsLeftToday()));
      forget(p.id); done();
    });
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
  var tabKept = $("tab-kept"), tabGiven = $("tab-given"), tabMedals = $("tab-medals"), medalsBox = $("medals"), givenTab = false, medalsTab = false;
  tabKept.textContent = T.collection; tabGiven.textContent = T.givenTab; tabMedals.textContent = T.medalsTab;
  tabKept.addEventListener("click", function () { givenTab = false; medalsTab = false; onShow.collection(); });
  tabGiven.addEventListener("click", function () { givenTab = true; medalsTab = false; onShow.collection(); });
  tabMedals.addEventListener("click", function () { givenTab = false; medalsTab = true; onShow.collection(); });
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
    tabKept.classList.toggle("on", !given && !medalsTab); tabGiven.classList.toggle("on", given); tabMedals.classList.toggle("on", medalsTab);
    colEmpty.textContent = given ? T.givenEmpty : T.collectionEmpty;
    colEmpty.hidden = list.length > 0 || medalsTab;
    grid.textContent = "";
    grid.hidden = medalsTab; medalsBox.hidden = !medalsTab;
    jobs = [];
    if (watcher) watcher.disconnect();
    Medals.later();
    if (medalsTab) { gridWrap.scrollTop = 0; Medals.build(medalsBox); return; }
    medalsBox.textContent = "";
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
  $("col-back").addEventListener("click", function () { givenTab = false; medalsTab = false; go("board"); });

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

  // ================================================================ Despre (AboutActivity.kt)
  //
  // Aceleași rubrici ca în aplicația de Android: cum funcționează, gestul, darurile, tablourile rare, regula păstrării,
  // apoi setările și încrederea. În pagina din browser nu există abonament (colecționarii vin odată cu aplicația din
  // App Store), nici sunete deocamdată; textele spun doar ce e adevărat aici.

  var aboutBox = $("about"), aboutStatus = null, aboutSign = null, aboutTaste = null;
  $("to-about").textContent = T.about;
  $("to-about").addEventListener("click", function () { go("about"); });

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined && text !== null) e.textContent = text;
    return e;
  }
  /** Semnul unei rubrici: un cerc în culoarea ei, cu un desen mic înăuntru (Emblem din aplicație). */
  var MARKS = {
    gesture: '<path d="M27 64 Q38 18 50 50 Q62 82 74 36" fill="none" stroke="currentColor" stroke-width="7.5" stroke-linecap="round"/>',
    gift: '<path d="M26 34 H74 V68 H26 Z M26 35 L50 54 L74 35" fill="none" stroke="currentColor" stroke-width="6" stroke-linejoin="round"/>',
    diamond: '<path d="M50 25 L72 50 L50 75 L28 50 Z" fill="currentColor"/>',
    leaf: '<path d="M50 22 Q84 46 50 78 Q16 46 50 22 Z" fill="currentColor"/>',
    flower: '<circle cx="50" cy="34" r="10.5" fill="currentColor"/><circle cx="65.2" cy="45.1" r="10.5" fill="currentColor"/><circle cx="59.4" cy="62.9" r="10.5" fill="currentColor"/>' +
      '<circle cx="40.6" cy="62.9" r="10.5" fill="currentColor"/><circle cx="34.8" cy="45.1" r="10.5" fill="currentColor"/><circle cx="50" cy="50" r="6" fill="#1C1B22"/>',
    drop: '<path d="M50 20 Q78 56 67 64 Q50 86 33 64 Q22 56 50 20 Z" fill="currentColor"/>'
  };
  function emblem(kind, tint) {
    var e = el("span", "emblem");
    e.style.color = tint;
    e.innerHTML = '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="50" fill="currentColor" opacity=".22"/>' + MARKS[kind] + "</svg>";
    return e;
  }
  /** Un carton: key = scos în evidență, quiet = șters (setări), gold = rubrica tablourilor rare. */
  function carton(kind) { return el("div", "card" + (kind ? " " + kind : "")); }
  function head(title, mark, tag) {
    var h = el("div", "head");
    if (mark) h.appendChild(mark);
    h.appendChild(el("h3", null, title));
    if (tag) h.appendChild(el("span", "tag", tag));
    return h;
  }
  /** Explicația întreagă a rubricii, strânsă sub „Mai mult”. */
  function more(box, full) {
    var body = el("p", "full", full), toggle = el("button", "more", T.aboutMore);
    toggle.type = "button"; body.hidden = true;
    toggle.addEventListener("click", function () { body.hidden = !body.hidden; toggle.textContent = body.hidden ? T.aboutMore : T.aboutLess; });
    box.appendChild(toggle); box.appendChild(body);
  }
  function chip(label, on) { var b = el("button", "chip" + (on ? " on" : ""), label); b.type = "button"; return b; }

  // ---- mutarea colecției: același fișier .seva ca în aplicația de Android (Store.exportJson, Store.importJson)

  var f32 = Math.fround;
  /** Un tablou, cum îl scrie aplicația de Android (Piece.toJson): temperamentul ca fracții, semințele și semnele ca numere întregi. */
  function toAndroid(p) {
    var o = { id: p.id, seed: String(p.seed), createdAt: p.createdAt, author: p.author || "" };
    var noted = !!(p.note && p.note.trim());
    if (p.from) o.from = p.from;
    if (p.giftedAt) o.giftedAt = p.giftedAt;
    if (p.aid && p.aid !== "0") o.aid = String(p.aid);
    if (p.fromId && p.fromId !== "0") o.fid = String(p.fromId);
    if (noted) o.note = p.note;
    if (noted || p.burned || p.occasion) { o.noteBy = p.noteBy || ""; o.noteAt = p.noteAt || 0; }
    if (p.occasion) o.occasion = p.occasion;
    if (p.secret) o.secret = true;
    if (p.burned) o.burned = true;
    if (p.gen) o.gen = p.gen;
    o.nervous = f32(p.nervous / 255); o.slow = f32(p.slow / 255);
    if (p.light !== 255) o.light = f32(p.light / 254);
    if (p.battery !== 255) o.battery = f32(p.battery / 254);
    o.strokes = p.strokes.map(function (s) { var flat = []; s.forEach(function (q) { flat.push(q[0], q[1]); }); return flat; });
    return o;
  }
  /** Un tablou din fișier (Piece.fromJson), adus la forma din pagină: aceiași întregi care ar fi călătorit printr-un link. */
  function fromAndroid(j) {
    if (!j || typeof j.id !== "string" || j.seed === undefined || typeof j.createdAt !== "number" || !Array.isArray(j.strokes)) throw new Error("tablou stricat");
    var grid = function (v) { return Math.floor(f32(f32(Math.max(0, Math.min(1, v))) * 65535) + 0.5); };
    var steps = function (v, n) { return Math.max(0, Math.min(n, Math.trunc(f32(f32(v) * n)))); };
    var sense = function (v) { return typeof v !== "number" || v < 0 ? 255 : steps(v, 254); };
    var strokes = j.strokes.map(function (a) {
      var s = [];
      // versiunile vechi de test păstrau fracții; cele noi, întregi pe grila 0..65535
      for (var i = 0; i + 1 < a.length; i += 2) s.push(a[i] <= 1 && a[i + 1] <= 1 ? [grid(a[i]), grid(a[i + 1])] : [Math.round(a[i]), Math.round(a[i + 1])]);
      return s;
    });
    return { id: j.id, seed: BigInt(j.seed), createdAt: j.createdAt, author: typeof j.author === "string" ? j.author : "",
      aid: j.aid === undefined ? "0" : String(j.aid), gen: j.gen | 0,
      nervous: steps(typeof j.nervous === "number" ? j.nervous : 0.3, 255), slow: steps(typeof j.slow === "number" ? j.slow : 0.5, 255),
      light: sense(j.light), battery: sense(j.battery), strokes: strokes,
      from: typeof j.from === "string" ? j.from : null, fromId: j.fid === undefined ? "0" : String(j.fid), giftedAt: j.giftedAt || null,
      note: typeof j.note === "string" ? j.note : null, noteBy: typeof j.noteBy === "string" ? j.noteBy : null, noteAt: j.noteAt || 0,
      secret: !!j.secret, burned: !!j.burned, occasion: j.occasion | 0 };
  }
  var BIG = "seed|aid|fid|authorId";     // numere de 64 de biți: în fișier stau ca numere, în pagină ca text
  function exportText() {
    var aliases = {};
    try { aliases = JSON.parse(Store.get("seva.aliases") || "{}") || {}; } catch (e) { aliases = {}; }
    var int = function (k) { return parseInt(Store.get("seva." + k) || "0", 10) || 0; };
    var o = { seva: 2, author: Store.author() || "", authorId: Store.authorId(), pieces: Store.all().map(toAndroid), aliases: aliases,
      rarity: { n: int("rare_n"), g1: Store.get("seva.rare_got1") === "1", g2: Store.get("seva.rare_got2") === "1", g3: Store.get("seva.rare_got3") === "1", gd: int("rare_gd") } };
    return JSON.stringify(o).replace(new RegExp('"(' + BIG + ')":"(-?\\d+)"', "g"), '"$1":$2');
  }
  /** Adaugă din fișier ce lipsește; nu dublează, nu șterge nimic. Întoarce câte tablouri au intrat, sau -1 dacă fișierul nu e o colecție. */
  function importText(text) {
    var o, list;
    try {
      o = JSON.parse(String(text).replace(new RegExp('"(' + BIG + ')":\\s*(-?\\d+)', "g"), '"$1":"$2"'));
      if (!o || !Array.isArray(o.pieces)) return -1;
      list = o.pieces.map(fromAndroid);
    } catch (e) { return -1; }
    var n = Store.addMissing(list);
    Medals.resync();
    // darul de bun venit și treptele deja primite vin și ele (Rarity.importJson)
    var r = o.rarity, int = function (k) { return parseInt(Store.get("seva." + k) || "0", 10) || 0; };
    if (r && typeof r === "object") {
      Store.set("seva.rare_n", String(Math.max(int("rare_n"), r.n | 0)));
      for (var tier = 1; tier <= 3; tier++) if (r["g" + tier] === true) Store.set("seva.rare_got" + tier, "1");
      Store.set("seva.rare_gd", String(Math.max(int("rare_gd"), r.gd | 0)));
    }
    // numele date folderelor în aplicația de Android se țin minte, ca un export de aici să le ducă mai departe
    if (o.aliases && typeof o.aliases === "object") {
      var have = {};
      try { have = JSON.parse(Store.get("seva.aliases") || "{}") || {}; } catch (e) { have = {}; }
      Object.keys(o.aliases).forEach(function (k) { if (!(k in have)) have[k] = String(o.aliases[k]); });
      Store.set("seva.aliases", JSON.stringify(have));
    }
    // exportul aduce și numele și semnul; dacă e același om (nume lipsă sau identic), semnul vechi îl înlocuiește pe cel nou
    var name = typeof o.author === "string" ? o.author : "", mine = (Store.author() || "").trim();
    if ((mine === "" || mine.toLowerCase() === name.trim().toLowerCase()) && name.trim() !== "") {
      if (mine === "") Store.setAuthor(name);
      if (o.authorId !== undefined && String(o.authorId) !== "0") Store.setAuthorId(String(o.authorId));
    }
    return n;
  }
  /** Exportul: un fișier .seva (text), dat mai departe prin fereastra de partajare a telefonului sau descărcat. */
  function exportCollection() {
    try {
      var d = new Date(), two = function (x) { return String(x).padStart(2, "0"); };
      var name = "colectie-seva-" + d.getFullYear() + two(d.getMonth() + 1) + two(d.getDate()) + "-" + two(d.getHours()) + two(d.getMinutes()) + ".seva";
      var text = exportText();
      if (window.SevaTestExport) { window.SevaTestExport(name, text); return; }
      var download = function () {
        var a = document.createElement("a"), url = URL.createObjectURL(new Blob([text], { type: "application/octet-stream" }));
        a.href = url; a.download = name; a.style.display = "none";
        document.body.appendChild(a); a.click();
        setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 4000);
      };
      var file = null;
      try { file = new File([text], name, { type: "application/octet-stream" }); } catch (e) { file = null; }
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: T.exportSubject }).catch(function (e) { if (!e || e.name !== "AbortError") download(); });
      } else download();
    } catch (e) { toast(T.exportFailed); if (window.console) console.error(e); }
  }
  function importFile(file) {
    if (!file) return;
    var r = new FileReader();
    r.onload = function () {
      var n = importText(r.result);
      toast(n < 0 ? T.importBad : fmt(T.importDone, n));
      if (n >= 0) paintAbout();
    };
    r.onerror = function () { toast(T.importBad); };
    r.readAsText(file);
  }

  // ---- pagina

  function paintSign() {
    var name = (Store.author() || "").trim();
    aboutSign.textContent = name === "" ? T.signNone : fmt(T.signNow, name);
  }
  /** Ce se schimbă de la o deschidere la alta: câte mai poți păstra azi, semnătura, preferințele. */
  function paintAbout() {
    if (!aboutStatus) return;
    aboutStatus.textContent = fmt(T.aboutStatusFree, Plan.leftToday(), Plan.giftsLeftToday()) + "\n" + fmt(T.aboutLuck, Rarity.ticketsLeft(), Rarity.TICKETS);
    paintSign();
    aboutTaste.textContent = Taste.describe();
    paintBuild();
  }
  function buildAbout() {
    var back = el("button", "pill flow", T.back), c, row, i;
    back.type = "button";
    back.addEventListener("click", function () { go("board"); });
    aboutBox.appendChild(back);
    aboutBox.appendChild(el("h1", null, T.aboutTitle));
    aboutBox.appendChild(el("p", "tagline", T.aboutTagline));

    // limba: două pastile
    row = el("div", "chips");
    [["ro", "Română"], ["en", "English"]].forEach(function (l) {
      var b = chip(l[1], l[0] === lang);
      b.addEventListener("click", function () { if (l[0] === lang) return; Store.set("seva.lang", l[0]); location.reload(); });
      row.appendChild(b);
    });
    aboutBox.appendChild(row);

    // 1. pe scurt
    c = carton("key");
    c.appendChild(head(T.aboutHowTitle, null, T.aboutShortTag));
    [T.aboutStep1, T.aboutStep2, T.aboutStep3].forEach(function (text, k) {
      var s = el("div", "step"); s.appendChild(el("span", "num", String(k + 1))); s.appendChild(el("p", null, text)); c.appendChild(s);
    });
    c.appendChild(el("p", "note", T.aboutHowNote));
    aboutBox.appendChild(c);

    // 2. gestul
    c = carton();
    c.appendChild(head(T.aboutGestureTitle, emblem("gesture", "#6FB8AC"), null));
    c.appendChild(el("p", null, T.aboutGestureShort));
    more(c, T.aboutWhat + "\n\n" + T.aboutGesture);
    aboutBox.appendChild(c);

    // 3. darurile
    c = carton();
    c.appendChild(head(T.aboutGiftTitle, emblem("gift", "#E08A7A"), null));
    [T.aboutGiftB1, T.aboutGiftB2, T.aboutGiftB3, T.aboutGiftB4].forEach(function (text) { c.appendChild(el("p", "bullet rose", text)); });
    more(c, T.aboutGift);
    aboutBox.appendChild(c);

    // 4. tablourile rare: cele trei trepte, fiecare cu semnul și șansa ei
    c = carton("gold");
    c.appendChild(head(T.aboutRarityTitle, emblem("diamond", "#E2AE45"), null));
    [["leaf", "#8FCB9B", 20], ["flower", "#A592DC", 6], ["drop", "#E2AE45", 2]].forEach(function (t, k) {
      var r = el("div", "tier" + (k === 2 ? " golden" : ""));
      r.appendChild(emblem(t[0], t[1])); r.appendChild(el("span", "name", T.tiers[k + 1])); r.appendChild(el("span", "odds", fmt(T.aboutOdds, t[2])));
      c.appendChild(r);
    });
    [T.aboutRarityB1, T.aboutRarityB2, T.aboutRarityB3].forEach(function (text) { c.appendChild(el("p", "bullet gold", text)); });
    more(c, T.aboutRarity);
    aboutBox.appendChild(c);

    // 5. regula păstrării: ce se poate azi. Fără abonament aici.
    c = carton("key");
    c.appendChild(head(T.aboutRuleTitle, null, null));
    aboutStatus = el("p", "status");
    c.appendChild(aboutStatus);
    more(c, T.aboutRule + "\n\n" + T.collectorLater);
    aboutBox.appendChild(c);

    // setările: mai șterse, sub ce contează
    aboutBox.appendChild(el("p", "group", T.aboutSettings));

    // semnătura: numele de pe tablourile noi; cele de până acum o păstrează pe cea cu care s-au născut
    c = carton("quiet");
    row = el("div", "head");
    row.appendChild(el("h3", "small", T.signTitle));
    var change = chip(T.signChange, false);
    change.addEventListener("click", function () {
      ask({ title: T.nameTitle, input: T.nameHint, value: Store.author() || "", ok: T.nameOk, cancel: T.cancel }).then(function (v) {
        if (v === null || v === true) return;
        Store.setAuthor(v); paintSign();
      });
    });
    row.appendChild(change);
    c.appendChild(row);
    aboutSign = el("p");
    c.appendChild(aboutSign);
    c.appendChild(el("p", "note", T.signNote));
    aboutBox.appendChild(c);

    // preferințele
    c = carton("quiet");
    c.appendChild(el("h3", "small", T.tasteTitle));
    c.appendChild(el("p", null, T.aboutTasteShort));
    aboutTaste = el("p", "note");
    c.appendChild(aboutTaste);
    var forget = el("button", "link", T.tasteReset);
    forget.type = "button";
    forget.addEventListener("click", function () {
      ask({ text: T.tasteResetAsk, ok: T.tasteReset, cancel: T.cancel }).then(function (v) { if (v === null) return; Taste.reset(); aboutTaste.textContent = Taste.describe(); });
    });
    c.appendChild(forget);
    more(c, T.tasteIntro);
    aboutBox.appendChild(c);

    // colecția la adăpost: export și import
    c = carton("quiet");
    c.appendChild(el("h3", "small", T.aboutMoveTitle));
    c.appendChild(el("p", null, T.aboutMoveShort));
    row = el("div", "chips");
    var exp = chip(T.exportCollection, true);
    exp.addEventListener("click", exportCollection);
    row.appendChild(exp);
    // importul: un câmp de fișier adevărat, sub eticheta lui, ca telefonul să deschidă alegerea fișierului la atingere
    var imp = el("label", "chip", T.importCollection), input = document.createElement("input");
    input.type = "file"; input.id = "import-file"; input.className = "file";
    input.addEventListener("change", function () { importFile(input.files && input.files[0]); input.value = ""; });
    imp.appendChild(input);
    row.appendChild(imp);
    c.appendChild(row);
    more(c, T.aboutMove);
    aboutBox.appendChild(c);

    // încrederea
    aboutBox.appendChild(el("p", "group", T.aboutTrust));
    c = carton("quiet");
    c.appendChild(el("h3", "small", T.aboutPrivacyTitle));
    c.appendChild(el("p", null, T.aboutPrivacy));
    aboutBox.appendChild(c);
    var policy = el("a", "link", T.aboutPolicyLink);
    policy.href = "https://sevarao.com/politica.html"; policy.target = "_blank"; policy.rel = "noopener";
    aboutBox.appendChild(policy);
    aboutBox.appendChild(el("p", "note foot", T.aboutContact + " ionutrao@gmail.com"));
    // doar în pagina de probă: atingerea acestui rând face tablourile rare să apară des
    var build = el("p", "note foot dim");
    build.id = "build";
    aboutBox.appendChild(build);
    build.addEventListener("click", function () {
      Rarity.setOften(!Rarity.often());
      paintBuild();
      if (!composed && !locked && strokes.length === 0 && !current) { seed = newSeed(); repaint(); }
    });
  }
  function paintBuild() { var b = $("build"); if (b) b.textContent = T.aboutVersion + " · " + BUILD + (Rarity.often() ? " · " + T.often : ""); }
  buildAbout();
  onShow.about = function () { aboutBox.scrollTop = 0; paintAbout(); };

  // ================================================================ medaliile pentru dăruit (Medals.kt)
  //
  // Trei scări de sigilii de ceară: Daruri (toate tablourile plecate din colecție), Top secret (darurile cu gând secret)
  // și Aur (câte Seva de aur au fost dăruite). Sunt doar distincții. Nimic nu se ține separat: medaliile se socotesc din
  // urmele darurilor, iar data unei medalii e data darului care a trecut pragul. Se ține minte doar care au fost sărbătorite.

  var Medals = (function () {
    var GIFTS = 0, SECRET = 1, GOLD = 2;
    var STEPS = [[1, 5, 15, 30, 60, 120, 250, 500], [1, 4, 10, 25, 50, 100, 200, 400], [1, 3, 7, 12]], LETTER = ["g", "s", "a"];
    var all = [];
    STEPS.forEach(function (steps, ladder) {
      steps.forEach(function (threshold, k) { all.push({ id: LETTER[ladder] + (k + 1), ladder: ladder, step: k + 1, threshold: threshold, name: T.medalNames[ladder][k] }); });
    });
    var WAX = [
      [0xA63A2B, 0x8E2F3A, 0x9A6A3A, 0xB5814A, 0x98A0AC, 0xC3CAD4, 0xD4A93C, 0xE9C65E],
      [0x2E2D34, 0x2E2D34, 0x2E2D34, 0x2E2D34, 0x2E2D34, 0x2E2D34, 0x2E2D34, 0x2E2D34],
      [0xB8923E, 0xC9A247, 0xDDB650, 0xEFCB62]
    ];
    // pe scara secretă ceara rămâne neagră, iar semnul urcă de la cenușiu, prin bronz, argint și roșu de tuș, până la aur
    var SECRET_MARK = [0x8A90A3, 0xA9AFBD, 0xB5814A, 0xC5CCD6, 0xC4483A, 0xC9A85A, 0xF1DC96, 0xFFF8E0];
    var ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
    var SERIF = "Georgia, 'Times New Roman', serif";

    function mix(a, b, t) {
      var ch = function (x, y) { return Math.max(0, Math.min(255, Math.trunc(x + (y - x) * t))); };
      return (ch((a >> 16) & 255, (b >> 16) & 255) << 16) | (ch((a >> 8) & 255, (b >> 8) & 255) << 8) | ch(a & 255, b & 255);
    }
    function col(rgb, a) { return "rgba(" + ((rgb >> 16) & 255) + "," + ((rgb >> 8) & 255) + "," + (rgb & 255) + "," + (a === undefined ? 1 : a) + ")"; }
    function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0; return h; }

    /** Momentele darurilor, în ordinea în care au plecat, pe fiecare scară. */
    function times(pieces) {
      var given = pieces.filter(function (p) { return !!p.giftedAt; }).sort(function (a, b) { return a.giftedAt - b.giftedAt; });
      var at = function (p) { return p.giftedAt; };
      return [given.map(at), given.filter(function (p) { return p.secret && p.note != null; }).map(at),
        given.filter(function (p) { return p.gen >= 4 && Seva.tierOf(p.seed) === 3; }).map(at)];
    }
    /** Când a fost câștigată medalia (darul care a trecut pragul), sau null dacă încă nu. */
    function earnedAt(m, t) { var v = t[m.ladder][m.threshold - 1]; return v === undefined ? null : v; }
    function seen() { try { return JSON.parse(Store.get("seva.medals_seen") || "[]") || []; } catch (e) { return []; } }
    /** Medaliile câștigate și încă nesărbătorite; le și trece ca sărbătorite. Prima oară, cele deja meritate se trec în tăcere. */
    function fresh() {
      var t = times(Store.all()), earned = all.filter(function (m) { return earnedAt(m, t) !== null; }), have = seen();
      var add = function (list) { list.forEach(function (m) { if (have.indexOf(m.id) < 0) have.push(m.id); }); Store.set("seva.medals_seen", JSON.stringify(have)); };
      if (Store.get("seva.medals_init") !== "1") { Store.set("seva.medals_init", "1"); add(earned); return []; }
      var now = earned.filter(function (m) { return have.indexOf(m.id) < 0; });
      if (now.length) add(now);
      return now;
    }

    /**
     * Un sigiliu de ceară: margine ușor neregulată, mijlocul apăsat, cu semnul scării (plic, gaura cheii, picătură)
     * și treapta în cifre romane. Necâștigat, e doar o urmă cenușie.
     */
    function drawSeal(c, cx, cy, r, m, earned) {
      var wax = earned ? WAX[m.ladder][m.step - 1] : 0x2B2A31;
      var bright = ((wax >> 16) & 255) * 0.299 + ((wax >> 8) & 255) * 0.587 + (wax & 255) * 0.114 > 140;
      var mark = !earned ? 0x4A4850 : m.ladder === SECRET ? SECRET_MARK[m.step - 1] : bright ? mix(wax, 0x000000, 0.62) : mix(wax, 0xFFFFFF, 0.72);
      var k, a, TAU = 6.2832;
      // marginea: ceara curge puțin altfel la fiecare sigiliu
      var phase = (hash(m.id) & 0xFF) / 255 * 6.28;
      var blob = function () {
        c.beginPath();
        for (k = 0; k <= 72; k++) {
          a = k / 72 * TAU;
          var rr = r * (1 + 0.035 * Math.sin(a * 5 + phase) + 0.022 * Math.sin(a * 9 + phase * 2.3));
          if (k === 0) c.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); else c.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
        }
        c.closePath();
      };
      if (earned) { c.save(); c.translate(r * 0.05, r * 0.08); blob(); c.fillStyle = "rgba(0,0,0,0.333)"; c.fill(); c.restore(); }
      blob(); c.fillStyle = col(wax); c.fill();
      // la treptele de sus (aurul de la a treia, vârfurile celorlalte scări), perle mici de jur împrejur
      var top = m.ladder === GOLD && m.step >= 3 || m.ladder !== GOLD && m.step === 8;
      if (earned && top) {
        c.fillStyle = col(m.ladder === SECRET ? mark : mix(wax, 0xFFFFFF, 0.4));
        var n = m.ladder === GOLD && m.step === 4 ? 24 : 16;
        for (k = 0; k < n; k++) { a = k / n * TAU; c.beginPath(); c.arc(cx + Math.cos(a) * r * 0.88, cy + Math.sin(a) * r * 0.88, r * 0.035, 0, TAU); c.fill(); }
      }
      // mijlocul apăsat
      c.fillStyle = earned ? col(mix(wax, 0x000000, 0.14)) : "#26252B";
      c.beginPath(); c.arc(cx, cy, r * 0.76, 0, TAU); c.fill();
      c.lineWidth = Math.max(1, r * 0.035); c.strokeStyle = col(mark, earned ? 0xB0 / 255 : 1);
      c.beginPath(); c.arc(cx, cy, r * 0.76, 0, TAU); c.stroke();
      if (earned && (m.ladder === GOLD && m.step >= 2 || m.step >= 7)) {
        // un al doilea cerc, fin, la sigiliile de preț
        c.lineWidth = Math.max(1, r * 0.018);
        c.beginPath(); c.arc(cx, cy, r * 0.68, 0, TAU); c.stroke();
      }
      // semnul scării
      c.lineCap = "round"; c.lineJoin = "round";
      c.strokeStyle = col(mark); c.fillStyle = col(mark);
      var sy = cy - r * 0.1;
      if (m.ladder === GIFTS) {
        c.lineWidth = Math.max(1, r * 0.055);
        c.strokeRect(cx - r * 0.34, sy - r * 0.22, r * 0.68, r * 0.44);
        c.beginPath(); c.moveTo(cx - r * 0.34, sy - r * 0.22); c.lineTo(cx, sy + r * 0.04); c.lineTo(cx + r * 0.34, sy - r * 0.22); c.stroke();
      } else if (m.ladder === SECRET) {
        c.beginPath(); c.arc(cx, sy - r * 0.1, r * 0.15, 0, TAU); c.fill();
        c.beginPath(); c.moveTo(cx - r * 0.07, sy - r * 0.02); c.lineTo(cx + r * 0.07, sy - r * 0.02);
        c.lineTo(cx + r * 0.14, sy + r * 0.26); c.lineTo(cx - r * 0.14, sy + r * 0.26); c.closePath(); c.fill();
      } else {
        c.beginPath(); c.moveTo(cx, sy - r * 0.36);
        c.quadraticCurveTo(cx + r * 0.06, sy - r * 0.08, cx + r * 0.2, sy + r * 0.1);
        c.lineTo(cx - r * 0.2, sy + r * 0.1);
        c.quadraticCurveTo(cx - r * 0.06, sy - r * 0.08, cx, sy - r * 0.36);
        c.closePath(); c.fill();
        c.beginPath(); c.arc(cx, sy + r * 0.11, r * 0.2, 0, TAU); c.fill();
      }
      // treapta
      c.font = (r * 0.24) + "px " + SERIF; c.textAlign = "center"; c.textBaseline = "alphabetic";
      c.fillStyle = col(mark, earned ? 0xE0 / 255 : 1);
      c.fillText(ROMAN[m.step - 1], cx, cy + r * 0.56);
      // o dâră de lumină pe ceară
      if (earned) {
        c.lineWidth = r * 0.05; c.strokeStyle = "rgba(255,255,255,0.235)";
        c.beginPath(); c.arc(cx, cy, r * 0.86, 198 * Math.PI / 180, 250 * Math.PI / 180); c.stroke();
      }
    }

    // ---- sigiliul mare: se apasă pe ecran (la câștigare) sau doar stă, cu numele și data lui. O atingere trece mai departe.

    var box = $("stamp"), cv = $("stamp-seal"), label = $("stamp-label"), nameEl = $("stamp-name"), line = $("stamp-line");
    var open = null;
    function ladderTitle(l) { return T.medalLadders[l]; }
    function begin() {
      var m = open.list[open.index];
      open.start = performance.now(); open.felt = false;
      var W = window.innerWidth, H = window.innerHeight, d = ratio();
      cv.width = Math.round(W * d); cv.height = Math.round(H * d);
      open.W = W; open.H = H; open.cx = W / 2; open.cy = H * 0.42; open.r = Math.min(W, H) * 0.21;
      label.textContent = (open.stamp ? T.medalNew : T.medalsTab).toUpperCase();
      nameEl.textContent = m.name;
      var text = ladderTitle(m.ladder) + " · " + m.threshold, at = earnedAt(m, open.times);
      if (!open.stamp && at !== null) {
        var day;
        try { day = new Intl.DateTimeFormat(lang, { day: "numeric", month: "long", year: "numeric" }).format(new Date(at)); } catch (e) { day = new Date(at).toLocaleDateString(); }
        text += "\n" + fmt(T.medalSince, day);
      }
      line.textContent = text;
      label.style.top = (open.cy - open.r * 1.62 - 13) + "px";
      nameEl.style.top = (open.cy + open.r * 1.72 - 27) + "px";
      line.style.top = (open.cy + open.r * 1.72 + 16) + "px";
      // numele încape pe un rând: dacă e prea lat, literele se micșorează
      var size = 30;
      nameEl.style.fontSize = size + "px";
      while (nameEl.scrollWidth > W * 0.86 && size > 16) { size *= 0.94; nameEl.style.fontSize = size + "px"; }
      frame();
    }
    function next() {
      if (!open) return;
      if (open.index < open.list.length - 1) { open.index++; begin(); }
      else { open = null; box.hidden = true; cv.width = 0; }
    }
    function frame() {
      if (!open) return;
      var m = open.list[open.index], t = open.stamp ? (performance.now() - open.start) / 1000 : 10;
      var c = cv.getContext("2d"), d = cv.width / open.W, cx = open.cx, cy = open.cy, r = open.r;
      c.setTransform(d, 0, 0, d, 0, 0);
      c.clearRect(0, 0, open.W, open.H);
      // sigiliul coboară repede, lovește hârtia și se așază
      var k = Math.max(0, Math.min(1, t / 0.22)), fall = k * k;
      var scale = t < 0.22 ? 2.4 - 1.4 * fall : 0.93 + 0.07 * Math.max(0, Math.min(1, (t - 0.22) / 0.2));
      c.save();
      c.translate(cx, cy); c.rotate((-6 - (1 - fall) * 12) * Math.PI / 180); c.scale(scale, scale); c.translate(-cx, -cy);
      drawSeal(c, cx, cy, r, m, true);
      c.restore();
      if (open.stamp && t >= 0.22 && !open.felt) { open.felt = true; try { if (navigator.vibrate) navigator.vibrate(18); } catch (e) { } }
      // unda loviturii
      if (open.stamp && t > 0.22 && t < 0.85) {
        var w = (t - 0.22) / 0.63;
        c.lineWidth = 2.2; c.strokeStyle = "rgba(242,230,207," + (0xA0 / 255 * (1 - w)) + ")";
        c.beginPath(); c.arc(cx, cy, r * (1.05 + 1.25 * w), 0, 6.2832); c.stroke();
      }
      // cuvintele: apar după lovitură
      var a = open.stamp ? Math.max(0, Math.min(1, (t - 0.45) / 0.4)) : 1;
      label.style.opacity = nameEl.style.opacity = line.style.opacity = String(a);
      if (!open.stamp) return;
      if (t >= 4.2) next(); else requestAnimationFrame(frame);
    }
    function show(list, stamp) {
      if (!list.length || open) return;
      open = { list: list, index: 0, stamp: stamp, times: times(Store.all()) };
      box.hidden = false;
      begin();
    }
    box.addEventListener("click", function () { if (open && (!open.stamp || performance.now() - open.start > 700)) next(); });

    function plural(forms, n) {
      if (n === 1) return forms.one;
      if (lang === "ro" && forms.few && (n === 0 || (n % 100 >= 1 && n % 100 <= 19))) return forms.few;
      return forms.other;
    }

    return {
      all: all, times: times, earnedAt: earnedAt,
      opened: function () { return open ? open.list[open.index].id : null; },
      /** După un import, medaliile deja meritate se trec fără ceremonie, ca la prima pornire. */
      resync: function () { Store.set("seva.medals_init", "0"); },
      /** De chemat când planșa sau colecția revin în față: dacă s-a câștigat o medalie, sigiliul ei se apasă pe ecran. */
      celebrate: function () {
        var view = document.body.getAttribute("data-view");
        if (open || !modal.hidden || rv || (view !== "board" && view !== "collection")) return;
        var list = fresh();
        if (list.length) show(list, true);
      },
      /** După un dar: fereastra de partajare se închide întâi, apoi vine sigiliul. */
      later: function () { setTimeout(function () { Medals.celebrate(); }, 450); },
      /** Fila Medalii: cele trei scări de sigilii, cu numele lor; cele necâștigate, cenușii, cu pragul; sub fiecare, cât mai e până la următoarea. */
      build: function (into) {
        var t = times(Store.all()), d = ratio();
        into.textContent = "";
        into.appendChild(el("p", "intro", T.medalsIntro));
        [GIFTS, SECRET, GOLD].forEach(function (l) {
          var ladder = all.filter(function (m) { return m.ladder === l; }), count = t[l].length;
          into.appendChild(el("h3", null, ladderTitle(l) + " · " + count));
          var row = el("div", "seals");
          ladder.forEach(function (m) {
            var earned = earnedAt(m, t) !== null, cell = el("div", "seal" + (earned ? " earned" : "")), icon = document.createElement("canvas");
            icon.width = icon.height = Math.round(66 * d);
            var c = icon.getContext("2d");
            c.setTransform(d, 0, 0, d, 0, 0);
            drawSeal(c, 33, 33, 66 * 0.44, m, earned);
            cell.appendChild(icon);
            cell.appendChild(el("p", "name", m.name));
            if (!earned) cell.appendChild(el("p", "at", fmt(T.medalAt, m.threshold)));
            else { cell.setAttribute("role", "button"); cell.addEventListener("click", function () { show([m], false); }); }
            row.appendChild(cell);
          });
          into.appendChild(row);
          var nextOne = ladder.filter(function (m) { return earnedAt(m, t) === null; })[0];
          into.appendChild(el("p", "next", nextOne ? fmt(plural(T.medalNext[l], nextOne.threshold - count), nextOne.threshold - count, nextOne.name) : T.medalAll));
        });
      }
    };
  })();

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
  // un tablou dezvăluit care își aștepta darul când pagina a fost închisă: alegerea se reia de unde a rămas
  (function () {
    var p = Store.pending();
    if (!p) return;
    piece = p; seed = p.seed; strokes = []; composed = true; locked = true; loose = true;
  })();
  state();
  layout();
  // la întoarcerea pe planșă sau în pagină (poate într-o zi nouă): „În colecție” se aprinde, dacă între timp s-a făcut loc
  onShow.board = function () { if (!rv) state(); Medals.later(); };
  document.addEventListener("visibilitychange", function () { if (!document.hidden && !rv) state(); if (!document.hidden) Medals.later(); });

  // la prima deschidere: numele cu care vor fi semnate tablourile. Fără cont, fără verificare.
  // un dar deschis din pagina de dar (#g=COD) intră în colecție după aceea
  if (Store.author() === null) {
    ask({ title: T.nameTitle, text: T.nameMessage, input: T.nameHint, ok: T.nameOk }).then(function (name) { Store.setAuthor(name || ""); takeHash(); Medals.celebrate(); });
  } else { takeHash(); Medals.celebrate(); }

  // pentru probele din afara telefonului
  window.SevaApp = {
    chooseSeed: function (now) { return String(Taste.chooseSeed(BigInt(now))); },
    featuresOf: function (seed) { return Seva.features(Seva.paramsFromCase({ strokes: [], nervous: 0, slow: 0, light: 255, battery: 255, seed: seed, gen: Seva.GEN })); },
    state: function () {
      return { view: document.body.getAttribute("data-view"), strokes: strokes.length, composed: composed, locked: locked, piece: piece,
        card: card, seed: String(seed), author: Store.author(), kept: Store.list().length, given: Store.given().length, thumbs: Object.keys(thumbs).length,
        medal: Medals.opened(), medalsSeen: Store.get("seva.medals_seen"), lang: lang, taste: Taste.load(), tasteN: Taste.count(), tasteSays: Taste.describe(), loose: loose, keptToday: Plan.keptToday(), giftedToday: Plan.giftedToday(), pending: !!Store.pending(),
        tier: Seva.tierOf(seed), revealing: rv ? rv.tier : 0, turned: turned, secret: secret ? (secret.fire ? "arde" : "numara") : null,
        viewing: shown[viewAt] ? { id: shown[viewAt].id, from: shown[viewAt].from, note: shown[viewAt].note, secret: shown[viewAt].secret, burned: shown[viewAt].burned, occasion: shown[viewAt].occasion } : null, ticketsLeft: Rarity.ticketsLeft(), often: Rarity.often() };
    }
  };
})();
