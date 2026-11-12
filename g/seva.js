/*
 * Seva pentru browser: compozitorul din aplicația de Android, rescris ca să deseneze același tablou din același cod.
 *
 * Regula de aur: fiecare decizie trebuie să iasă exact ca în aplicație. De aceea:
 *  - numerele la întâmplare vin din același generator (XorWow, cel din kotlin.random.Random);
 *  - aritmetica e ținută pe 32 de biți, ca în Kotlin (Float): fiecare operație trece prin Math.fround;
 *  - culorile trec prin aceleași conversii HSV ca în Android (Skia).
 * Sursa de adevăr rămâne aplicația: Composer.kt și Palettes.kt. Orice schimbare acolo se face și aici,
 * iar tablourile de referință din Actions (ReferenceTest) arată dacă cele două mai spun același lucru.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Seva = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const f = Math.fround;
  const F = (x) => Math.fround(x);          // o constantă Float din Kotlin: 0.3f se scrie F(0.3)
  const trunc = Math.trunc;

  // ------------------------------------------------------------------ generatorul de numere (kotlin.random.XorWowRandom)

  class Random {
    /** seed: BigInt sau număr întreg; ca Random(seed: Long) din Kotlin. */
    constructor(seed) {
      const s = BigInt.asIntN(64, BigInt(seed));
      const seed1 = Number(BigInt.asIntN(32, s));
      const seed2 = Number(BigInt.asIntN(32, s >> 32n));
      this.x = seed1 | 0; this.y = seed2 | 0; this.z = 0; this.w = 0;
      this.v = ~seed1 | 0;
      this.addend = ((seed1 << 10) ^ (seed2 >>> 4)) | 0;
      for (let i = 0; i < 64; i++) this.nextInt();
    }
    nextInt() {
      let t = this.x;
      t = t ^ (t >>> 2);
      this.x = this.y; this.y = this.z; this.z = this.w;
      const v0 = this.v;
      this.w = v0;
      t = (t ^ (t << 1)) ^ v0 ^ (v0 << 4);
      this.v = t | 0;
      this.addend = (this.addend + 362437) | 0;
      return (t + this.addend) | 0;
    }
    nextBits(bitCount) { return bitCount === 0 ? 0 : this.nextInt() >>> (32 - bitCount); }
    /** nextInt(until), until > 0 */
    nextIntUntil(n) {
      if ((n & -n) === n) return this.nextBits(31 - Math.clz32(n));
      let v, bits;
      do { bits = this.nextInt() >>> 1; v = bits % n; } while (((bits - v + (n - 1)) | 0) < 0);
      return v;
    }
    nextFloat() { return f(this.nextBits(24) / 16777216); }
    nextBoolean() { return this.nextBits(1) !== 0; }
    nextLong() { const hi = BigInt(this.nextInt()); const lo = BigInt(this.nextInt()); return BigInt.asIntN(64, (hi << 32n) + lo); }
  }

  // ------------------------------------------------------------------ culori (ca android.graphics.Color, cu Skia dedesubt)

  const red = (c) => (c >>> 16) & 0xFF, green = (c) => (c >>> 8) & 0xFF, blue = (c) => c & 0xFF, alphaOf = (c) => (c >>> 24) & 0xFF;
  const rgb = (r, g, b) => ((0xFF << 24) | (r << 16) | (g << 8) | b) | 0;
  const WHITE = rgb(255, 255, 255), BLACK = rgb(0, 0, 0);
  const round2int = (x) => Math.floor(f(x + 0.5));     // SkScalarRoundToInt

  function colorToHSV(c) {
    const r = red(c), g = green(c), b = blue(c);
    const min = Math.min(r, g, b), max = Math.max(r, g, b), delta = max - min;
    const v = f(max / 255);
    if (delta === 0) return [0, 0, v];
    const s = f(delta / max);
    let h;
    if (r === max) h = f((g - b) / delta);
    else if (g === max) h = f(2 + f((b - r) / delta));
    else h = f(4 + f((r - g) / delta));
    h = f(h * 60);
    if (h < 0) h = f(h + 360);
    return [h, s, v];
  }

  function HSVToColor(h, s0, v0) {
    const s = Math.min(Math.max(s0, 0), 1), v = Math.min(Math.max(v0, 0), 1);
    const vb = round2int(f(v * 255));
    if (Math.abs(s) <= f(1 / 4096)) return rgb(vb, vb, vb);
    const hx = (h < 0 || h >= 360) ? 0 : f(h / 60);
    const w = Math.floor(hx);
    const fr = f(hx - w);
    const p = round2int(f(f(f(1 - s) * v) * 255));
    const q = round2int(f(f(f(1 - f(s * fr)) * v) * 255));
    const t = round2int(f(f(f(1 - f(s * f(1 - fr))) * v) * 255));
    switch (w) {
      case 0: return rgb(vb, t, p);
      case 1: return rgb(q, vb, p);
      case 2: return rgb(p, vb, t);
      case 3: return rgb(p, q, vb);
      case 4: return rgb(t, p, vb);
      default: return rgb(vb, p, q);
    }
  }

  const coerce = (x, lo, hi) => (x < lo ? lo : x > hi ? hi : x);
  /** Composer.alpha */
  const withAlpha = (color, a) => ((color & 0x00FFFFFF) | (coerce(a, 0, 255) << 24)) | 0;
  /** Composer.blend: fără alfa, fiecare canal trunchiat */
  function blend(a, b, t0) {
    const t = f(t0);
    const ch = (x, y) => coerce(trunc(f(x + f((y - x) * t))), 0, 255);
    return rgb(ch(red(a), red(b)), ch(green(a), green(b)), ch(blue(a), blue(b)));
  }
  const hex = (c) => ((c >>> 0).toString(16)).padStart(8, "0");

  // ------------------------------------------------------------------ palete (Palettes.kt)

  const ARMONIE = 0, NEON = 1, PASTEL = 2, TUS = 3, BRUT = 4, REGISTERS = 5;

  class Palette {
    constructor(name, background, stem, ramp, tip, dark, register = 0, fixedAccents = null) {
      this.name = name; this.background = background; this.stem = stem; this.ramp = ramp; this.tip = tip; this.dark = dark;
      this.register = register; this._fixed = fixedAccents; this._accents = null;
    }
    get accents() {
      if (this._fixed) return this._fixed;
      if (!this._accents) {
        const rot = (color, deg, satK, valAdd) => {
          const hsv = colorToHSV(color);
          const h = f(f(f(hsv[0] + deg) + 360) % 360);
          const s = coerce(f(hsv[1] * satK), F(0.15), 1);
          const v = coerce(f(hsv[2] + valAdd), F(0.2), 1);
          return HSVToColor(h, s, v);
        };
        const r = this.ramp;
        this._accents = [this.stem, r[0], r[r.length - 1], this.tip,
          rot(this.stem, 35, F(0.9), F(0.05)), rot(this.stem, -40, F(0.85), F(0.1)), rot(this.tip, 150, F(1.3), F(-0.1))];
      }
      return this._accents;
    }
  }

  const c = (s) => (parseInt(s.slice(1), 16) | 0xFF000000) | 0;
  const HAND = [
    ["crema si teracota", "#F4E9D8", "#8C3B1E", ["#B95A32", "#D98B5A", "#E8B88A"], "#F1D6B6", false],
    ["noapte si aur", "#121A2E", "#D9A441", ["#E5B85C", "#EFCC84", "#F6E1B2"], "#FFF2CC", true],
    ["padure si roz pal", "#1F3A2E", "#F2C6CF", ["#E8A9B8", "#F1C4CE", "#F8DDE3"], "#FFF0F3", true],
    ["bordo si piersica", "#4A1C2A", "#F3B48A", ["#E89C70", "#F2B993", "#F8D3B8"], "#FDEBDC", true],
    ["albastru prafuit si rugina", "#C9D5DD", "#7A3E2A", ["#9A5238", "#B86F4F", "#D4987A"], "#E8C3AE", false],
    ["carbune si menta", "#23262B", "#9FE0C8", ["#86D2B7", "#A9E5D1", "#CDF1E5"], "#EAFBF5", true],
    ["nisip si verde marin", "#E9DCC4", "#145C5A", ["#1E7A76", "#3F9C96", "#7FC0BA"], "#BFE1DD", false],
    ["pruna si caisa", "#3B2140", "#F0B07A", ["#E99C64", "#F2B98E", "#F7D4B5"], "#FCEBDA", true],
    ["cerneala si fildes", "#1C2541", "#F3EFE2", ["#E9E2CF", "#F0EADA", "#F8F4EA"], "#FFFFFF", true],
    ["salvie si coral", "#D6DDCF", "#C9553D", ["#D8705A", "#E6907D", "#F0B4A6"], "#F9D7CF", false],
    ["mustar si indigo", "#D9A832", "#2B2E6B", ["#3C4188", "#5A5FA6", "#8A8EC6"], "#C3C5E6", false],
    ["roz pal si vin", "#F1D9D6", "#6B1E3A", ["#8A2E4F", "#AD4F6E", "#CB7F97"], "#E5B6C5", false],
    ["ardezie si lamaie", "#3E4A59", "#F2E36B", ["#EDE089", "#F3E9A7", "#F8F1C6"], "#FCF8E2", true],
    ["miez de noapte si cyan", "#0E1B2B", "#5FD3E8", ["#7ADCEC", "#9EE6F1", "#C4F0F7"], "#E6FAFD", true],
    ["masline si lavanda", "#5B6B3A", "#D9C8F0", ["#CDB8EA", "#DCCDF0", "#EAE1F6"], "#F6F1FB", true],
    ["fildes si cobalt", "#F7F2E8", "#1F3C9E", ["#2E52B8", "#5A7ACB", "#95ABDD"], "#C8D5EE", false],
    ["ocru si verde inchis", "#C98E3C", "#1E3F2B", ["#2D5A3D", "#4E7B5B", "#7FA489"], "#B6CFBD", false],
    ["gri cald si caramiziu", "#E3DED6", "#A3472E", ["#B85E42", "#CE7E63", "#E0A48F"], "#EFC9BB", false],
    ["verde sticla si auriu", "#1D4E4A", "#E3C56B", ["#E9D084", "#F0DDA5", "#F6EAC7"], "#FBF4DE", true],
    ["lavanda si teracota", "#CFC6E6", "#9C4A2F", ["#B5603F", "#CB7E5F", "#DEA48B"], "#EEC8B7", false],
  ].map((p) => new Palette(p[0], c(p[1]), c(p[2]), p[3].map(c), c(p[4]), p[5]));

  /** hsv() din Palettes: nuanța adusă în cerc, restul strâns în 0..1 */
  const hsv = (h, s, v) => HSVToColor(f(f(f(h % 360) + 360) % 360), coerce(s, 0, 1), coerce(v, 0, 1));

  function luminance(col) {
    const ch = (x) => { const v = f(x / 255); return v <= F(0.03928) ? f(v / F(12.92)) : f(Math.pow(f(f(v + F(0.055)) / F(1.055)), 2.4)); };
    return f(f(f(F(0.2126) * ch(red(col))) + f(F(0.7152) * ch(green(col)))) + f(F(0.0722) * ch(blue(col))));
  }
  function contrast(a, b) {
    const la = luminance(a), lb = luminance(b);
    return f(f(Math.max(la, lb) + F(0.05)) / f(Math.min(la, lb) + F(0.05)));
  }
  /** Palettes.mix (cu alfa plin) */
  function mix(a, b, t) {
    const k = coerce(t, 0, 1);
    const ch = (x, y) => trunc(f(x + f((y - x) * k)));
    return rgb(ch(red(a), red(b)), ch(green(a), green(b)), ch(blue(a), blue(b)));
  }
  const pm = (r) => f(f(r.nextFloat() * 2) - 1);
  const sign = (r) => (r.nextBoolean() ? 1 : -1);

  function wobble(p, r) {
    const hueShift = f(pm(r) * 8);
    const valShift = f(pm(r) * F(0.05));
    const shift = (color) => {
      const h = colorToHSV(color);
      return HSVToColor(f(f(f(h[0] + hueShift) + 360) % 360), coerce(f(h[1] * 1), 0, 1), coerce(f(h[2] + valShift), F(0.04), 1));
    };
    return new Palette(p.name, shift(p.background), shift(p.stem), p.ramp.map(shift), shift(p.tip), p.dark);
  }

  function generate(r, dark) {
    let base = f(r.nextFloat() * 360);
    if (base > 70 && base < 160 && r.nextFloat() < F(0.5)) base = f(r.nextFloat() * 360);
    const bs = dark ? f(F(0.30) + f(r.nextFloat() * F(0.32))) : f(F(0.08) + f(r.nextFloat() * F(0.16)));
    const bv = dark ? f(F(0.11) + f(r.nextFloat() * F(0.17))) : f(F(0.84) + f(r.nextFloat() * F(0.11)));
    const bg = hsv(base, bs, bv);
    let off;
    switch (r.nextIntUntil(4)) {
      case 0: off = f(180 + f(pm(r) * 15)); break;
      case 1: { const a = r.nextBoolean() ? 120 : 240; off = f(a + f(pm(r) * 12)); break; }
      case 2: { const a = r.nextBoolean() ? 1 : -1; off = f(a * f(30 + f(r.nextFloat() * 20))); break; }
      default: { const a = r.nextBoolean() ? 150 : 210; off = f(a + f(pm(r) * 12)); }
    }
    const sh = f(f(f(f(base + off) % 360) + 360) % 360);
    let ss = f(F(0.45) + f(r.nextFloat() * F(0.35)));
    let sv = dark ? f(F(0.62) + f(r.nextFloat() * F(0.3))) : f(F(0.28) + f(r.nextFloat() * F(0.3)));
    if (ss > F(0.65) && sv > F(0.8)) ss = f(F(0.55) + f(r.nextFloat() * F(0.1)));
    if ((sh > 80 && sh < 160) || (sh > 280 && sh < 320)) ss = Math.min(ss, F(0.62));
    if (dark && sh > 70 && sh < 160) { sv = Math.min(sv, F(0.74)); ss = Math.min(ss, F(0.55)); }
    let stem = hsv(sh, ss, sv);
    let tries = 0;
    while (contrast(bg, stem) < F(3.2) && tries < 40) {
      sv = dark ? Math.min(1, f(sv + F(0.03))) : Math.max(F(0.05), f(sv - F(0.03)));
      if (!dark && sv < F(0.2)) ss = Math.min(1, f(ss + F(0.03)));
      stem = hsv(sh, ss, sv);
      tries++;
    }
    const tipS = dark ? f(F(0.08) + f(r.nextFloat() * F(0.1))) : Math.max(F(0.18), f(ss * F(0.45)));
    const tipV = dark ? F(0.96) : Math.min(F(0.92), f(sv + F(0.5)));
    const tip = hsv(dark ? f(sh + f(pm(r) * 10)) : sh, tipS, tipV);
    const ramp = [0, 1, 2].map((i) => {
      const t = f((i + 1) / 4);
      const h = f(sh + f(pm(r) * 6));
      return hsv(h, f(f(ss * f(1 - t)) + f(tipS * t)), f(f(sv * f(1 - t)) + f(tipV * t)));
    });
    return new Palette("generata", bg, stem, ramp, tip, dark);
  }

  function pickGen1(r, light) {
    const dark = (light >= 0 && r.nextFloat() < F(0.5)) ? r.nextFloat() > light : r.nextBoolean();
    if (r.nextFloat() < F(0.25)) {
      const pool = HAND.filter((p) => p.dark === dark);
      return wobble(pool[r.nextIntUntil(pool.length)], r);
    }
    return generate(r, dark);
  }

  function neon(r) {
    const base = f(r.nextFloat() * 360);
    const bgS = f(F(0.30) + f(r.nextFloat() * F(0.35)));
    const bgV = f(F(0.04) + f(r.nextFloat() * F(0.06)));
    const bg = hsv(base, bgS, bgV);
    const offs = [150, 180, 210, 120, 240];
    const o = offs[r.nextIntUntil(offs.length)];
    const sh = f(f(base + o) + f(pm(r) * 15));
    const stem = hsv(sh, f(F(0.85) + f(r.nextFloat() * F(0.15))), 1);
    const sg = sign(r);
    const step = f(sg * f(25 + f(r.nextFloat() * 30)));
    const ramp = [0, 1, 2].map((i) => hsv(f(sh + f(step * (i + 1))), f(F(0.75) + f(r.nextFloat() * F(0.25))), 1));
    const tip = hsv(f(sh + f(step * 4)), f(F(0.12) + f(r.nextFloat() * F(0.12))), 1);
    return new Palette("neon", bg, stem, ramp, tip, true, NEON);
  }

  function pastel(r) {
    const base = f(r.nextFloat() * 360);
    const bgS = f(F(0.04) + f(r.nextFloat() * F(0.09)));
    const bgV = f(F(0.94) + f(r.nextFloat() * F(0.04)));
    const bg = hsv(base, bgS, bgV);
    const offs = [180, 120, 240, 35, -35, 150, 210];
    const o = offs[r.nextIntUntil(offs.length)];
    const sh = f(f(base + o) + f(pm(r) * 12));
    let ss = f(F(0.30) + f(r.nextFloat() * F(0.18)));
    let sv = f(F(0.72) + f(r.nextFloat() * F(0.14)));
    let stem = hsv(sh, ss, sv);
    let tries = 0;
    while (contrast(bg, stem) < F(2.1) && tries < 40) { sv = f(sv - F(0.02)); ss = Math.min(F(0.6), f(ss + F(0.01))); stem = hsv(sh, ss, sv); tries++; }
    const sg = sign(r);
    const step = f(sg * f(18 + f(r.nextFloat() * 22)));
    const ramp = [0, 1, 2].map((i) => hsv(f(sh + f(step * (i + 1))), f(ss * f(F(0.95) - f(F(0.12) * i))), Math.min(F(0.95), f(sv + f(F(0.06) * (i + 1))))));
    const tip = hsv(f(sh + f(step * 3)), f(ss * F(0.5)), F(0.97));
    return new Palette("pastel", bg, stem, ramp, tip, false, PASTEL);
  }

  function tus(r) {
    const darkPaper = r.nextFloat() < F(0.12);
    const ph = f(30 + f(r.nextFloat() * 25));
    let bg;
    if (darkPaper) bg = hsv(ph, F(0.25), f(F(0.10) + f(r.nextFloat() * F(0.05))));
    else { const s = f(F(0.07) + f(r.nextFloat() * F(0.09))); const v = f(F(0.90) + f(r.nextFloat() * F(0.06))); bg = hsv(ph, s, v); }
    const inks = [[25, 0.35, 0.14], [232, 0.70, 0.34], [10, 0.78, 0.56], [160, 0.50, 0.26], [275, 0.45, 0.30], [205, 0.65, 0.40]];
    const ink = inks[r.nextIntUntil(inks.length)];
    const ih = f(ink[0] + f(pm(r) * 8));
    const stem = darkPaper ? hsv(ih, f(F(ink[1]) * F(0.5)), F(0.88)) : hsv(ih, F(ink[1]), F(ink[2]));
    const ramp = [0, 1, 2].map((i) => mix(stem, bg, f(F(0.22) * (i + 1))));
    const tip = mix(stem, bg, F(0.55));
    const accents = [stem, ramp[0], ramp[2], tip, mix(stem, bg, F(0.35)), mix(stem, darkPaper ? WHITE : BLACK, F(0.25)), mix(stem, bg, F(0.7))];
    return new Palette("tus", bg, stem, ramp, tip, darkPaper, TUS, accents);
  }

  function brut(r) {
    const grounds = [[62, 0.55, 0.55], [300, 0.40, 0.42], [22, 0.60, 0.48], [170, 0.38, 0.50], [95, 0.50, 0.45], [340, 0.45, 0.55]];
    const g = grounds[r.nextIntUntil(grounds.length)];
    const bh = f(g[0] + f(pm(r) * 10));
    const bgS = f(F(g[1]) + f(pm(r) * F(0.08)));
    const bgV = f(F(g[2]) + f(pm(r) * F(0.08)));
    const bg = hsv(bh, bgS, bgV);
    const sg = sign(r);
    const sh = f(bh + f(sg * f(95 + f(r.nextFloat() * 50))));
    let ss = f(F(0.75) + f(r.nextFloat() * F(0.25)));
    let sv = r.nextFloat() < F(0.5) ? 1 : f(F(0.22) + f(r.nextFloat() * F(0.12)));
    let stem = hsv(sh, ss, sv);
    let tries = 0;
    while (contrast(bg, stem) < F(2.2) && tries < 40) {
      sv = luminance(stem) > luminance(bg) ? Math.min(1, f(sv + F(0.04))) : Math.max(F(0.05), f(sv - F(0.04)));
      if (sv >= 1) ss = Math.max(F(0.2), f(ss - F(0.05)));
      stem = hsv(sh, ss, sv); tries++;
    }
    const ramp = [0, 1, 2].map((i) => {
      const s2 = sign(r);
      const h = f(sh + f(f(s2 * f(60 + f(r.nextFloat() * 70))) * (i + 1)));
      const s = f(F(0.7) + f(r.nextFloat() * F(0.3)));
      const v = f(F(0.55) + f(r.nextFloat() * F(0.45)));
      return hsv(h, s, v);
    });
    const acid = [68, 318, 180];
    const ah = acid[r.nextIntUntil(acid.length)];
    const tip = hsv(ah, f(F(0.75) + f(r.nextFloat() * F(0.2))), 1);
    return new Palette("brut", bg, stem, ramp, tip, luminance(bg) < F(0.18), BRUT);
  }

  function pickGen3(r, light) {
    const roll = r.nextFloat();
    if (roll < F(0.52)) return pickGen1(r, light);
    if (roll < F(0.67)) return neon(r);
    if (roll < F(0.82)) return pastel(r);
    if (roll < F(0.94)) return tus(r);
    return brut(r);
  }

  function pickPalette(r, light, gen) {
    if (gen >= 3) return pickGen3(r, light);
    if (gen >= 1) return pickGen1(r, light);
    let p;
    if (light < 0 || r.nextFloat() < F(0.3)) p = HAND[r.nextIntUntil(HAND.length)];
    else {
      const wantDark = r.nextFloat() > light;
      const pool = HAND.filter((q) => q.dark === wantDark);
      p = pool[r.nextIntUntil(pool.length)];
    }
    return wobble(p, r);
  }

  // ------------------------------------------------------------------ planul și așezarea (Composer.plan, Composer.layout)

  const TEXTURES = ["NONE", "GRAIN", "HALOS", "VIGNETTE"];

  /** params: { strokes: [[{x,y}...]...], nervous, slow, light, battery, seed (BigInt), gen, signature } */
  function plan(w, h, p) {
    const r = new Random(p.seed);
    const pal = pickPalette(r, p.light, p.gen);
    const solo = p.gen >= 3 ? ["BRANCHES", "BUBBLES", "RIBBONS", "CONSTELLATION", "MOSAIC", "CUBES"] : ["BRANCHES", "BUBBLES", "RIBBONS", "CONSTELLATION", "MOSAIC"];
    let family = solo[r.nextIntUntil(solo.length)];
    if (p.battery >= 0 && p.battery <= F(0.2) && r.nextFloat() < F(0.5)) family = r.nextBoolean() ? "BUBBLES" : "CONSTELLATION";
    const pairs = [["WAVES", "BUBBLES"], ["WAVES", "BRANCHES"], ["WAVES", "CONSTELLATION"], ["MOSAIC", "BRANCHES"], ["MOSAIC", "BUBBLES"],
      ["CONSTELLATION", "BUBBLES"], ["RIBBONS", "BUBBLES"]].concat(p.gen >= 3 ? [["WAVES", "CUBES"], ["CONSTELLATION", "CUBES"]] : []);
    let backdrop = null;
    if (r.nextFloat() < F(0.4)) {
      const pr = pairs[r.nextIntUntil(pairs.length)];
      backdrop = pr[0]; family = pr[1];
    }
    const texture = TEXTURES[r.nextIntUntil(TEXTURES.length)];
    const frameW = f(Math.min(w, h) * f(F(0.022) + f(r.nextFloat() * F(0.016))));
    const doubleLine = r.nextFloat() < F(0.5);
    const frameColor = blend(blend(pal.background, pal.stem, F(0.25)), BLACK, f(F(0.28) + f(r.nextFloat() * F(0.15))));
    const pl = { r, pal, family, backdrop, texture, frameW, doubleLine, frameColor, volume: false, drawSeed: 0n, pearl: false, relief: false };
    if (p.gen >= 3) {
      pl.volume = true;
      pl.drawSeed = r.nextLong();
      pl.pearl = r.nextFloat() < F(0.45);
      const rel = r.nextFloat() < F(0.35);
      pl.relief = rel && !pal.dark;
    }
    return pl;
  }

  const matW = (w, h) => f(Math.min(w, h) * F(0.012));
  function innerRect(w, h, pl) {
    const m = f(pl.frameW + matW(w, h));
    return { left: m, top: m, right: f(w - m), bottom: f(h - m) };
  }
  const rw = (a) => f(a.right - a.left), rh = (a) => f(a.bottom - a.top);
  const rcx = (a) => f(f(a.left + a.right) * F(0.5)), rcy = (a) => f(f(a.top + a.bottom) * F(0.5));
  const hypot = (a, b) => f(Math.sqrt(a * a + b * b));   // intrările sunt Float, deci pătratele sunt exacte în double
  const familyK = (family) => (family === "BRANCHES" || family === "CALLIGRAPHY") ? 1 : (family === "CONSTELLATION" || family === "MOSAIC" || family === "WAVES") ? F(0.72) : F(0.9);

  /** Composer.fit: până la generația 1, gestul adus mereu la aceeași mărime, în centru */
  function fit(src, area, family) {
    if (src.length === 0) return [];
    const w = rw(area), h = rh(area);
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const s of src) for (const q of s) { minX = Math.min(minX, q.x); minY = Math.min(minY, q.y); maxX = Math.max(maxX, q.x); maxY = Math.max(maxY, q.y); }
    const bw = Math.max(f(maxX - minX), F(0.02)), bh = Math.max(f(maxY - minY), F(0.02));
    const realW = f(bw * w), realH = f(bh * h);
    const k = familyK(family);
    const targetW = f(f(w * F(0.58)) * k), targetH = f(f(h * F(0.68)) * k);
    const s = Math.min(f(targetW / realW), f(targetH / realH));
    const cx = f(f(f(minX + maxX) / 2) * w), cy = f(f(f(minY + maxY) / 2) * h);
    const acx = rcx(area), acy = rcy(area);
    return src.map((st) => st.map((q) => ({ x: f(acx + f(f(f(q.x * w) - cx) * s)), y: f(acy + f(f(f(q.y * h) - cy) * s)) })));
  }

  /** Composer.layout: de la generația 2, gestul dă mărimea, locul și bogăția */
  function layout(src, area, family, gen) {
    if (gen < 2 || src.length === 0) return { strokes: fit(src, area, family), cx: rcx(area), cy: rcy(area), scale: 1, amount: 1 };
    const w = rw(area), h = rh(area);
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let len = 0;
    for (const st of src) {
      for (let i = 0; i < st.length; i++) {
        const q = st[i];
        minX = Math.min(minX, q.x); minY = Math.min(minY, q.y); maxX = Math.max(maxX, q.x); maxY = Math.max(maxY, q.y);
        if (i > 0) len = f(len + hypot(f(f(q.x - st[i - 1].x) * w), f(f(q.y - st[i - 1].y) * h)));
      }
    }
    const bw = Math.max(f(maxX - minX), F(0.02)), bh = Math.max(f(maxY - minY), F(0.02));
    const realW = f(bw * w), realH = f(bh * h);
    const k = familyK(family);
    const full = Math.min(f(f(f(w * F(0.58)) * k) / realW), f(f(f(h * F(0.68)) * k) / realH));
    const sc = Math.min(full, Math.max(F(1.15), f(F(0.35) * full)));
    const part = f(sc / full);
    const acx = rcx(area), acy = rcy(area);
    const gx = f(area.left + f(f(f(minX + maxX) / 2) * w)), gy = f(area.top + f(f(f(minY + maxY) / 2) * h));
    let cx = f(acx + f(f(gx - acx) * F(0.7)));
    let cy = f(acy + f(f(gy - acy) * F(0.7)));
    const halfW = f(f(realW * sc) / 2), halfH = f(f(realH * sc) / 2);
    const mx = f(w * F(0.14)), my = f(h * F(0.11));
    const loX = f(f(area.left + mx) + halfW), hiX = f(f(area.right - mx) - halfW);
    const loY = f(f(area.top + my) + halfH), hiY = f(f(area.bottom - my) - halfH);
    cx = loX > hiX ? acx : coerce(cx, loX, hiX);
    cy = loY > hiY ? acy : coerce(cy, loY, hiY);
    const ox = f(f(f(minX + maxX) / 2) * w), oy = f(f(f(minY + maxY) / 2) * h);
    const strokes = src.map((st) => st.map((q) => ({ x: f(cx + f(f(f(q.x * w) - ox) * sc)), y: f(cy + f(f(f(q.y * h) - oy) * sc)) })));
    const much = coerce(f(len / f(F(1.5) * w)), F(0.12), F(0.999));
    return { strokes, cx, cy, scale: f(Math.sqrt(part)), amount: much };
  }

  /** Din cazul de test sau din codul unui dar: parametrii pe care îi cere compozitorul */
  function paramsFromCase(o) {
    return {
      strokes: o.strokes.map((s) => s.map((q) => ({ x: f(q[0] / 65535), y: f(q[1] / 65535) }))),
      nervous: f(o.nervous / 255), slow: f(o.slow / 255),
      light: o.light === 255 ? -1 : f(o.light / 254), battery: o.battery === 255 ? -1 : f(o.battery / 254),
      seed: BigInt(o.seed), gen: o.gen, signature: o.signature || null,
    };
  }

  /** Același text ca Composer.planInfo din aplicație, pentru comparația cu tablourile de referință */
  function planInfo(w, h, p) {
    const pl = plan(w, h, p);
    const lay = layout(p.strokes, innerRect(w, h, pl), pl.family, p.gen);
    return { family: pl.family, backdrop: pl.backdrop, texture: pl.texture, palette: pl.pal.name, register: pl.pal.register, dark: pl.pal.dark,
      bg: hex(pl.pal.background), stem: hex(pl.pal.stem), ramp: pl.pal.ramp.map(hex).join(","), tip: hex(pl.pal.tip), accents: pl.pal.accents.map(hex).join(","),
      frameW: pl.frameW, double: pl.doubleLine, frame: hex(pl.frameColor), volume: pl.volume, drawSeed: pl.drawSeed.toString(), pearl: pl.pearl, relief: pl.relief,
      cx: lay.cx, cy: lay.cy, scale: lay.scale, amount: lay.amount };
  }


  // ------------------------------------------------------------------ aritmetica pe Float, ca în Kotlin
  // Fiecare operație rotunjește la 32 de biți; add și mul merg de la stânga la dreapta, ca a + b + c și a * b * c.

  const add = (a, b, c) => (c === undefined ? f(f(a) + f(b)) : f(f(f(a) + f(b)) + f(c)));
  const sub = (a, b) => f(f(a) - f(b));
  const div = (a, b) => f(f(a) / f(b));
  const mul = (a, b, c, d) => {
    let x = f(f(a) * f(b));
    if (c !== undefined) { x = f(x * f(c)); if (d !== undefined) x = f(x * f(d)); }
    return x;
  };
  const sin = (x) => f(Math.sin(x)), cos = (x) => f(Math.cos(x)), atan2 = (y, x) => f(Math.atan2(y, x));
  const sqrt = (x) => f(Math.sqrt(x)), ln = (x) => f(Math.log(x));
  const PI = F(3.1416), TAU = F(6.2832), QUARTER = F(1.5708), TWO_PI = F(2 * Math.PI);
  const pt = (x, y) => ({ x, y });

  // ------------------------------------------------------------------ drumul (android.graphics.Path)

  class Path {
    constructor() { this.rewind(); }
    rewind() { this.cmds = []; this.l = Infinity; this.t = Infinity; this.r = -Infinity; this.b = -Infinity; }
    _p(x, y) { if (x < this.l) this.l = x; if (x > this.r) this.r = x; if (y < this.t) this.t = y; if (y > this.b) this.b = y; }
    moveTo(x, y) { this.cmds.push(["M", x, y]); this._p(x, y); }
    lineTo(x, y) { this.cmds.push(["L", x, y]); this._p(x, y); }
    quadTo(cx, cy, x, y) { this.cmds.push(["Q", cx, cy, x, y]); this._p(cx, cy); this._p(x, y); }
    close() { this.cmds.push(["Z"]); }
    /** dreptunghi în sensul acelor de ceas */
    addRect(l, t, r, b) { this.cmds.push(["R", l, t, r, b]); this._p(l, t); this._p(r, b); }
    /** oval în sens invers: împreună cu un dreptunghi, decupează */
    addOvalCCW(l, t, r, b) { this.cmds.push(["O", l, t, r, b]); this._p(l, t); this._p(r, b); }
    addPath(o) { for (const c of o.cmds) this.cmds.push(c); if (o.cmds.length) { this._p(o.l, o.t); this._p(o.r, o.b); } }
    bounds() { return this.cmds.length ? [this.l, this.t, this.r, this.b] : [0, 0, 0, 0]; }
  }

  // ------------------------------------------------------------------ pânzele
  // Compozitorul desenează pe o pânză cu chemările din Android. Trei feluri: una care nu desenează (pentru verificări),
  // una care ține jurnalul chemărilor (ca ReferenceTest din aplicație) și cea adevărată, peste canvas-ul din browser.

  class NullCanvas {
    drawColor() {} drawRect() {} drawCircle() {} drawPath() {} drawOval() {} drawLine() {} drawRoundRect() {} drawText() {}
    save() {} restore() {} translate() {} scale() {} rotate() {} clipRect() {} saveLayerAlpha() {} saveLayerShadow() {}
    offscreen() { return new NullCanvas(); } drawBitmap() {}
  }

  const n2 = (v) => f(v).toFixed(2);
  class Recorder {
    constructor(inner) { this.inner = inner || new NullCanvas(); this.lines = []; }
    _d(p) { return hex(p.color) + " " + (p.style === "S" ? "S" + n2(p.width) : "F") + (p.shader ? " G" : ""); }
    drawColor(c) { this.lines.push("color " + hex(c)); this.inner.drawColor(c); }
    drawRect(l, t, r, b, p) { this.lines.push(`rect ${n2(l)} ${n2(t)} ${n2(r)} ${n2(b)} ${this._d(p)}`); this.inner.drawRect(l, t, r, b, p); }
    drawCircle(x, y, rad, p) { this.lines.push(`circle ${n2(x)} ${n2(y)} ${n2(rad)} ${this._d(p)}`); this.inner.drawCircle(x, y, rad, p); }
    drawPath(path, p) { const b = path.bounds(); this.lines.push(`path ${n2(b[0])} ${n2(b[1])} ${n2(b[2])} ${n2(b[3])} ${this._d(p)}`); this.inner.drawPath(path, p); }
    drawOval(l, t, r, b, p) { this.lines.push(`oval ${n2(l)} ${n2(t)} ${n2(r)} ${n2(b)} ${this._d(p)}`); this.inner.drawOval(l, t, r, b, p); }
    drawLine(x1, y1, x2, y2, p) { this.lines.push(`line ${n2(x1)} ${n2(y1)} ${n2(x2)} ${n2(y2)} ${this._d(p)}`); this.inner.drawLine(x1, y1, x2, y2, p); }
    drawRoundRect(l, t, r, b, rx, p) { this.lines.push(`rrect ${n2(l)} ${n2(t)} ${n2(r)} ${n2(b)} ${n2(rx)} ${this._d(p)}`); this.inner.drawRoundRect(l, t, r, b, rx, p); }
    drawText(s, x, y, p) { this.lines.push(`text ${n2(x)} ${n2(y)} ${n2(p.size)} ${hex(p.color)}`); this.inner.drawText(s, x, y, p); }
    save() { this.lines.push("save"); this.inner.save(); }
    restore() { this.lines.push("restore"); this.inner.restore(); }
    translate(x, y) { this.lines.push(`translate ${n2(x)} ${n2(y)}`); this.inner.translate(x, y); }
    scale(x, y) { this.lines.push(`scale ${n2(x)} ${n2(y)}`); this.inner.scale(x, y); }
    rotate(d) { this.lines.push(`rotate ${n2(d)}`); this.inner.rotate(d); }
    clipRect(l, t, r, b) { this.lines.push(`clip ${n2(l)} ${n2(t)} ${n2(r)} ${n2(b)}`); this.inner.clipRect(l, t, r, b); }
    saveLayerAlpha(l, t, r, b, a) { this.lines.push("layer " + a); this.inner.saveLayerAlpha(l, t, r, b, a); }
    saveLayerShadow(l, t, r, b, k) { this.lines.push("layer filter"); this.inner.saveLayerShadow(l, t, r, b, k); }
    offscreen(w, h) { return this.inner.offscreen(w, h); }
    drawBitmap(bmp, l, t, r, b, a) { this.lines.push(`bitmap ${bmp.w} ${bmp.h} ${a}`); this.inner.drawBitmap(bmp, l, t, r, b, a); }
  }

  const css = (c) => `rgba(${red(c)},${green(c)},${blue(c)},${alphaOf(c) / 255})`;

  /** Pânza adevărată: un context 2D de w x h pixeli. makeCanvas(w, h) dă o pânză nouă (pentru straturi și pentru strălucire). */
  class Canvas2D {
    constructor(ctx, w, h, makeCanvas) {
      this.ctx = ctx; this.w = w; this.h = h; this.make = makeCanvas; this.canvas = ctx.canvas;
      this.stack = []; this.m = [1, 0, 0, 1, 0, 0];
      ctx.lineCap = "round"; ctx.lineJoin = "round";
    }
    _fill(p) {
      const c = this.ctx;
      if (p.shader) {
        const s = p.shader, g = c.createRadialGradient(s.cx, s.cy, 0, s.cx, s.cy, s.r);
        s.colors.forEach((col, i) => g.addColorStop(s.stops[i], css(col)));
        c.fillStyle = g;
      } else c.fillStyle = css(p.color);
    }
    _paint(p) {
      const c = this.ctx;
      if (p.style === "S") { c.strokeStyle = css(p.color); c.lineWidth = p.width; c.stroke(); } else { this._fill(p); c.fill(); }
    }
    drawColor(col) { const c = this.ctx; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = css(col); c.fillRect(0, 0, this.w, this.h); c.restore(); }
    drawRect(l, t, r, b, p) { const c = this.ctx; c.beginPath(); c.rect(l, t, r - l, b - t); this._paint(p); }
    drawCircle(x, y, rad, p) { if (!(rad > 0)) return; const c = this.ctx; c.beginPath(); c.arc(x, y, rad, 0, 2 * Math.PI); this._paint(p); }
    drawOval(l, t, r, b, p) { const c = this.ctx; c.beginPath(); c.ellipse((l + r) / 2, (t + b) / 2, Math.abs(r - l) / 2, Math.abs(b - t) / 2, 0, 0, 2 * Math.PI); this._paint(p); }
    drawLine(x1, y1, x2, y2, p) { const c = this.ctx; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.strokeStyle = css(p.color); c.lineWidth = p.width; c.stroke(); }
    drawRoundRect(l, t, r, b, rad, p) {
      const c = this.ctx, k = Math.min(rad, (r - l) / 2, (b - t) / 2);
      c.beginPath(); c.moveTo(l + k, t); c.arcTo(r, t, r, b, k); c.arcTo(r, b, l, b, k); c.arcTo(l, b, l, t, k); c.arcTo(l, t, r, t, k); c.closePath(); this._paint(p);
    }
    drawPath(path, p) {
      const c = this.ctx; c.beginPath();
      for (const q of path.cmds) {
        switch (q[0]) {
          case "M": c.moveTo(q[1], q[2]); break;
          case "L": c.lineTo(q[1], q[2]); break;
          case "Q": c.quadraticCurveTo(q[1], q[2], q[3], q[4]); break;
          case "Z": c.closePath(); break;
          case "R": c.moveTo(q[1], q[2]); c.lineTo(q[3], q[2]); c.lineTo(q[3], q[4]); c.lineTo(q[1], q[4]); c.closePath(); break;
          case "O": { const cx = (q[1] + q[3]) / 2, cy = (q[2] + q[4]) / 2, rx = Math.abs(q[3] - q[1]) / 2, ry = Math.abs(q[4] - q[2]) / 2;
            c.moveTo(cx + rx, cy); c.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI, true); c.closePath(); break; }
        }
      }
      this._paint(p);
    }
    drawText(s, x, y, p) {
      const c = this.ctx;
      c.font = `${p.italic ? "italic " : ""}${p.bold ? "bold " : ""}${p.size}px Georgia, "Times New Roman", Times, serif`;
      c.textAlign = p.align || "left"; c.textBaseline = "alphabetic"; c.fillStyle = css(p.color);
      if (p.letterSpacing && "letterSpacing" in c) c.letterSpacing = p.letterSpacing * p.size + "px";
      c.fillText(s, x, y);
      if ("letterSpacing" in c) c.letterSpacing = "0px";
    }
    save() { this.ctx.save(); this.stack.push({ m: this.m.slice() }); }
    restore() {
      const top = this.stack.pop();
      if (!top) return;
      if (!top.layer) { this.ctx.restore(); this.m = top.m; return; }
      // stratul se așază peste pânza de dedesubt, cu transparența lui
      const layer = this.ctx;
      if (top.shadow !== undefined) {
        layer.setTransform(1, 0, 0, 1, 0, 0); layer.globalCompositeOperation = "source-in"; layer.fillStyle = "#000"; layer.fillRect(0, 0, this.w, this.h);
      }
      this.ctx = top.ctx; this.m = top.m;
      const c = this.ctx;
      c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = top.shadow !== undefined ? top.shadow : top.alpha / 255;
      c.drawImage(layer.canvas, 0, 0); c.restore();
    }
    _set() { const m = this.m; this.ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]); }
    _mul(a, b, c, d, e, g) {
      const m = this.m;
      this.m = [m[0] * a + m[2] * b, m[1] * a + m[3] * b, m[0] * c + m[2] * d, m[1] * c + m[3] * d, m[0] * e + m[2] * g + m[4], m[1] * e + m[3] * g + m[5]];
      this._set();
    }
    translate(x, y) { this._mul(1, 0, 0, 1, x, y); }
    scale(x, y) { this._mul(x, 0, 0, y, 0, 0); }
    rotate(deg) { const a = (deg * Math.PI) / 180; this._mul(Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0); }
    clipRect(l, t, r, b) { const c = this.ctx; c.beginPath(); c.rect(l, t, r - l, b - t); c.clip(); }
    _layer(extra) {
      const cnv = this.make(this.w, this.h), c = cnv.getContext("2d");
      c.lineCap = "round"; c.lineJoin = "round";
      this.stack.push(Object.assign({ layer: true, ctx: this.ctx, m: this.m.slice() }, extra));
      this.ctx = c; this._set();
    }
    /** Stratul e mereu cât tabloul dinăuntrul ramei, adică exact cât tăietura deja pusă pe pânza de dedesubt. */
    saveLayerAlpha(l, t, r, b, a) { this._layer({ alpha: a }); }
    /** Strat care devine umbră: tot ce se desenează în el ajunge negru, cu transparența înmulțită cu k. */
    saveLayerShadow(l, t, r, b, k) { this._layer({ shadow: k }); }
    offscreen(w, h) { const cnv = this.make(w, h); return new Canvas2D(cnv.getContext("2d"), w, h, this.make); }
    drawBitmap(bmp, l, t, r, b, a) {
      const c = this.ctx; c.save(); c.globalAlpha = a / 255; c.imageSmoothingEnabled = true;
      c.drawImage(bmp.canvas, 0, 0, bmp.w, bmp.h, l, t, r - l, b - t); c.restore();
    }
  }

  // Canvas.rotate și Canvas.scale în jurul unui punct, exact ca în Android: trei mișcări, sau niciuna dacă nu schimbă nimic
  function rotateAt(cv, deg, px, py) { if (deg === 0) return; cv.translate(px, py); cv.rotate(deg); cv.translate(-px, -py); }
  function scaleAt(cv, sx, sy, px, py) { if (sx === 1 && sy === 1) return; cv.translate(px, py); cv.scale(sx, sy); cv.translate(-px, -py); }

  // ------------------------------------------------------------------ compozitorul (Composer.kt)

  const stroke = { style: "S", color: BLACK, width: 0, shader: null };
  const fill = { style: "F", color: BLACK, shader: null };
  const text = { style: "F", color: BLACK, size: 12, italic: true, align: "right" };
  let amount = 1, pearl = false;

  const thin = (n, floor) => (amount >= 1 ? n : trunc(mul(n, add(floor, mul(sub(1, floor), amount)))));
  const sparse = (x, k) => (amount >= 1 ? x : mul(x, add(1, mul(sub(1, amount), k))));

  function length(pts) {
    let l = 0;
    for (let i = 1; i < pts.length; i++) l = add(l, hypot(sub(pts[i].x, pts[i - 1].x), sub(pts[i].y, pts[i - 1].y)));
    return Math.max(l, 1);
  }

  function chaikin(pts) {
    if (pts.length < 3) return pts;
    const out = [pts[0]];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      out.push(pt(add(mul(a.x, 0.75), mul(b.x, 0.25)), add(mul(a.y, 0.75), mul(b.y, 0.25))));
      out.push(pt(add(mul(a.x, 0.25), mul(b.x, 0.75)), add(mul(a.y, 0.25), mul(b.y, 0.75))));
    }
    out.push(pts[pts.length - 1]);
    return out;
  }

  function resample(pts, n) {
    if (pts.length < 2) return pts;
    const total = length(pts);
    const step = div(total, n - 1);
    const out = [pts[0]];
    let acc = 0, i = 1, prev = pts[0];
    while (out.length < n - 1 && i < pts.length) {
      const cur = pts[i];
      const d = hypot(sub(cur.x, prev.x), sub(cur.y, prev.y));
      if (d <= 0) { i++; continue; }
      if (add(acc, d) >= step) {
        const t = div(sub(step, acc), d);
        const np = pt(add(prev.x, mul(sub(cur.x, prev.x), t)), add(prev.y, mul(sub(cur.y, prev.y), t)));
        out.push(np); prev = np; acc = 0;
      } else { acc = add(acc, d); prev = cur; i++; }
    }
    out.push(pts[pts.length - 1]);
    return out;
  }

  function undulate(src0, sinuous, r, dp, nervous) {
    let src = src0;
    // gest agitat: coloana se netezește mai mult, ca zigzagul să nu ajungă în tulpină
    const extra = trunc(mul(nervous, 4));
    for (let k = 0; k < extra; k++) src = chaikin(src);
    if (extra > 0) src = resample(src, 60);

    const amp = mul(sinuous, add(20, mul(r.nextFloat(), 50)), dp);
    const freq = add(0.8, mul(r.nextFloat(), 1.7));
    const phase = mul(r.nextFloat(), TAU);
    const amp2 = mul(amp, add(0.15, mul(r.nextFloat(), 0.3)));
    const freq2 = mul(freq, add(2.3, mul(r.nextFloat(), 1.5)));
    const total = length(src);
    let walked = 0;
    const out = [];
    for (let i = 0; i < src.length; i++) {
      const prev = src[Math.max(0, i - 1)], next = src[Math.min(src.length - 1, i + 1)];
      const tangent = atan2(sub(next.y, prev.y), sub(next.x, prev.x));
      if (i > 0) walked = add(walked, hypot(sub(src[i].x, src[i - 1].x), sub(src[i].y, src[i - 1].y)));
      const t = div(walked, total);
      const env = sin(mul(t, PI));
      const off = mul(add(mul(sin(add(mul(t, freq, TAU), phase)), amp), mul(sin(mul(t, freq2, TAU)), amp2)), env);
      out.push(pt(add(src[i].x, mul(cos(add(tangent, QUARTER)), off)), add(src[i].y, mul(sin(add(tangent, QUARTER)), off))));
    }
    let pts = chaikin(chaikin(out));
    pts = resample(pts, 140);
    return { pts, total: length(pts) };
  }

  /** Composer.ink: cerneala care se citește pe hârtia paletei */
  function ink(pal) {
    const b = pal.background;
    const lum = div(add(mul(0.299, red(b)), mul(0.587, green(b)), mul(0.114, blue(b))), 255);
    return lum > F(0.5) ? blend(pal.stem, BLACK, 0.35) : blend(pal.tip, WHITE, 0.5);
  }

  function frameUnder(cv, w, h, dp, pl) {
    const fw = pl.frameW, pal = pl.pal;
    cv.drawColor(pl.frameColor);
    const edge = mul(fw, 0.3);
    fill.color = blend(pl.frameColor, WHITE, 0.16);
    cv.drawRect(0, 0, w, edge, fill);
    cv.drawRect(0, 0, edge, h, fill);
    fill.color = blend(pl.frameColor, BLACK, 0.24);
    cv.drawRect(0, sub(h, edge), w, h, fill);
    cv.drawRect(sub(w, edge), 0, w, h, fill);
    // colțurile tăiate la 45 de grade, ca la o ramă adevărată
    const path = new Path();
    path.moveTo(0, h); path.lineTo(edge, sub(h, edge)); path.lineTo(edge, h); path.close();
    path.moveTo(w, 0); path.lineTo(sub(w, edge), edge); path.lineTo(w, edge); path.close();
    fill.color = blend(pl.frameColor, WHITE, 0.16);
    cv.drawPath(path, fill);
    // muchia dinspre tablou coboară în umbră
    fill.color = blend(pl.frameColor, BLACK, 0.3);
    const lip = mul(fw, 0.12);
    cv.drawRect(sub(fw, lip), sub(fw, lip), add(sub(w, fw), lip), fw, fill);
    cv.drawRect(sub(fw, lip), sub(h, fw), add(sub(w, fw), lip), add(sub(h, fw), lip), fill);
    cv.drawRect(sub(fw, lip), fw, fw, sub(h, fw), fill);
    cv.drawRect(sub(w, fw), fw, add(sub(w, fw), lip), sub(h, fw), fill);
    // filetul
    stroke.color = withAlpha(pal.tip, 0xB0);
    stroke.width = mul(1.2, dp);
    const o = mul(2.5, dp);
    cv.drawRect(sub(sub(fw, lip), o), sub(sub(fw, lip), o), add(add(sub(w, fw), lip), o), add(add(sub(h, fw), lip), o), stroke);
    // passe-partout-ul
    fill.color = pal.dark ? blend(pal.background, WHITE, 0.28) : blend(pal.background, WHITE, 0.55);
    cv.drawRect(fw, fw, sub(w, fw), sub(h, fw), fill);
  }

  function frameOver(cv, inner, dp, pal, doubleLine) {
    stroke.color = ((pal.dark ? 0x50 : 0x30) << 24) | 0;
    stroke.width = mul(1, dp);
    cv.drawRect(inner.left, inner.top, inner.right, inner.bottom, stroke);
    if (doubleLine) {
      stroke.color = withAlpha(pal.tip, 0x60);
      stroke.width = mul(0.7, dp);
      const d = mul(dp, 4);
      cv.drawRect(add(inner.left, d), add(inner.top, d), sub(inner.right, d), sub(inner.bottom, d), stroke);
    }
  }

  function background(cv, area, dp, r, pal, texture) {
    fill.color = pal.background;
    cv.drawRect(area.left, area.top, area.right, area.bottom, fill);
    const fw = rw(area), fh = rh(area), ox = area.left, oy = area.top;
    const tint = (a) => withAlpha(pal.dark ? WHITE : BLACK, a);
    if (texture === "GRAIN") {
      fill.color = tint(pal.dark ? 12 : 14);
      const n = trunc(div(mul(fw, fh), 700));
      for (let i = 0; i < n; i++) {
        const x = add(ox, mul(r.nextFloat(), fw)), y = add(oy, mul(r.nextFloat(), fh));
        cv.drawCircle(x, y, add(mul(0.5, dp), mul(r.nextFloat(), 0.9, dp)), fill);
      }
    } else if (texture === "HALOS") {
      const n = 3 + r.nextIntUntil(4);
      for (let i = 0; i < n; i++) {
        if (r.nextFloat() < F(0.4)) { const col = pal.accents[r.nextIntUntil(pal.accents.length)]; fill.color = withAlpha(col, 10 + r.nextIntUntil(10)); }
        else fill.color = tint(7 + r.nextIntUntil(9));
        const x = add(ox, mul(r.nextFloat(), fw)), y = add(oy, mul(r.nextFloat(), fh));
        cv.drawCircle(x, y, mul(add(70, mul(r.nextFloat(), 170)), dp), fill);
      }
    } else if (texture === "VIGNETTE") {
      for (let i = 0; i < 6; i++) {
        fill.color = tint(4);
        const inset = mul(i, 26, dp);
        const path = new Path();
        path.addRect(area.left, area.top, area.right, area.bottom);
        path.addOvalCCW(add(sub(ox, mul(fw, 0.3)), inset), add(sub(oy, mul(fh, 0.3)), inset), sub(add(ox, mul(fw, 1.3)), inset), sub(add(oy, mul(fh, 1.3)), inset));
        cv.drawPath(path, fill);
      }
    }
  }

  /** O curbă netedă prin puncte: segmente pătratice cu control în punct și capăt la mijlocul dintre puncte. */
  function smoothPath(pts) {
    const path = new Path();
    if (pts.length === 0) return path;
    path.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length - 1; i++) {
      path.quadTo(pts[i].x, pts[i].y, div(add(pts[i].x, pts[i + 1].x), 2), div(add(pts[i].y, pts[i + 1].y), 2));
    }
    if (pts.length > 1) path.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
    return path;
  }

  /** Tulpina caligrafică: o formă plină de-a lungul coloanei, care se subțiază spre capăt. */
  function stem(cv, spine, w0, taperEnd, color, r) {
    const pts = spine.pts;
    if (pts.length < 3) return;
    const left = [], right = [];
    let walked = 0;
    const belly = add(0.1, mul(r.nextFloat(), 0.3));
    for (let i = 0; i < pts.length; i++) {
      const prev = pts[Math.max(0, i - 1)], next = pts[Math.min(pts.length - 1, i + 1)];
      const tangent = atan2(sub(next.y, prev.y), sub(next.x, prev.x));
      const nx = cos(add(tangent, QUARTER)), ny = sin(add(tangent, QUARTER));
      if (i > 0) walked = add(walked, hypot(sub(pts[i].x, pts[i - 1].x), sub(pts[i].y, pts[i - 1].y)));
      const t = div(walked, spine.total);
      const half = Math.max(F(0.6), div(mul(w0, sub(1, mul(sub(1, taperEnd), t)), add(1, mul(belly, sin(mul(t, PI))))), 2));
      left.push(pt(add(pts[i].x, mul(nx, half)), add(pts[i].y, mul(ny, half))));
      right.push(pt(sub(pts[i].x, mul(nx, half)), sub(pts[i].y, mul(ny, half))));
    }
    const path = new Path();
    path.moveTo(left[0].x, left[0].y);
    for (let i = 1; i < left.length; i++) path.lineTo(left[i].x, left[i].y);
    for (let i = right.length - 1; i >= 0; i--) path.lineTo(right[i].x, right[i].y);
    path.close();
    fill.color = color;
    cv.drawPath(path, fill);
    cv.drawCircle(pts[0].x, pts[0].y, Math.max(F(0.6), div(w0, 2)), fill);
    cv.drawCircle(pts[pts.length - 1].x, pts[pts.length - 1].y, Math.max(F(0.6), div(mul(w0, taperEnd), 2)), fill);
  }

  /** Curbura locală a coloanei la indexul i: pozitivă la stânga, negativă la dreapta. */
  function curvature(pts, i) {
    const a = pts[Math.max(0, i - 4)], b = pts[i], c2 = pts[Math.min(pts.length - 1, i + 4)];
    const a1 = atan2(sub(b.y, a.y), sub(b.x, a.x)), a2 = atan2(sub(c2.y, b.y), sub(c2.x, b.x));
    let d = sub(a2, a1);
    while (d > Math.PI) d = sub(d, TWO_PI);
    while (d < -Math.PI) d = add(d, TWO_PI);
    return d;
  }

  // ---------------------------------------------------------------- familia: ramuri

  const TIPS = ["CIRCLE", "RING", "DIAMOND", "CLUSTER", "LEAF", "NONE"];

  function branches(cv, dp, r, pal, spines, g) {
    const many = div(1, sqrt(spines.length));
    const stemW = mul(add(4, mul(r.nextFloat(), 9)), dp, add(0.7, mul(0.3, many)), sub(1, mul(0.55, g.nervous)));
    const taperEnd = add(0.08, mul(r.nextFloat(), 0.4));
    const branchEvery = sparse(mul(add(14, mul(r.nextFloat(), 26)), dp), 0.8);
    const branchLen = mul(add(30, mul(r.nextFloat(), 75)), dp, many);
    const branchW = mul(add(1, mul(r.nextFloat(), 2.6)), dp);
    const d0 = 3 + r.nextIntUntil(3);
    const depth = amount < F(0.2) ? Math.max(2, d0 - 2) : amount < F(0.45) ? Math.max(2, d0 - 1) : d0;
    const spread = add(0.25, mul(r.nextFloat(), 0.45));
    const bend = mul(sub(mul(r.nextFloat(), 2), 1), 0.5);
    const fern = r.nextFloat() < 0.5;
    const tip = TIPS[r.nextIntUntil(TIPS.length)];
    const tipSize = mul(add(1.4, mul(r.nextFloat(), 2.6)), dp);
    const glowRoll = r.nextFloat() < 0.5;
    const glow = glowRoll && depth <= 4;
    const multicolor = r.nextFloat() < 0.5;
    const jitter = add(0.08, mul(g.nervous, 0.5));
    const lenK = add(0.7, mul(g.slow, 0.6));
    const o = { cv, jitter, spread, bend, pal, tip, tipSize, glow, r };

    for (const spine of spines) {
      const pts = spine.pts;
      let acc = 0, side = r.nextBoolean() ? 1 : -1, walked = 0;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i];
        const d = hypot(sub(b.x, a.x), sub(b.y, a.y));
        acc = add(acc, d); walked = add(walked, d);
        if (acc >= branchEvery) {
          acc = 0;
          const t = div(walked, spine.total);
          const tangent = atan2(sub(b.y, a.y), sub(b.x, a.x));
          const k = fern ? sub(1.1, mul(0.8, t)) : add(0.75, mul(r.nextFloat(), 0.5));
          const len = mul(branchLen, lenK, k);
          const colorBase = multicolor ? r.nextIntUntil(pal.accents.length) : -1;
          // unde coloana se curbează, ramurile cresc spre exteriorul curbei, nu înăuntrul ei
          const curve = curvature(pts, i);
          if (Math.abs(curve) > F(0.08)) side = curve > 0 ? -1 : 1;
          const ang = add(tangent, mul(side, add(0.9, mul(r.nextFloat(), 0.6))));
          branch(o, b.x, b.y, ang, len, branchW, depth, 0, colorBase);
          if (r.nextFloat() < (amount >= 1 ? F(0.35) : mul(0.35, amount))) {
            const ang2 = sub(tangent, mul(side, add(0.9, mul(r.nextFloat(), 0.6))));
            branch(o, b.x, b.y, ang2, mul(len, 0.7), mul(branchW, 0.8), depth - 1, 1, colorBase);
          }
          side = -side;
        }
      }
    }
    for (const spine of spines) stem(cv, spine, stemW, taperEnd, pal.stem, r);
  }

  function branch(o, x, y, angle, len, width, depth, ci, colorBase) {
    if (depth <= 0 || len < 3) return;
    const r = o.r, pal = o.pal, cv = o.cv;
    const a0 = add(angle, mul(sub(mul(r.nextFloat(), 2), 1), o.jitter));
    const a1 = add(a0, mul(o.bend, 0.6));
    const mx = add(x, mul(cos(a0), len, 0.5)), my = add(y, mul(sin(a0), len, 0.5));
    const x2 = add(mx, mul(cos(a1), len, 0.5)), y2 = add(my, mul(sin(a1), len, 0.5));
    const path = new Path();
    path.moveTo(x, y);
    path.quadTo(mx, my, x2, y2);
    stroke.color = colorBase >= 0 ? pal.accents[(colorBase + ci) % pal.accents.length] : pal.ramp[Math.min(ci, pal.ramp.length - 1)];
    stroke.width = Math.max(1, width);
    cv.drawPath(path, stroke);
    if (depth === 1) {
      const tipColor = colorBase >= 0 ? pal.accents[(colorBase + 3) % pal.accents.length] : pal.tip;
      drawTip(cv, x2, y2, a1, o.tip, o.tipSize, o.glow, tipColor, r);
      return;
    }
    const n = r.nextFloat() < F(0.7) ? 2 : 3;
    for (let i = 0; i < n; i++) {
      const s = mul(add(mul(o.spread, 0.6), mul(r.nextFloat(), o.spread)), i % 2 === 0 ? -1 : 1);
      const nextLen = mul(len, add(0.6, mul(r.nextFloat(), 0.18)));
      branch(o, x2, y2, add(a1, s), nextLen, mul(width, 0.7), depth - 1, ci + 1, colorBase);
    }
  }

  function drawTip(cv, x, y, a, tip, size, glow, color, r) {
    const rad = mul(size, add(0.7, mul(r.nextFloat(), 0.6)));
    if (glow && tip !== "NONE") {
      fill.color = withAlpha(color, 0x30);
      cv.drawCircle(x, y, mul(rad, 2.8), fill);
    }
    switch (tip) {
      case "CIRCLE": fill.color = color; cv.drawCircle(x, y, rad, fill); break;
      case "RING": stroke.color = color; stroke.width = Math.max(1, mul(rad, 0.35)); cv.drawCircle(x, y, mul(rad, 1.2), stroke); break;
      case "DIAMOND": {
        fill.color = color;
        const p = new Path();
        p.moveTo(add(x, mul(cos(a), rad, 1.7)), add(y, mul(sin(a), rad, 1.7)));
        p.lineTo(add(x, mul(cos(add(a, QUARTER)), rad)), add(y, mul(sin(add(a, QUARTER)), rad)));
        p.lineTo(sub(x, mul(cos(a), rad, 1.7)), sub(y, mul(sin(a), rad, 1.7)));
        p.lineTo(sub(x, mul(cos(add(a, QUARTER)), rad)), sub(y, mul(sin(add(a, QUARTER)), rad)));
        p.close();
        cv.drawPath(p, fill);
        break;
      }
      case "CLUSTER": {
        fill.color = color;
        const n = 3 + r.nextIntUntil(3);
        for (let i = 0; i < n; i++) {
          const ang = mul(r.nextFloat(), TAU);
          const dist = mul(r.nextFloat(), rad, 1.8);
          cv.drawCircle(add(x, mul(cos(ang), dist)), add(y, mul(sin(ang), dist)), mul(rad, 0.45), fill);
        }
        break;
      }
      case "LEAF":
        fill.color = color;
        cv.save();
        rotateAt(cv, f(a * 57.29577951308232), x, y);
        cv.drawOval(sub(x, mul(rad, 0.4)), sub(y, mul(rad, 0.9)), add(x, mul(rad, 2.6)), add(y, mul(rad, 0.9)), fill);
        cv.restore();
        break;
      default:
    }
  }

  // ---------------------------------------------------------------- familia: bule

  function bubbles(cv, dp, r, pal, spines, g, echo) {
    const many = div(1, sqrt(spines.length));
    const every = sparse(mul(add(6, mul(r.nextFloat(), 10)), dp), 1.5);   // gest puțin: bule mai rare
    const maxR = mul(add(22, mul(r.nextFloat(), 50)), dp, add(0.8, mul(g.slow, 0.5)), add(0.6, mul(0.4, many)));
    const spreadK = add(0.4, mul(r.nextFloat(), 1.2), g.nervous);
    const alphaBase = 0x50 + r.nextIntUntil(0x60);
    const outline = r.nextFloat() < F(0.4);
    const satellites = r.nextFloat() < F(0.7);
    const fruit = r.nextFloat() < F(0.35);  // câteva bule pline, opace, ca niște fructe
    const threadRoll = r.nextFloat() < F(0.6);
    const thread = threadRoll && !echo;
    const nAcc = pal.accents.length;
    for (const spine of spines) {
      if (thread) stem(cv, spine, mul(2, dp), 0.5, withAlpha(pal.stem, 0x90), r);
      const pts = spine.pts;
      let acc = 0, walked = 0;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i];
        const d = hypot(sub(b.x, a.x), sub(b.y, a.y));
        acc = add(acc, d); walked = add(walked, d);
        if (acc < every) continue;
        acc = 0;
        const t = div(walked, spine.total);
        const envelope = Math.max(sin(mul(t, PI)), F(0.15));
        const tangent = atan2(sub(b.y, a.y), sub(b.x, a.x));
        const normal = add(tangent, QUARTER);
        const off = mul(sub(mul(r.nextFloat(), 2), 1), maxR, spreadK);
        const cx = add(b.x, mul(cos(normal), off)), cy = add(b.y, mul(sin(normal), off));
        const rad = mul(maxR, envelope, add(0.3, mul(r.nextFloat(), 0.8)));
        const color = pal.accents[r.nextIntUntil(nAcc)];
        const solid = fruit && r.nextFloat() < 0.25;
        if (pearl && !echo) {
          // perla: lumină din stânga-sus, umbră spre dreapta-jos, un punct de strălucire
          const al = solid ? 0xFF : Math.max(alphaBase, 0xB8);
          fill.shader = { cx: sub(cx, mul(rad, 0.35)), cy: sub(cy, mul(rad, 0.38)), r: mul(rad, 1.35),
            colors: [withAlpha(blend(color, WHITE, 0.6), al), withAlpha(color, al), withAlpha(blend(color, BLACK, 0.42), al)], stops: [0, 0.55, 1] };
          fill.color = WHITE;
          cv.drawCircle(cx, cy, rad, fill);
          fill.shader = null;
          fill.color = withAlpha(WHITE, 0xB0);
          cv.drawCircle(sub(cx, mul(rad, 0.36)), sub(cy, mul(rad, 0.4)), mul(rad, 0.13), fill);
        } else {
          fill.color = withAlpha(color, solid ? 0xF0 : alphaBase);
          cv.drawCircle(cx, cy, rad, fill);
          if (outline) {
            stroke.color = withAlpha(color, 0xC0); stroke.width = mul(1.2, dp);
            cv.drawCircle(cx, cy, rad, stroke);
          }
          fill.color = withAlpha(pal.dark ? WHITE : pal.tip, 0x70);
          cv.drawCircle(sub(cx, mul(rad, 0.3)), sub(cy, mul(rad, 0.3)), mul(rad, 0.18), fill);
        }
        if (satellites) {
          const n = 2 + r.nextIntUntil(4);
          for (let s = 0; s < n; s++) {
            const ang = mul(r.nextFloat(), TAU);
            const dist = mul(rad, add(1.1, mul(r.nextFloat(), 1.2)));
            fill.color = withAlpha(pal.accents[r.nextIntUntil(nAcc)], alphaBase);
            cv.drawCircle(add(cx, mul(cos(ang), dist)), add(cy, mul(sin(ang), dist)), mul(rad, add(0.08, mul(r.nextFloat(), 0.2))), fill);
          }
        }
      }
    }
  }

  // ---------------------------------------------------------------- familia: cuburi

  function cubes(cv, dp, r, pal, spines, g, echo) {
    const many = div(1, sqrt(spines.length));
    const every = sparse(mul(add(9, mul(r.nextFloat(), 10)), dp), 1.2);
    const maxS = mul(add(10, mul(r.nextFloat(), 16)), dp, add(0.8, mul(g.slow, 0.4)), add(0.6, mul(0.4, many)));
    const spreadK = add(0.5, mul(r.nextFloat(), 1.1), mul(g.nervous, 0.8));
    const stackP = add(0.25, mul(r.nextFloat(), 0.4));
    const tumble = r.nextFloat() < F(0.3);
    const outline = r.nextFloat() < F(0.35);
    const threadRoll = r.nextFloat() < F(0.6);
    const thread = threadRoll && !echo;
    const crumbs = r.nextFloat() < F(0.6);
    const nAcc = pal.accents.length;
    // fiecare cub: x, y de sortare, y de desen, latură, indexul culorii, înclinare
    const list = [];
    for (const spine of spines) {
      if (thread) stem(cv, spine, mul(2, dp), 0.5, withAlpha(pal.stem, 0x90), r);
      const pts = spine.pts;
      let acc = 0, walked = 0;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i];
        const d = hypot(sub(b.x, a.x), sub(b.y, a.y));
        acc = add(acc, d); walked = add(walked, d);
        if (acc < every) continue;
        acc = 0;
        const t = div(walked, spine.total);
        const envelope = Math.max(sin(mul(t, PI)), F(0.25));
        const normal = add(atan2(sub(b.y, a.y), sub(b.x, a.x)), QUARTER);
        const side = mul(maxS, envelope, add(0.45, mul(r.nextFloat(), 0.75)));
        const off = mul(sub(mul(r.nextFloat(), 2), 1), side, spreadK);
        const cx = add(b.x, mul(cos(normal), off)), cy = add(b.y, mul(sin(normal), off));
        const color = r.nextIntUntil(nAcc);
        const l1 = r.nextFloat() < stackP ? 1 : 0;
        const l2 = r.nextFloat() < mul(stackP, 0.4) ? 1 : 0;
        const levels = 1 + l1 + l2;
        const tilt = tumble ? mul(sub(mul(r.nextFloat(), 2), 1), 26) : 0;
        for (let level = 0; level < levels; level++) list.push([cx, cy, sub(cy, mul(level, side)), side, color, tilt]);
        if (crumbs && r.nextFloat() < F(0.22)) {
          // o fărâmă: un cub mic, desprins
          const ang = mul(r.nextFloat(), TAU), dist = mul(side, add(1.6, mul(r.nextFloat(), 1.6)));
          const sx = add(cx, mul(cos(ang), dist)), sy = add(cy, mul(sin(ang), dist));
          const small = mul(side, add(0.22, mul(r.nextFloat(), 0.2)));
          list.push([sx, sy, sy, small, r.nextIntUntil(nAcc), tilt]);
        }
      }
    }
    // cele de jos acoperă pe cele de sus; la egalitate rămâne ordinea în care au apărut
    const order = list.map((c2, i) => i).sort((i, j) => (list[i][1] - list[j][1]) || (i - j));
    for (const i of order) { const c2 = list[i]; cube(cv, c2[0], c2[2], c2[3], pal.accents[c2[4]], c2[5], outline, dp, pal.dark); }
  }

  function cube(cv, cx, cy, s, color, tilt, outline, dp, dark) {
    const k = mul(0.866, s), hs = div(s, 2);
    if (tilt !== 0) { cv.save(); rotateAt(cv, tilt, cx, cy); }
    const face = (col, x1, y1, x2, y2, x3, y3, x4, y4) => {
      const p = new Path();
      p.moveTo(x1, y1); p.lineTo(x2, y2); p.lineTo(x3, y3); p.lineTo(x4, y4); p.close();
      fill.color = col;
      cv.drawPath(p, fill);
      if (outline) { stroke.color = withAlpha(blend(color, BLACK, 0.55), 0xA0); stroke.width = mul(0.7, dp); cv.drawPath(p, stroke); }
    };
    const solid = (color | (0xFF << 24)) | 0;
    face(blend(solid, WHITE, dark ? 0.25 : 0.32), cx, sub(cy, s), add(cx, k), sub(cy, hs), cx, cy, sub(cx, k), sub(cy, hs));
    face(solid, sub(cx, k), sub(cy, hs), cx, cy, cx, add(cy, s), sub(cx, k), add(cy, hs));
    face(blend(solid, BLACK, 0.34), cx, cy, add(cx, k), sub(cy, hs), add(cx, k), add(cy, hs), cx, add(cy, s));
    if (tilt !== 0) cv.restore();
  }

  // ---------------------------------------------------------------- familia: panglici

  function ribbons(cv, dp, r, pal, spines, g) {
    const many = div(1, sqrt(spines.length));
    const n = Math.max(2, thin(4 + r.nextIntUntil(5), 0.4));
    const widthMax = mul(add(50, mul(r.nextFloat(), 90)), dp, add(0.6, mul(0.4, many)));
    const weave = mul(add(0.4, mul(r.nextFloat(), 0.9)), sub(1.2, mul(g.nervous, 0.8)));
    const alphaBase = 0x40 + r.nextIntUntil(0x30);
    for (const spine of spines) {
      const pts = spine.pts;
      for (let k = 0; k < n; k++) {
        const phase = mul(r.nextFloat(), TAU);
        const freq = mul(add(0.6, mul(r.nextFloat(), 1.6)), weave);
        // amplitudini foarte diferite între fire, ca să se despartă și să se încalece
        const amp = mul(widthMax, add(0.15, mul(div(k, n), 0.85)), add(0.7, mul(r.nextFloat(), 0.6)));
        const band = mul(add(4, mul(r.nextFloat(), 12)), dp);
        const color = pal.accents[k % pal.accents.length];
        const left = [], right = [];
        let walked = 0;
        for (let i = 1; i < pts.length; i++) {
          const a = pts[i - 1], b = pts[i];
          walked = add(walked, hypot(sub(b.x, a.x), sub(b.y, a.y)));
          const t = div(walked, spine.total);
          const tangent = atan2(sub(b.y, a.y), sub(b.x, a.x));
          const nx = cos(add(tangent, QUARTER)), ny = sin(add(tangent, QUARTER));
          const env = sin(mul(t, PI));
          const wavePos = add(mul(t, freq, TAU), phase);
          const off = mul(sin(wavePos), amp, env);
          // fâșia se lățește și se îngustează pe parcurs, ca o panglică răsucită
          const half = div(mul(band, add(0.25, mul(0.75, Math.abs(cos(wavePos))))), 2);
          const cx = add(b.x, mul(nx, off)), cy = add(b.y, mul(ny, off));
          left.push(pt(add(cx, mul(nx, half)), add(cy, mul(ny, half))));
          right.push(pt(sub(cx, mul(nx, half)), sub(cy, mul(ny, half))));
        }
        if (left.length < 2) continue;
        const path = smoothPath(left);
        const back = smoothPath(right.slice().reverse());
        path.lineTo(right[right.length - 1].x, right[right.length - 1].y);
        path.addPath(back);
        path.close();
        fill.color = withAlpha(color, alphaBase);
        cv.drawPath(path, fill);
      }
      stem(cv, spine, mul(1.2, dp), 1, withAlpha(pal.tip, 0x90), r);
    }
  }

  // ---------------------------------------------------------------- familia: constelație

  /** Un punct împrăștiat în jurul gestului, cu distanța trasă dintr-un clopot. */
  function scatter(r, all, spreadPx) {
    const base = all[r.nextIntUntil(all.length)];
    const u1 = Math.max(r.nextFloat(), F(1e-4)), u2 = r.nextFloat();
    const gauss = mul(sqrt(mul(-2, ln(u1))), cos(mul(TAU, u2)));
    const ang = mul(r.nextFloat(), TAU);
    const dist = mul(Math.abs(gauss), spreadPx);
    return pt(add(base.x, mul(cos(ang), dist)), add(base.y, mul(sin(ang), dist)));
  }

  function constellation(cv, dp, r, pal, spines, g) {
    const many = div(1, sqrt(spines.length));
    const count = Math.max(8, thin((40 + r.nextIntUntil(80)) * Math.min(spines.length, 3), 0.2));
    const spreadPx = mul(add(24, mul(r.nextFloat(), 50)), dp, add(0.7, g.nervous), add(0.6, mul(0.4, many)));
    const linkDist = mul(add(40, mul(r.nextFloat(), 60)), dp);
    const all = [];
    for (const s of spines) for (const q of s.pts) all.push(q);
    const nodes = [], colors = [], sizes = [];
    for (let k = 0; k < count; k++) {
      nodes.push(scatter(r, all, spreadPx));
      colors.push(pal.accents[r.nextIntUntil(pal.accents.length)]);
      sizes.push(mul(add(1.2, mul(r.nextFloat(), 3.5)), dp));
    }
    stroke.width = mul(0.8, dp);
    const linkColor = pal.ramp[pal.ramp.length - 1];
    for (let i = 0; i < count; i++) for (let j = i + 1; j < count; j++) {
      const d = hypot(sub(nodes[i].x, nodes[j].x), sub(nodes[i].y, nodes[j].y));
      if (d < linkDist) {
        const a = coerce(trunc(mul(0x90, sub(1, div(d, linkDist)))), 0x18, 0x90);
        stroke.color = withAlpha(linkColor, a);
        cv.drawLine(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y, stroke);
      }
    }
    for (const spine of spines) stem(cv, spine, mul(2.5, dp), 0.6, withAlpha(pal.stem, 0xA0), r);
    const rings = r.nextFloat() < F(0.4);
    const big = mul(3.6, dp);
    for (let i = 0; i < count; i++) {
      const q = nodes[i], s = sizes[i];
      fill.color = withAlpha(colors[i], 0x40);
      cv.drawCircle(q.x, q.y, mul(s, 2.6), fill);
      fill.color = colors[i];
      cv.drawCircle(q.x, q.y, s, fill);
      if (rings && s > big) {
        stroke.color = withAlpha(colors[i], 0x90); stroke.width = mul(0.8, dp);
        cv.save(); rotateAt(cv, sub(mul(r.nextFloat(), 60), 30), q.x, q.y);
        cv.drawOval(sub(q.x, mul(s, 2.2)), sub(q.y, mul(s, 0.7)), add(q.x, mul(s, 2.2)), add(q.y, mul(s, 0.7)), stroke);
        cv.restore();
      }
    }
  }

  // ---------------------------------------------------------------- familia: unde

  /** Linii paralele cu gestul, care se depărtează de el și se deformează, ca straturi de teren sau valuri. */
  function waves(cv, dp, r, pal, spines, g) {
    const l0 = 7 + r.nextIntUntil(9);
    const l1 = Math.max(trunc(mul(l0, sub(1, mul(g.nervous, 0.5)))), 4);
    const lines = amount >= 1 ? l1 : Math.max(3, thin(l1, 0.4));
    const gap = mul(add(10, mul(r.nextFloat(), 12)), dp);
    // undele nu se întind la nesfârșit: dincolo de o distanță de gest se sting
    const reach = mul(add(90, mul(r.nextFloat(), 90)), dp);
    const thick = mul(add(1.4, mul(r.nextFloat(), 2.2)), dp);
    // la gesturi care se întorc peste ele, undele cresc doar dintr-o parte
    const bothSides = g.nervous < F(0.35) && r.nextFloat() < 0.75;
    for (const spine of spines) {
      const sides = bothSides ? [-1, 1] : [r.nextBoolean() ? 1 : -1];
      for (const side of sides) {
        // fiecare linie pornește din cea dinaintea ei, deplasată și netezită: cele departe sunt tot mai line
        let prev = spine.pts;
        for (let k = 1; k <= lines; k++) {
          const fade = sub(1, div(k, lines + 1));
          const phase = mul(r.nextFloat(), TAU);
          const shifted = [];
          const base = mul(gap, side);
          for (let i = 0; i < prev.length; i++) {
            const a = prev[Math.max(0, i - 2)], b = prev[Math.min(prev.length - 1, i + 2)];
            const tangent = atan2(sub(b.y, a.y), sub(b.x, a.x));
            const nx = cos(add(tangent, QUARTER)), ny = sin(add(tangent, QUARTER));
            const t = div(i, prev.length);
            const wv = mul(sin(add(mul(t, 5), phase)), gap, 0.25);
            const q = add(base, wv);
            shifted.push(pt(add(prev[i].x, mul(nx, q)), add(prev[i].y, mul(ny, q))));
          }
          let line = chaikin(chaikin(shifted));
          line = resample(line, 120);
          prev = line;
          const reachK = coerce(sub(1, div(mul(k, gap), reach)), 0, 1);
          if (reachK <= 0) break;
          drawFading(cv, line, pal.accents[k % pal.accents.length], trunc(mul(add(0x38, mul(0xA8, fade)), reachK)), mul(thick, add(0.6, mul(0.6, fade))));
        }
      }
      stem(cv, spine, mul(3, dp), 0.7, pal.stem, r);
    }
  }

  /** O linie ale cărei capete se pierd treptat, în loc să fie tăiate. */
  function drawFading(cv, pts, color, a, width) {
    if (pts.length < 4) return;
    const n = pts.length, seg = 8;
    stroke.width = width;
    let i = 0;
    while (i < n - 1) {
      const j = Math.min(n - 1, i + seg);
      const t = div(div(i + j, 2), n);
      const env = Math.min(1, mul(Math.min(t, sub(1, t)), 5));
      stroke.color = withAlpha(color, trunc(mul(a, env)));
      const path = new Path();
      path.moveTo(pts[i].x, pts[i].y);
      for (let k = i + 1; k <= j; k++) path.lineTo(pts[k].x, pts[k].y);
      cv.drawPath(path, stroke);
      i = j;
    }
  }

  // ---------------------------------------------------------------- familia: mozaic

  /** Plăci mici poligonale (Voronoi) în nuanțele paletei, dese lângă gest și rare spre margini. */
  function mosaic(cv, dp, r, pal, spines, g, echo) {
    const all = [];
    for (const s of spines) for (const q of s.pts) all.push(q);
    const count = Math.max(12, thin(echo ? 60 : 160 + r.nextIntUntil(120), 0.2));
    const spreadPx = mul(add(30, mul(r.nextFloat(), 40)), dp, add(0.7, mul(g.nervous, 0.6)));
    const seeds = [], colors = [];
    for (let k = 0; k < count; k++) {
      seeds.push(scatter(r, all, spreadPx));
      colors.push(pal.accents[r.nextIntUntil(pal.accents.length)]);
    }
    // fiecare placă: celula Voronoi aproximată prin tăierea unui pătrat cu bisectoarele vecinilor apropiați
    const cell = mul(spreadPx, 1.2);
    const gapPx = mul(1.5, dp);
    const far = mul(4, cell, cell);
    // conturul compoziției: o elipsă ușor neregulată în jurul gestului; plăcile de dincolo de ea se pierd
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const q of all) { minX = Math.min(minX, q.x); minY = Math.min(minY, q.y); maxX = Math.max(maxX, q.x); maxY = Math.max(maxY, q.y); }
    const ccx = div(add(minX, maxX), 2), ccy = div(add(minY, maxY), 2);
    const rx = add(div(sub(maxX, minX), 2), mul(spreadPx, 2.2)), ry = add(div(sub(maxY, minY), 2), mul(spreadPx, 2.2));
    const wob = mul(r.nextFloat(), TAU);
    for (let i = 0; i < count; i++) {
      const si = seeds[i];
      let poly = [pt(sub(si.x, cell), sub(si.y, cell)), pt(add(si.x, cell), sub(si.y, cell)), pt(add(si.x, cell), add(si.y, cell)), pt(sub(si.x, cell), add(si.y, cell))];
      for (let j = 0; j < count; j++) {
        if (i === j) continue;
        const dx = sub(seeds[j].x, si.x), dy = sub(seeds[j].y, si.y);
        if (add(mul(dx, dx), mul(dy, dy)) > far) continue;
        poly = clip(poly, div(add(si.x, seeds[j].x), 2), div(add(si.y, seeds[j].y), 2), dx, dy);
        if (poly.length < 3) break;
      }
      if (poly.length < 3) continue;
      // micșorăm placa spre centrul ei, ca să rămână rosturi
      let sx0 = 0, sy0 = 0;
      for (const q of poly) { sx0 += q.x; sy0 += q.y; }
      const cxp = f(sx0 / poly.length), cyp = f(sy0 / poly.length);
      const path = new Path();
      for (let k = 0; k < poly.length; k++) {
        const q = poly[k];
        const vx = sub(q.x, cxp), vy = sub(q.y, cyp);
        const len = Math.max(hypot(vx, vy), 1);
        const px = sub(q.x, mul(div(vx, len), gapPx)), py = sub(q.y, mul(div(vy, len), gapPx));
        if (k === 0) path.moveTo(px, py); else path.lineTo(px, py);
      }
      path.close();
      const dist = nearest(all, si);
      const ang = atan2(sub(si.y, ccy), sub(si.x, ccx));
      const edge = add(1, mul(0.12, sin(add(mul(ang, 3), wob))));
      const e = hypot(div(sub(si.x, ccx), mul(rx, edge)), div(sub(si.y, ccy), mul(ry, edge)));
      if (e > 1) continue;
      const rim = coerce(mul(sub(1, e), 4), 0, 1);
      const a = trunc(mul(sub(0xE0, mul(coerce(div(dist, mul(spreadPx, 2.5)), 0, 1), 0xA0)), rim));
      if (a < 8) continue;
      fill.color = withAlpha(colors[i], a);
      cv.drawPath(path, fill);
    }
  }

  function clip(poly, mx, my, nx, ny) {
    // păstrează partea de aceeași parte cu semința: (p - m) · n <= 0
    const out = [];
    for (let k = 0; k < poly.length; k++) {
      const a = poly[k], b = poly[(k + 1) % poly.length];
      const da = add(mul(sub(a.x, mx), nx), mul(sub(a.y, my), ny));
      const db = add(mul(sub(b.x, mx), nx), mul(sub(b.y, my), ny));
      if (da <= 0) out.push(a);
      if ((da <= 0) !== (db <= 0)) {
        const t = div(da, sub(da, db));
        out.push(pt(add(a.x, mul(sub(b.x, a.x), t)), add(a.y, mul(sub(b.y, a.y), t))));
      }
    }
    return out;
  }

  function nearest(pts, p) {
    let best = Infinity;
    for (const q of pts) { const d = hypot(sub(q.x, p.x), sub(q.y, p.y)); if (d < best) best = d; }
    return best;
  }

  function draw(cv, dp, r, pal, spines, g, family, echo) {
    switch (family) {
      case "BRANCHES": branches(cv, dp, r, pal, spines, g); break;
      case "BUBBLES": bubbles(cv, dp, r, pal, spines, g, echo); break;
      case "RIBBONS": ribbons(cv, dp, r, pal, spines, g); break;
      case "CONSTELLATION": constellation(cv, dp, r, pal, spines, g); break;
      case "WAVES": waves(cv, dp, r, pal, spines, g); break;
      case "MOSAIC": mosaic(cv, dp, r, pal, spines, g, echo); break;
      case "CUBES": cubes(cv, dp, r, pal, spines, g, echo); break;
      default:
    }
  }

  const long = (x) => BigInt.asIntN(64, x);

  /** Composer.render: tabloul întreg, cu ramă și semnătură, pe o pânză de w x h. */
  function render(cv, w, h, dp0, p) {
    const dp = f(dp0);
    const pl = plan(w, h, p);
    const r = pl.r, pal = pl.pal, family = pl.family, backdrop = pl.backdrop;
    const inner = innerRect(w, h, pl);
    stroke.shader = null; fill.shader = null;

    frameUnder(cv, w, h, dp, pl);
    cv.save();
    cv.clipRect(inner.left, inner.top, inner.right, inner.bottom);
    background(cv, inner, dp, r, pal, pl.texture);

    const lay = layout(p.strokes, inner, family, p.gen);
    const fitted = lay.strokes;
    const dpE = mul(dp, lay.scale);
    amount = lay.amount;
    try {
      if (fitted.length > 0) {
        const sinuous = mul(add(0.2, mul(r.nextFloat(), 0.8)), add(0.5, mul(sub(1, p.nervous), 0.8)));
        const extraSmooth = family === "RIBBONS" || family === "WAVES" ? 0.5 : 0;
        const spines = fitted.map((s) => undulate(s, sinuous, r, dpE, Math.min(1, add(p.nervous, extraSmooth))));

        if (backdrop) {
          // fundalul: cealaltă familie, mai mare și palidă, în spate
          const bScale = add(1.15, mul(r.nextFloat(), 0.25));
          cv.saveLayerAlpha(inner.left, inner.top, inner.right, inner.bottom, 0x50 + r.nextIntUntil(0x30));
          scaleAt(cv, bScale, bScale, lay.cx, lay.cy);
          draw(cv, dpE, new Random(long(p.seed * 17n + 3n)), pal, spines, p, backdrop, true);
          cv.restore();
        } else if (family !== "CALLIGRAPHY" && family !== "WAVES") {
          // ecoul: aceeași structură, mai mare și foarte palidă, în spate
          const echoAlpha = 0x14 + r.nextIntUntil(0x14);
          const echoScale = add(1.25, mul(r.nextFloat(), 0.3));
          cv.saveLayerAlpha(inner.left, inner.top, inner.right, inner.bottom, echoAlpha);
          scaleAt(cv, echoScale, echoScale, lay.cx, lay.cy);
          rotateAt(cv, mul(sub(mul(r.nextFloat(), 2), 1), 10), lay.cx, lay.cy);
          draw(cv, dpE, new Random(long(p.seed * 31n + 7n)), pal, spines, p, family, true);
          cv.restore();
        }

        if (pl.volume) {
          pearl = pl.pearl;
          // umbra moale pe hârtie: aceeași compoziție, înnegrită și mutată puțin spre dreapta-jos
          if (pl.relief) {
            cv.saveLayerShadow(inner.left, inner.top, inner.right, inner.bottom, 0.26);
            cv.translate(mul(3.5, dpE), mul(5.5, dpE));
            draw(cv, dpE, new Random(pl.drawSeed), pal, spines, p, family, false);
            cv.restore();
          }
          // neonul luminează: compoziția desenată mic și întinsă la loc devine halou
          if (pal.register === NEON) {
            for (const [k, a] of [[14, 0x70], [6, 0xA8]]) {
              const gw = Math.max(1, trunc(w / k)), gh = Math.max(1, trunc(h / k));
              const gc = cv.offscreen(gw, gh);
              gc.w = gw; gc.h = gh;
              gc.scale(f(gw / w), f(gh / h));
              draw(gc, dpE, new Random(pl.drawSeed), pal, spines, p, family, false);
              cv.drawBitmap(gc, 0, 0, w, h, a);
            }
          }
          draw(cv, dpE, new Random(pl.drawSeed), pal, spines, p, family, false);
        } else {
          draw(cv, dpE, r, pal, spines, p, family, false);
        }
      }
    } finally { amount = 1; pearl = false; fill.shader = null; }

    // semnătura, ca a unui pictor: mică, în colțul din dreapta jos
    if (p.signature && p.signature.trim().length > 0) {
      const m = Math.min(w, h);
      text.size = mul(m, 0.026);
      text.color = withAlpha(ink(pal), 0xD0);
      cv.drawText(p.signature, sub(inner.right, mul(m, 0.05)), sub(inner.bottom, mul(m, 0.05)), text);
    }
    cv.restore();
    frameOver(cv, inner, dp, pal, pl.doubleLine);
  }

  return { Random, colorToHSV, HSVToColor, blend, withAlpha, hex, Palette, pickPalette, plan, innerRect, fit, layout, paramsFromCase, planInfo,
    render, ink, Path, Recorder, Canvas2D, NullCanvas,
    ARMONIE, NEON, PASTEL, TUS, BRUT, REGISTERS, _internals: { f, F, hsv, luminance, contrast, mix, generate, wobble } };
});
