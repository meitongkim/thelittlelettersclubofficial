/*
 * The Little Letterbox · letter model (schemaVersion 2)
 *
 * A saved letter is a small set of instructions, not a picture:
 *   - asset IDs (versioned) for paper, stickers, envelope, stamp, seal, postcard
 *   - the real letter text and font settings
 *   - each sticker's relative position (0..1), size (fraction of paper width),
 *     rotation and layer order
 * Ten thousand letters on Daisy paper all reference "paper.daisy@1"; the artwork
 * is stored once. Photos and personal media are NEVER part of this object: they
 * go to separate private storage (server integration required) and are only
 * referenced by opaque private IDs once uploaded and reviewed.
 */
window.TLLC_LETTER = (function () {
  var KEY = 'tllc-letterbox-letter-v2';
  var OLD_KEY = 'tllc-letterbox-draft-v1';

  var FONTS = {
    caveat: { label: 'Caveat', note: 'Handwritten', family: 'var(--font-hand)', cqw: 4.6, lh: 1.3 },
    fraunces: { label: 'Fraunces', note: 'Serif', family: 'var(--font-display)', cqw: 3.3, lh: 1.55 },
    inter: { label: 'Inter', note: 'Clean', family: 'var(--font-sans)', cqw: 3.0, lh: 1.6 }
  };
  var INKS = {
    mocha: { label: 'Mocha ink', hex: '#45261b' }, rose: { label: 'Rose ink', hex: '#9e2d4c' },
    leaf: { label: 'Leaf ink', hex: '#2f5a3a' }, sky: { label: 'Sky ink', hex: '#27506b' }
  };

  function blank() {
    return {
      schemaVersion: 2, assetSet: 'letterbox@1',
      paperId: 'paper.daisy@1', fontId: 'caveat', fontScale: 1, inkId: 'mocha', align: 'left',
      text: { greeting: 'Dear Friend,', body: '', signoff: 'With kind thoughts,\nA friend from The Little Letters Club' },
      stickers: [
        { id: 's1', assetId: 'sticker.pink_heart@1', x: 0.8, y: 0.82, scale: 0.1, rotation: -8, zIndex: 1 },
        { id: 's2', assetId: 'sticker.pink_tulip@1', x: 0.17, y: 0.84, scale: 0.09, rotation: 6, zIndex: 2 }
      ],
      envelopeId: 'envelope.blush_pink@1', stampId: 'stamp.tulip@1', sealId: 'seal.wax_heart@1',
      attachments: {
        postcard: null,           // { assetId, message }
        song: null,               // { title, artist, link }
        photos: { layoutId: 'photostrip.three@1', media: [] } // media: private IDs after server upload; never file data
      },
      pathway: 'personal', updatedAt: null
    };
  }

  // Draft format from the first prototype (percent coordinates, short sticker IDs).
  var V1_STICKERS = {
    heart: 'sticker.pink_heart@1', tulip: 'sticker.pink_tulip@1', bow: 'sticker.pink_ribbon@1', star: 'sticker.yellow_star@1',
    stamp: 'sticker.flower_stamp@1', postmark: 'sticker.postmark_waves@1', letter: 'sticker.floral_envelope@1', envSticker: 'sticker.floral_envelope@1',
    bouquet: 'sticker.bouquet@1', spread: 'sticker.spread_kindness@1', card: 'sticker.handwritten_postcard@1', cat: 'sticker.lumi_cat@1',
    daisy: 'sticker.daisy@1', sparkle: 'sticker.sparkle@1', plane: 'sticker.paper_plane@1', pen: 'sticker.pen@1', penbow: 'sticker.pen_bow@1'
  };
  var V1_PAPER = { daisy: 'paper.daisy@1', love: 'paper.love_always@1', sky: 'paper.little_blue_skies@1', garden: 'paper.garden@1' };
  var V1_ENV = { blush: 'envelope.blush_pink@1', daisy: 'envelope.daisy_cream@1', sunny: 'envelope.sunny_gingham@1', sky: 'envelope.sky_blue@1', kraft: 'envelope.daisy_cream@1' };
  var V1_FONT = { hand: 'caveat', serif: 'fraunces', sans: 'inter' };
  var V1_INK = { ink: 'mocha', rose: 'rose', sage: 'leaf', blue: 'sky' };

  function migrateV1(d) {
    var L = blank();
    L.paperId = V1_PAPER[d.paper] || L.paperId;
    L.fontId = V1_FONT[d.font] || L.fontId;
    L.fontScale = (d.size || 100) / 100;
    L.inkId = V1_INK[d.ink] || L.inkId;
    L.align = d.align || 'left';
    L.text = { greeting: d.greeting || L.text.greeting, body: d.body || '', signoff: d.signoff || L.text.signoff };
    L.stickers = (d.stickers || []).map(function (s, i) {
      return { id: s.uid || ('m' + i), assetId: V1_STICKERS[s.id] || 'sticker.pink_heart@1', x: (s.x || 50) / 100, y: (s.y || 50) / 100, scale: (s.size || 12) / 100, rotation: s.rot || 0, zIndex: i + 1 };
    });
    L.envelopeId = V1_ENV[d.envelope] || L.envelopeId;
    if (d.postcard && d.postcard.on) L.attachments.postcard = { assetId: 'postcard.blush@1', message: d.postcard.msg || '' };
    if (d.music && d.music.on) L.attachments.song = { title: d.music.title || '', artist: d.music.artist || '', link: d.music.link || '' };
    L.pathway = d.pathway || 'personal';
    return L;
  }

  function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (raw) { var L = JSON.parse(raw); if (L && L.schemaVersion === 2) return { letter: L, source: 'saved' }; }
      var old = window.localStorage.getItem(OLD_KEY);
      if (old) return { letter: migrateV1(JSON.parse(old)), source: 'migrated' };
    } catch (e) { return { letter: null, source: 'unavailable' }; }
    return { letter: null, source: 'none' };
  }

  function serialise(L) {
    var copy = JSON.parse(JSON.stringify(L));
    copy.attachments.photos = { layoutId: copy.attachments.photos.layoutId, media: [] };
    copy.updatedAt = new Date().toISOString();
    return JSON.stringify(copy);
  }

  function save(L) {
    var json = serialise(L);
    window.localStorage.setItem(KEY, json);
    try { window.localStorage.removeItem(OLD_KEY); } catch (e) {}
    return json.length;
  }

  function clear() { try { window.localStorage.removeItem(KEY); window.localStorage.removeItem(OLD_KEY); } catch (e) {} }

  function textStyle(L, paper) {
    var f = FONTS[L.fontId] || FONTS.caveat; var ink = INKS[L.inkId] || INKS.mocha;
    var i = (paper && paper.inset) || [13, 14, 12, 14];
    return 'top: ' + i[0] + '%; right: ' + i[1] + '%; bottom: ' + i[2] + '%; left: ' + i[3] + '%; font-family: ' + f.family +
      '; font-size: ' + (f.cqw * (L.fontScale || 1)).toFixed(2) + 'cqw; color: ' + ink.hex + '; text-align: ' + (L.align || 'left') + '; line-height: ' + f.lh;
  }

  function stickerStyle(s) {
    return 'left: ' + (s.x * 100).toFixed(2) + '%; top: ' + (s.y * 100).toFixed(2) + '%; width: ' + (s.scale * 100).toFixed(2) +
      '%; transform: translate(-50%, -50%) rotate(' + Math.round(s.rotation) + 'deg); z-index: ' + (5 + (s.zIndex || 0));
  }

  return { KEY: KEY, FONTS: FONTS, INKS: INKS, blank: blank, load: load, save: save, serialise: serialise, clear: clear, migrateV1: migrateV1, textStyle: textStyle, stickerStyle: stickerStyle };
})();
