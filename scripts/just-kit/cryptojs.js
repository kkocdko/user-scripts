globalThis.CryptoJS = { l: {} };

CryptoJS.enc = {
  Utf8: {
    parse: (t) => {
      t = unescape(encodeURIComponent(t)); // impl this in rust?
      let e = t.length,
        s = [];
      for (let i = 0; i < e; i++)
        s[i >>> 2] |= (255 & t.charCodeAt(i)) << (24 - (i % 4) * 8);
      return new WordArray._(s, e);
    },
  },
};

CryptoJS.pad = {
  Pkcs7: {
    pad(t, e) {
      let s = 4 * e,
        i = s - (t.sigBytes % s),
        r = (i << 24) | (i << 16) | (i << 8) | i,
        n = [],
        j = 0;
      for (; j < i; j += 4) n.push(r);
      t.concat(WordArray._c(n, i));
    },
  },
};

CryptoJS.mode = { ECB: {} };

let WordArray = {
  e(t) {
    let s = Object.create(this);
    t && s.m1(t);
    (s.hasOwnProperty("_") && this._ !== s._) ||
      (s._ = function () {
        s.sa._.apply(this, arguments);
      });
    s._.prototype = s;
    s.sa = this;
    return s;
  },
  _c() {
    let t = this.e();
    return t._.apply(t, arguments), t;
  },
  _: function (t, e) {
    Object.assign(this, WordArray);
    t = this.words = t || [];
    this.sigBytes = null != e ? e : 4 * t.length;
  },
  toString(t) {
    return t.st(this);
  },
  concat(t) {
    this.cp();
    let e = this.words;
    let i = this.sigBytes;
    let s = t.words;
    let h = t.sigBytes;
    if (i % 4 != 0) {
      for (let t = 0; t < h; t++) {
        let h = (s[t >>> 2] >>> (24 - (t % 4) * 8)) & 255;
        e[(i + t) >>> 2] |= h << (24 - ((i + t) % 4) * 8);
      }
    } else {
      for (let t = 0; t < h; t += 4) {
        e[(i + t) >>> 2] = s[t >>> 2];
      }
    }
    this.sigBytes += h;
    return this;
  },
  cp() {
    let e = this.words;
    let s = this.sigBytes;
    e[s >>> 2] &= 4294967295 << (32 - (s % 4) * 8);
    e.length = Math.ceil(s / 4);
  },
};

{
  let h = [],
    r = [],
    n = [],
    c = [],
    l = [],
    o = [],
    a = [],
    p = [],
    f = [],
    g = [],
    d = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
  {
    let t = [];
    for (let e = 0; e < 256; e++) t[e] = e < 128 ? e << 1 : (e << 1) ^ 283;
    let e = 0,
      s = 0;
    for (let i = 0; i < 256; i++) {
      let i = s ^ (s << 1) ^ (s << 2) ^ (s << 3) ^ (s << 4);
      i = (i >>> 8) ^ (255 & i) ^ 99;
      h[e] = i;
      r[i] = e;
      let d = t[e],
        z = t[d],
        u = t[z],
        y = (257 * t[i]) ^ (16843008 * i);
      n[e] = (y << 24) | (y >>> 8);
      c[e] = (y << 16) | (y >>> 16);
      l[e] = (y << 8) | (y >>> 24);
      o[e] = y;
      y = (16843009 * u) ^ (65537 * z) ^ (257 * d) ^ (16843008 * e);
      a[i] = (y << 24) | (y >>> 8);
      p[i] = (y << 16) | (y >>> 16);
      f[i] = (y << 8) | (y >>> 24);
      g[i] = y;
      if (e) {
        e = d ^ t[t[t[u ^ d]]];
        s ^= t[t[s]];
      } else {
        e = s = 1;
      }
    }
  }

  let AES = {
    m8: 0,
    ivSize: 4,
    e4: 1,
    be: 4,
    ks: 8,
    m1(t) {
      for (let e in t) t.hasOwnProperty(e) && (this[e] = t[e]);
      t.hasOwnProperty("toString") && (this.toString = t.toString);
    },
    p8(e = true) {
      let s,
        l_twa = this.twa,
        l_twa_words = l_twa.words,
        l_twa_sigBytes = l_twa.sigBytes,
        l_be = this.be,
        l = l_twa_sigBytes / (4 * l_be);
      l = Math.ceil(l);
      let o = l * l_be,
        a = Math.min(4 * o, l_twa_sigBytes);
      if (o) {
        for (let i = 0; i < o; i += l_be) this.v0(l_twa_words, i);
        s = l_twa_words.splice(0, o);
        l_twa.sigBytes -= a;
      }
      return new WordArray._(s, a);
    },
    c7(key, cfg) {
      this.cfg = cfg;
      this.x7 = this.e4;
      this.kk = key;
      this.twa = new WordArray._();
      this.nb = 0;
      this._doReset();
      return this;
    },
    f5(t) {
      this.twa.concat(t);
      this.nb += t.sigBytes;
      let e = this.cfg.padding;
      e.pad(this.twa, this.be);
      t = this.p8(true);
      return t;
    },
    _doReset() {
      let l_kk = this.kk;

      let words = l_kk.words;
      let sbm4 = l_kk.sigBytes / 4;
      this.nr9 = sbm4 + 6;
      let n = 4 * (this.nr9 + 1);
      let l_k4 = (this.k4 = []);
      let l_i1 = (this.i1 = []);
      let t;
      let e;
      for (let i = 0; i < n; i++) {
        if (i < sbm4) {
          l_k4[i] = words[i];
        } else {
          t = l_k4[i - 1];
          if (i % sbm4 == 0) {
            t = (t << 8) | (t >>> 24);
            // console.log(t)
            t =
              (h[t >>> 24] << 24) |
              (h[(t >>> 16) & 255] << 16) |
              (h[(t >>> 8) & 255] << 8) |
              h[255 & t];
            t ^= d[(i / sbm4) | 0] << 24;
          } else if (sbm4 > 6 && i % sbm4 == 4) {
            t =
              (h[t >>> 24] << 24) |
              (h[(t >>> 16) & 255] << 16) |
              (h[(t >>> 8) & 255] << 8) |
              h[255 & t];
          }
          l_k4[i] = l_k4[i - sbm4] ^ t;
        }
      }
      for (let i = 0; i < n; i++) {
        e = n - i;
        l_i1[i] =
          i < 4 || e <= 4
            ? t
            : a[h[t >>> 24]] ^
              p[h[(t >>> 16) & 255]] ^
              f[h[(t >>> 8) & 255]] ^
              g[h[255 & t]];
      }
    },
    v0(l_twa_words, e) {
      let l_k4 = this.k4;
      let l_nr9 = this.nr9;
      let k = l_twa_words[e] ^ l_k4[0];
      let a = l_twa_words[e + 1] ^ l_k4[1];
      let p = l_twa_words[e + 2] ^ l_k4[2];
      let f = l_twa_words[e + 3] ^ l_k4[3];
      let g = 4;
      for (let j = 1; j < l_nr9; j++) {
        let t =
          n[k >>> 24] ^
          c[(a >>> 16) & 255] ^
          l[(p >>> 8) & 255] ^
          o[255 & f] ^
          l_k4[g];
        g += 1;
        let e =
          n[a >>> 24] ^
          c[(p >>> 16) & 255] ^
          l[(f >>> 8) & 255] ^
          o[255 & k] ^
          l_k4[g];
        g += 1;
        let m =
          n[p >>> 24] ^
          c[(f >>> 16) & 255] ^
          l[(k >>> 8) & 255] ^
          o[255 & a] ^
          l_k4[g];
        g += 1;
        let v =
          n[f >>> 24] ^
          c[(k >>> 16) & 255] ^
          l[(a >>> 8) & 255] ^
          o[255 & p] ^
          l_k4[g];
        g += 1;
        k = t;
        a = e;
        p = m;
        f = v;
      }
      let te0 =
        ((h[k >>> 24] << 24) |
          (h[(a >>> 16) & 255] << 16) |
          (h[(p >>> 8) & 255] << 8) |
          h[255 & f]) ^
        l_k4[g];
      g += 1;
      let te1 =
        ((h[a >>> 24] << 24) |
          (h[(p >>> 16) & 255] << 16) |
          (h[(f >>> 8) & 255] << 8) |
          h[255 & k]) ^
        l_k4[g];
      g += 1;
      let te2 =
        ((h[p >>> 24] << 24) |
          (h[(f >>> 16) & 255] << 16) |
          (h[(k >>> 8) & 255] << 8) |
          h[255 & a]) ^
        l_k4[g];
      g += 1;
      let te3 =
        ((h[f >>> 24] << 24) |
          (h[(k >>> 16) & 255] << 16) |
          (h[(a >>> 8) & 255] << 8) |
          h[255 & p]) ^
        l_k4[g];
      g += 1;
      l_twa_words[e + 0] = te0;
      l_twa_words[e + 1] = te1;
      l_twa_words[e + 2] = te2;
      l_twa_words[e + 3] = te3;
    },
    encrypt(message, key, cfg) {
      let encryptor = AES.c7(key, cfg);
      let l_twa = encryptor.f5(message);

      let s;
      let words = l_twa.words;
      let sigBytes = l_twa.sigBytes;
      let r = [];
      let n =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      l_twa.cp();
      for (let i = 0; i < sigBytes; i += 3) {
        s =
          (((words[i >>> 2] >>> (24 - (i % 4) * 8)) & 255) << 16) |
          (((words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 255) << 8) |
          ((words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 255);
        for (let j = 0; j < 4 && i + 0.75 * j < sigBytes; j++)
          r.push(n.charAt((s >>> (6 * (3 - j))) & 63));
      }
      let c = n.charAt(64);
      if (c) for (; r.length % 4; ) r.push(c);
      return r.join("");
    },
  };
  CryptoJS.AES = AES;
}

if (typeof exports === "object") module.exports = CryptoJS;

const encrypt = (str) => {
  const message = CryptoJS.enc.Utf8.parse(str);
  const key /* CryptoJS.MD5("zntb666666666666") */ = {
    words: [1947217763, 1550666530, -1301273701, -1041739952],
    sigBytes: 16,
  };
  const cfg = { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 };
  return btoa(CryptoJS.AES.encrypt(message, key, cfg).toString());
};
// console.log(encrypt(`{"data":{"v":123}}`));
