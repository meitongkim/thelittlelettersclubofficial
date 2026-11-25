/*
 * TLLC page runtime (static-site build).
 * Renders the site's component templates (<template data-dc="Name">) with Preact.
 * Template syntax: {{path}} lookups, <sc-for list as>, <sc-if value>, <dc-import name>,
 * JSX-style event attributes (onClick="{{fn}}"). Component logic classes extend DCLogic
 * (a Preact Component whose render() fills the template from renderVals()).
 */
(function () {
  'use strict';
  var P = window.preact, h = P.h;
  var registry = {};
  var tpls = {};

  function DCLogic(props) { P.Component.call(this, props); }
  DCLogic.prototype = Object.create(P.Component.prototype);
  DCLogic.prototype.constructor = DCLogic;
  DCLogic.prototype.render = function () {
    var vals = this.renderVals ? this.renderVals() : {};
    return renderNodes(tpls[this.constructor.__dcName], vals);
  };
  // `class X extends DCLogic` needs a real ES class parent for super() to work everywhere
  var DCBase = (function () {
    try { return new Function('Base', 'return class DCLogic extends Base {}')(P.Component); } catch (e) { return DCLogic; }
  })();
  if (DCBase !== DCLogic) {
    DCBase.prototype.render = DCLogic.prototype.render;
  }

  var LIT = /^(true|false|null|undefined|-?\d+(\.\d+)?)$/;
  function lookup(path, scope) {
    path = path.trim();
    if (LIT.test(path)) return path === 'undefined' ? undefined : JSON.parse(path);
    if (/^'.*'$|^".*"$/.test(path)) return path.slice(1, -1);
    var parts = path.split('.'), v = scope;
    for (var i = 0; i < parts.length; i++) {
      if (v === null || v === undefined) return undefined;
      v = v[parts[i]];
    }
    return v;
  }
  var WHOLE = /^\s*\{\{([^{}]+)\}\}\s*$/;
  var ANY = /\{\{([^{}]+)\}\}/g;
  function interp(str, scope) {
    return str.replace(ANY, function (_, p) { var v = lookup(p, scope); return v === null || v === undefined ? '' : String(v); });
  }
  function attrValue(raw, scope) {
    var m = raw.match(WHOLE);
    if (m) return lookup(m[1], scope);
    return raw.indexOf('{{') >= 0 ? interp(raw, scope) : raw;
  }
  function camel(s) { return s.replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); }); }
  var NOT_TEXTY_INPUT = { checkbox: 1, radio: 1, file: 1, range: 1, color: 1, submit: 1, button: 1 };

  // Templates arrive pre-parsed as JSON: a text node is a string, an element is [tag, attrs, children].
  function renderNodes(nodes, scope) {
    var out = collect(nodes, scope);
    return out.length === 1 ? out[0] : h(P.Fragment, null, out);
  }
  function collect(nodes, scope) {
    var out = [];
    for (var i = 0; i < nodes.length; i++) {
      var r = renderNode(nodes[i], scope);
      if (r === null || r === undefined) continue;
      if (Array.isArray(r)) out.push.apply(out, r); else out.push(r);
    }
    return out;
  }
  function bare(v) { return (v || '').replace(/^\s*\{\{|\}\}\s*$/g, ''); }
  function renderNode(node, scope) {
    if (typeof node === 'string') return node.indexOf('{{') >= 0 ? interp(node, scope) : node;
    var tag = node[0], attrs = node[1], children = node[2];
    if (tag === 'helmet') return null;
    if (tag === 'sc-if') return lookup(bare(attrs.value), scope) ? collect(children, scope) : null;
    if (tag === 'sc-for') {
      var list = lookup(bare(attrs.list), scope) || [], as = attrs.as || 'item', out = [];
      for (var i = 0; i < list.length; i++) {
        var s = Object.create(scope); s[as] = list[i]; s.$index = i;
        out.push.apply(out, collect(children, s));
      }
      return out;
    }
    if (tag === 'dc-import') {
      var C = registry[attrs.name], props = {};
      if (!C) return null;
      for (var k in attrs) {
        if (k === 'name' || k.indexOf('hint-') === 0) continue;
        props[camel(k)] = attrValue(attrs[k], scope);
      }
      return h(C, props);
    }
    var p = {};
    for (var n in attrs) {
      if (n.indexOf('hint-') === 0) continue;
      var v = attrValue(attrs[n], scope);
      if (n.slice(0, 2) === 'on' && n.length > 2) {
        if (typeof v !== 'function') continue;
        var ev = n.toLowerCase();
        if (ev === 'onchange' && (tag === 'textarea' || (tag === 'input' && !NOT_TEXTY_INPUT[(attrs.type || '').toLowerCase()]))) ev = 'oninput';
        p[ev] = v; continue;
      }
      if (v === undefined || v === null || v === false) {
        if (n === 'checked' && v === false) p.checked = false;
        continue;
      }
      p[n] = v;
    }
    return h(tag, p, collect(children, scope));
  }

  window.TLLC = {
    DCLogic: DCBase,
    define: function (name, factory) {
      var C = factory(DCBase);
      C.__dcName = name;
      registry[name] = C;
      return C;
    },
    start: function (rootName, mount) {
      document.querySelectorAll('script[type="application/x-tllc-template"]').forEach(function (t) { tpls[t.getAttribute('data-dc')] = JSON.parse(t.textContent); });
      P.render(h(registry[rootName], {}), mount);
    }
  };
})();
