globalThis.CryptoJS = { l: {} };

CryptoJS.enc = {
  Utf8: {
    parse: (t) => {
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
        c = 0;
      for (; c < i; c += 4) n.push(r);
      t.concat(WordArray._c(n, i));
    },
  },
};

CryptoJS.mode = {
  ECB: {
    c7(t, e) {
      return {
        _c(t, e) {
          this._c = t;
          this._iv = e;
          return this;
        },
        pb(t, e) {
          this._c.v0(t, e);
        },
      }._c(t, e);
    },
  },
};

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
  m1(t) {
    for (let e in t) t.hasOwnProperty(e) && (this[e] = t[e]);
    t.hasOwnProperty("toString") && (this.toString = t.toString);
  },
  _: function (t, e) {
    Object.assign(this, WordArray);
    t = this.words = t || [];
    this.sigBytes = null != e ? e : 4 * t.length;
  },
  toString(t) {
    return (t || Hex).st(this);
  },
  concat(t) {
    let e = this.words,
      s = t.words,
      i = this.sigBytes,
      h = t.sigBytes;
    if ((this.cp(), i % 4))
      for (let t = 0; t < h; t++) {
        let h = (s[t >>> 2] >>> (24 - (t % 4) * 8)) & 255;
        e[(i + t) >>> 2] |= h << (24 - ((i + t) % 4) * 8);
      }
    else for (let t = 0; t < h; t += 4) e[(i + t) >>> 2] = s[t >>> 2];
    return (this.sigBytes += h), this;
  },
  cp() {
    let e = this.words,
      s = this.sigBytes;
    (e[s >>> 2] &= 4294967295 << (32 - (s % 4) * 8)),
      (e.length = Math.ceil(s / 4));
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
    ap(t) {
      this.twa.concat(t);
      this.nb += t.sigBytes;
    },
    p8(e) {
      let s,
        i = this.twa,
        h = i.words,
        r = i.sigBytes,
        c = this.be,
        l = r / (4 * c);
      l = e ? Math.ceil(l) : Math.max((0 | l) - this.m8, 0);
      let o = l * c,
        a = Math.min(4 * o, r);
      if (o) {
        for (let t = 0; t < o; t += c) this.k2(h, t);
        s = h.splice(0, o);
        i.sigBytes -= a;
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
      let s = this.cfg.iv;
      let i = this.cfg.mode;
      this.md = CryptoJS.mode.ECB.c7.call(i, this, s && s.words);
      this.md.c3 = CryptoJS.mode.ECB.c7;
      return this;
    },
    f5(t) {
      this.ap(t);
      return this.d9();
    },
    k2(t, e) {
      this.md.pb(t, e);
    },
    d9() {
      let e = this.cfg.padding;
      e.pad(this.twa, this.be);
      let t = this.p8(true);
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
    v0(t, e) {
      let [s, i, w, r, z, b] = [this.k4, n, c, l, o, h];
      {
        let l = this.nr9,
          o = t[e] ^ s[0],
          a = t[e + 1] ^ s[1],
          p = t[e + 2] ^ s[2],
          f = t[e + 3] ^ s[3],
          g = 4;
        for (let t = 1; t < l; t++) {
          let t =
            i[o >>> 24] ^
            w[(a >>> 16) & 255] ^
            r[(p >>> 8) & 255] ^
            z[255 & f] ^
            s[g];
          g += 1;
          let e =
            i[a >>> 24] ^
            w[(p >>> 16) & 255] ^
            r[(f >>> 8) & 255] ^
            z[255 & o] ^
            s[g];
          g += 1;
          let c =
            i[p >>> 24] ^
            w[(f >>> 16) & 255] ^
            r[(o >>> 8) & 255] ^
            z[255 & a] ^
            s[g];
          g += 1;
          let l =
            i[f >>> 24] ^
            w[(o >>> 16) & 255] ^
            r[(a >>> 8) & 255] ^
            z[255 & p] ^
            s[g];
          g += 1;
          o = t;
          a = e;
          p = c;
          f = l;
        }
        let d =
          ((b[o >>> 24] << 24) |
            (b[(a >>> 16) & 255] << 16) |
            (b[(p >>> 8) & 255] << 8) |
            b[255 & f]) ^
          s[g];
        g += 1;
        let x =
          ((b[a >>> 24] << 24) |
            (b[(p >>> 16) & 255] << 16) |
            (b[(f >>> 8) & 255] << 8) |
            b[255 & o]) ^
          s[g];
        g += 1;
        let u =
          ((b[p >>> 24] << 24) |
            (b[(f >>> 16) & 255] << 16) |
            (b[(o >>> 8) & 255] << 8) |
            b[255 & a]) ^
          s[g];
        g += 1;
        let y =
          ((b[f >>> 24] << 24) |
            (b[(o >>> 16) & 255] << 16) |
            (b[(a >>> 8) & 255] << 8) |
            b[255 & p]) ^
          s[g];
        g += 1;
        t[e] = d;
        t[e + 1] = x;
        t[e + 2] = u;
        t[e + 3] = y;
      }
    },
    encrypt(message, key, cfg) {
      let encryptor = AES.c7(key, cfg);
      let ciphertext = encryptor.f5(message);
      //   console.dir(ciphertext);
      //   process.exit();
      return st({ ct6: ciphertext });

      function st(t) {
        return t.ct6.toString({
          st(t) {
            let e,
              s,
              i = t.words,
              h = t.sigBytes,
              r = [],
              n =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            for (t.cp(), t = 0; t < h; t += 3) {
              s =
                (((i[t >>> 2] >>> (24 - (t % 4) * 8)) & 255) << 16) |
                (((i[(t + 1) >>> 2] >>> (24 - ((t + 1) % 4) * 8)) & 255) << 8) |
                ((i[(t + 2) >>> 2] >>> (24 - ((t + 2) % 4) * 8)) & 255);
              for (e = 0; e < 4 && t + 0.75 * e < h; e++)
                r.push(n.charAt((s >>> (6 * (3 - e))) & 63));
            }
            let c = n.charAt(64);
            if (c) for (; r.length % 4; ) r.push(c);
            return r.join("");
          },
        });
      }
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
// console.log(encrypt(`{abcde json:{ on:null}}`));
