//RSLight.js
/* ===============================
   Polygon-Tools für SVG im iFrame
   =============================== */

(function () {
  const IFAME_ID = 'iframe360';
  const LOGP = (...a) => console.log('[poly]', ...a);
  const WARN = (...a) => console.warn('[poly]', ...a);

  // global zugänglich:
  window.polygons = [];

  // ---------- Shadow-DOM sicher durchsuchen ----------
  function queryAllDeep(root, selector) {
    const out = [];
    const visited = new Set();

    function visit(node) {
      if (!node || visited.has(node)) return;
      visited.add(node);

      // Normale Query in diesem Knoten (falls möglich)
      if (node.querySelectorAll) {
        try {
          out.push(...node.querySelectorAll(selector));
        } catch (_) {}
      }

      // Kinder besuchen
      if (node.children) {
        for (const child of node.children) {
          // ShadowRoot?
          if (child.shadowRoot) visit(child.shadowRoot);
          visit(child);
        }
      }

      // Für ShadowRoot direkt
      if (node.host && node.host.shadowRoot) {
        visit(node.host.shadowRoot);
      }
    }

    visit(root);
    return out;
  }

  // ---------- Polygone einsammeln ----------
  function collectPolygons(doc) {
    // 1) normal (schnell)
    let found = doc.querySelectorAll('svg polygon');
    if (found && found.length) {
      window.polygons = Array.from(found);
      LOGP('Polygone gefunden (classic):', window.polygons.length);
      return true;
    }

    // 2) deep (Shadow-DOM)
    found = queryAllDeep(doc, 'polygon');
    if (found && found.length) {
      window.polygons = Array.from(found);
      LOGP('Polygone gefunden (deep/shadow):', window.polygons.length);
      return true;
    }

    return false;
  }

  // ---------- iFrame beobachten bis Polygone da sind ----------
  function watchIframeForPolygons(iframe) {
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) {
      WARN('Kein Zugriff auf iframe.document (Same-Origin prüfen?)');
      return;
    }

    LOGP('iframe geladen – suche Polygone …');

    // Sofort versuchen
    if (collectPolygons(doc)) return;

    // Observer: wartet auf dynamisch injizierte Nodes
    const obs = new MutationObserver(() => {
      if (collectPolygons(doc)) {
        obs.disconnect();
      }
    });

    obs.observe(doc.documentElement || doc, { childList: true, subtree: true });

    // Safety-Timeout (optional): nach 20s aufgeben
    setTimeout(() => {
      if (!window.polygons.length) {
        obs.disconnect();
        WARN('Nach Timeout keine Polygone gefunden.');
      }
    }, 20000);
  }

  // ---------- Globale API ----------
  window.updatePolygonAlpha = function (index, alpha) {
    const poly = window.polygons[index];
    if (!poly) {
      WARN('Kein Polygon an Index', index);
      return;
    }

    let currentFill = poly.getAttribute('fill') || '';

    // rgb/rgba(...)
    let m = currentFill.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,([\d.]+))?\)/);
    if (m) {
      poly.setAttribute('fill', `rgba(${m[1]},${m[2]},${m[3]},${alpha})`);
      return;
    }

    // #rgb / #rrggbb
    if (currentFill.startsWith('#')) {
      const hex = currentFill.length === 4
        ? '#' + [...currentFill.slice(1)].map(c => c + c).join('')
        : currentFill;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      poly.setAttribute('fill', `rgba(${r},${g},${b},${alpha})`);
      return;
    }

    // Fallback: wenn fill leer/aus CSS kommt → setze neu (behalte Farbe schwarz)
    poly.setAttribute('fill', `rgba(0,0,0,${alpha})`);
  };

  // Nur fürs Debuggen bequem:
  window.getPolygons = () => window.polygons;
  window.logPolygons = () => LOGP('aktuelle Polygone:', window.polygons.length, window.polygons);

  // ---------- Bootstrapping ----------
  function init() {
    const iframe = document.getElementById(IFAME_ID);
    if (!iframe) {
      WARN(`Kein <iframe id="${IFAME_ID}"> gefunden.`);
      return;
    }

    // Falls iFrame bereits geladen (z.B. Back/Forward Cache)
    if (iframe.contentDocument || iframe.contentWindow?.document) {
      // kurz verzögern, weil manche Viewer nach load noch rendern
      setTimeout(() => watchIframeForPolygons(iframe), 50);
    }

    // Normalfall
    iframe.addEventListener('load', () => {
      setTimeout(() => watchIframeForPolygons(iframe), 50);
    });
  }

  // Starte nach DOM bereit
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();