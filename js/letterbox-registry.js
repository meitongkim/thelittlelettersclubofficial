/*
 * The Little Letterbox · versioned asset registry
 * Asset set: letterbox@1 (from TLLC_Letterbox_Asset_Pack v1)
 *
 * Every public brand asset has a stable, versioned ID (e.g. "paper.daisy@1").
 * Letters store these IDs, never copies of the artwork. When artwork changes,
 * ADD a new version ("paper.daisy@2") and keep the old one, so existing letters
 * still render with their original stationery. Pickers show the latest version.
 *
 * Tiers:
 *   preview : small WebP for pickers (paper 5–14 KB, stickers 8–28 KB)
 *   editor  : editor-sized WebP, loaded only when a visitor selects/adds the asset
 *   master  : full-resolution PNGs stay in the source pack for print/export; the
 *             live site never loads them.
 * Private material (photos, personal media) never lives here: it belongs in
 * separate private storage with access control and moderation.
 */
window.TLLC_LETTERBOX_REGISTRY = (function () {
  var B = function (id) { return '/assets/' + id + ((window.TLLC_ASSET_EXT || {})[id] || '.png'); };
  var t = function (id, bytes, w, h) { return { url: B(id), bytes: bytes || 0, w: w || 0, h: h || 0 }; };
  var assets = {
    // ---------- paper (bottom layer; typed text is rendered above it as real text) ----------
    'paper.daisy@1': { kind: 'paper', label: 'Daisy', desc: 'Cheerful florals for brighter days.', inset: [13, 15, 12, 15],
      tiers: { preview: t('3fc71b7920e49b759ec6508db02bcc30', 12430, 600, 800), editor: t('9e5c1e070c98f3f6c9aca95a236c4105', 16106, 900, 1200) } },
    'paper.love_always@1': { kind: 'paper', label: 'Love, Always', desc: 'Hearts, bows and warm wishes.', inset: [13, 16, 12, 16],
      tiers: { preview: t('151f7cd336420188a7795d7ca030ed33', 8440, 600, 800), editor: t('8bc0cef6a01f994952bc0dcd02b00209', 9956, 900, 1200) } },
    'paper.little_blue_skies@1': { kind: 'paper', label: 'Little Blue Skies', desc: 'Soft skies and hopeful days.', inset: [13, 12, 14, 12],
      tiers: { preview: t('c164228bc3cd5360f8a35281bb458e7d', 5488, 600, 800), editor: t('330d1af10d11188a777ad7034e5fb5cd', 6864, 900, 1200) } },
    'paper.garden@1': { kind: 'paper', label: 'Garden', desc: 'Leaves, blossoms and gentle growth.', inset: [12, 15, 13, 15],
      tiers: { preview: t('590528bfdc47b96a28edc6c4fb6cb43b', 14080, 600, 800), editor: t('8127eae5fdf92541c93de429312c72be', 19226, 900, 1200) } },
    'paper.classic_post@1': { kind: 'paper', label: 'Classic Post', desc: 'Timeless lined paper for any day.', inset: [16, 12, 12, 12],
      tiers: { preview: t('65d03bbf8916a6355b5d5e40c922c220', 8592, 600, 800), editor: t('082d493355bc2c363ba723bd9ea49b2a', 10650, 900, 1200) } },

    // ---------- stickers (transparent; movable layers above text) ----------
    'sticker.lumi_cat@1': { kind: 'sticker', label: 'Lumi', tiers: { preview: t('9ec7f80cd8dfe5afe199bf62043b5e1a', 18282), editor: t('c412b5e178d77335dfd635860a42dd6e', 44112) } },
    'sticker.lumi_full@1': { kind: 'sticker', label: 'Lumi with a letter', tiers: { preview: t('e8221ad41b1d5002775d895acc2df7cb', 18870), editor: t('4c452092456d92bcb0ff087a3636a4cf', 54790) } },
    'sticker.pink_heart@1': { kind: 'sticker', label: 'Pink heart', tiers: { preview: t('89332421400699700b1af6a190a2ef65', 8874), editor: t('236c5860d52b67db29f9322560ca752d', 8910) } },
    'sticker.pink_tulip@1': { kind: 'sticker', label: 'Pink tulip', tiers: { preview: t('ee81f3c799e637029141180e396c6d2f', 13846), editor: t('be90f4d1b4f7b94b9e179113066dbf7d', 18708) } },
    'sticker.pink_ribbon@1': { kind: 'sticker', label: 'Pink ribbon', tiers: { preview: t('7ff8ffb7fc2a12ca08226054f37874c0', 21396), editor: t('f1def6b9ca849cb0fcedf79a60f5d6c3', 21954) } },
    'sticker.yellow_star@1': { kind: 'sticker', label: 'Yellow star', tiers: { preview: t('f00083a3ec14e20f005fd5cd0ebbbf7e', 10264), editor: t('881d162d68c3d1e1d6524d40af3d39e8', 9474) } },
    'sticker.bouquet@1': { kind: 'sticker', label: 'Bouquet', tiers: { preview: t('07d2a52be376e70ff9a17be75db10c7b', 25242), editor: t('a9bbf7ae219cf37761592a60b5a803a3', 22404) } },
    'sticker.tulip_bouquet_full@1': { kind: 'sticker', label: 'Tulip bouquet', tiers: { preview: t('f70f4ffb2f9050fd04578739b48f6bae', 28422), editor: t('14c6d622f65b3e3ef88db987e97b28fa', 84454) } },
    'sticker.floral_envelope@1': { kind: 'sticker', label: 'Floral envelope', tiers: { preview: t('a3554ad343d55b60f7157c0b4962c3ad', 21024), editor: t('77920ecc1b115e447e92be8b1e81579b', 33492) } },
    'sticker.envelope_full@1': { kind: 'sticker', label: 'Envelope', tiers: { preview: t('33586e047fefb51efd4b6042a063306f', 20138), editor: t('3bfd3c04df622a23860ed6af65f1b650', 53538) } },
    'sticker.flower_stamp@1': { kind: 'sticker', label: 'Flower stamp', tiers: { preview: t('bb75b8ab86c0b213624a9a341dc3c57a', 20926), editor: t('e71473d064191486de828b53570adb8f', 21016) } },
    'sticker.postmark_waves@1': { kind: 'sticker', label: 'Postmark', tiers: { preview: t('ea52f078569bcf1b9fe7df6c07378240', 15532), editor: t('c4ec61adeccc2b1b2f0e3d295d654e3e', 14222) } },
    'sticker.handwritten_postcard@1': { kind: 'sticker', label: 'Postcard', tiers: { preview: t('cfd62d7709b27c110ae2638ecfc3724d', 16888), editor: t('e127984f7b157f475c27caf02d1d263e', 21350) } },
    'sticker.spread_kindness@1': { kind: 'sticker', label: 'Spread kindness', tiers: { preview: t('306c73e5c19bf4b00f2205951b228c63', 18010), editor: t('b2bc7cffe3540d727f7fc3965b3cf88a', 22694) } },
    'sticker.daisy@1': { kind: 'sticker', label: 'Daisy', tiers: { preview: t('ddfeee74de178b943d676f14636aff05', 23610), editor: t('fb7aed13d14cca207f449f8a33819567', 48660) } },
    'sticker.sparkle@1': { kind: 'sticker', label: 'Sparkle', tiers: { preview: t('3d14025a0ee394f245eb539ebaa6d849', 27214), editor: t('7f865e1629ec3b8e3a72487d2f3965a8', 47564) } },
    'sticker.paper_plane@1': { kind: 'sticker', label: 'Paper plane', tiers: { preview: t('97f7070fb41bf61cd71e2bebf94d7ff8', 14198), editor: t('f0c3d3c72dc871d103bd061c8e22f8e9', 40636) } },
    'sticker.pen@1': { kind: 'sticker', label: 'Pen', tiers: { preview: t('e5b97ba2c28351efacbf3c2a1a9e5001', 11772), editor: t('021040e6d1305a54d26d42263ab7ee7b', 33500) } },
    'sticker.pen_bow@1': { kind: 'sticker', label: 'Pen with bow', tiers: { preview: t('3014d2a571b674e3d1679e3a4274a276', 15884), editor: t('9d9ef660138fc504a9050eb451d5f99a', 39000) } },

    // ---------- envelopes: separate back / front / flap SVG layers for the fold animation ----------
    'envelope.blush_pink@1': { kind: 'envelope', label: 'Blush Pink', swatch: '#F6C4CF', layers: { back: t('a13ce0fc6a2ac5aad60c8c7f5e4bc379', 344), front: t('b6337741227012c4f114776ab243466c', 653), flap: t('b5878e7a74f9f4d11c7212dade0447bd', 391) } },
    'envelope.daisy_cream@1': { kind: 'envelope', label: 'Daisy Cream', swatch: '#F5EBD0', layers: { back: t('6d58df46fb088256dcc0f9311fa90fce', 344), front: t('64eca1bb91b0ef72d849a35b17098b69', 653), flap: t('a5fa0da0f0d5311b7c2e37381cb06ab0', 391) } },
    'envelope.sky_blue@1': { kind: 'envelope', label: 'Sky Blue', swatch: '#CFE3EF', layers: { back: t('d2459a5022302e593d0261b0c8fe4716', 344), front: t('a0df6da3e900addb7ef1f68a51490c4a', 653), flap: t('9e9bf59ec363326c1caf396379b5ec71', 391) } },
    'envelope.sage_green@1': { kind: 'envelope', label: 'Sage Green', swatch: '#D7E6D5', layers: { back: t('97aa78be327353ff41bbfc68ee812ac4', 344), front: t('52e95fa7e7063ecea995fa8ff591f007', 653), flap: t('e98ee9022f274f0bca79c4687f4ca035', 391) } },
    'envelope.sunny_gingham@1': { kind: 'envelope', label: 'Sunny Gingham', swatch: '#FCEFC2', layers: { back: t('a90b25ecdab3a465f02db5b8bca92e87', 344), front: t('e8dd41ac75733809ffb13f7f9902bb6e', 653), flap: t('4906c758d4ac139be607c00b6131b1db', 391) } },

    // ---------- stamps and seals (decorative, not real postage) ----------
    'stamp.tulip@1': { kind: 'stamp', label: 'Tulip', tiers: { editor: t('3b332e91a349aa311005e606609b7dae', 10352) } },
    'stamp.daisy@1': { kind: 'stamp', label: 'Daisy', tiers: { editor: t('f8789155e2e28bc830b3e39fd96ac131', 9356) } },
    'stamp.heart@1': { kind: 'stamp', label: 'Heart', tiers: { editor: t('1f6942d3f9c9f9e49c26fbb2705d9c2a', 7852) } },
    'stamp.lumi@1': { kind: 'stamp', label: 'Lumi', tiers: { editor: t('5c41df6e95e4a27bb150e2770a69a8d7', 11126) } },
    'stamp.star@1': { kind: 'stamp', label: 'Star', tiers: { editor: t('9165ca1f0fed9b9aadc86a1aebdbe67a', 6266) } },
    'seal.wax_heart@1': { kind: 'seal', label: 'Wax heart', tiers: { editor: t('4e5b7ea0a7558f2113ee1b0b4792fbf1', 5235) } },

    // ---------- add-ons ----------
    'postcard.blush@1': { kind: 'postcard', label: 'Blush', tiers: { front: t('14e3daf6bd8c7b6f9aab998f191b6bf9', 9760), back: t('c1fb9b711a777e60a2894f3cea44d6ab', 3968) } },
    'postcard.warm_cream@1': { kind: 'postcard', label: 'Warm cream', tiers: { front: t('bbc8354548b7594caf9c4b403c4665ce', 9764), back: t('4c7778a13a646e325720e20716a56184', 3930) } },
    'photostrip.three@1': { kind: 'photostrip', label: '3-photo strip', ratio: '500 / 1120', tiers: { editor: t('80596b6ace9c0124989d6c166b6baa47', 16369) },
      windows: [[11.6, 5.27, 77, 25.7], [11.6, 33.84, 77, 25.7], [11.6, 62.41, 77, 25.7]] },
    'photostrip.four@1': { kind: 'photostrip', label: '4-photo strip', ratio: '500 / 1370', tiers: { editor: t('809d8cde682d5f567401dd9963599500', 19519) },
      windows: [[11.6, 4.31, 77, 19.7], [11.6, 26.35, 77, 19.7], [11.6, 48.39, 77, 19.7], [11.6, 70.44, 77, 19.7]] },
    'music.tulip_card@1': { kind: 'music', label: 'Tulip song card', tiers: { editor: t('188c4797ac8af4bda48b6f2f86bbd5c5', 6784) } },

    // ---------- cursors (desktop only; native cursors remain the fallback) ----------
    'cursor.pen@1': { kind: 'cursor', label: 'Pen', hotspot: [23, 29], tiers: { editor: t('c05a2263ef4ac9992d56f322e3a848e8', 1847) } },
    'cursor.envelope@1': { kind: 'cursor', label: 'Envelope', hotspot: [4, 6], tiers: { editor: t('3d98521adbdefa3cd828776852327b60', 1491) } },
    'cursor.flower@1': { kind: 'cursor', label: 'Flower', hotspot: [16, 16], tiers: { editor: t('42b7fd37a8e91c4a198deac46a195acf', 2531) } },
    'cursor.heart@1': { kind: 'cursor', label: 'Heart', hotspot: [16, 16], tiers: { editor: t('fff94b3cd841b7bb7039068110848cac', 1755) } },
    'cursor.sparkle@1': { kind: 'cursor', label: 'Sparkle', hotspot: [16, 16], tiers: { editor: t('4b9497a9cee5da1363e33f5c6f1fb33b', 1802) } }
  };

  // Map each base ID to its newest version (pickers use this; saved letters keep their exact version).
  var latest = {};
  Object.keys(assets).forEach(function (id) {
    var parts = id.split('@'); var base = parts[0]; var v = parseInt(parts[1] || '1', 10);
    var cur = latest[base]; if (!cur || parseInt(cur.split('@')[1], 10) < v) latest[base] = id;
  });

  function resolve(ref) {
    if (!ref) return null;
    if (assets[ref]) return Object.assign({ id: ref }, assets[ref]);
    var base = String(ref).split('@')[0];
    return latest[base] ? Object.assign({ id: latest[base], fallback: true }, assets[latest[base]]) : null;
  }
  function list(kind) {
    return Object.keys(latest).map(function (b) { return latest[b]; })
      .filter(function (id) { return assets[id].kind === kind; })
      .map(function (id) { return Object.assign({ id: id }, assets[id]); });
  }
  return { set: 'letterbox@1', assets: assets, latest: latest, resolve: resolve, list: list };
})();
