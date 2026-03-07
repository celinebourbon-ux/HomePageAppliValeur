/* ══════════════════════════════════════════════════════════════
   VALEUR-CONFIG.JS v3 — Auto-init avec MutationObserver
   © 2025 Methode V.A.L.E.U.R© — Celine Bourbon, Psychologue
   NE RIEN MODIFIER DANS LES MODULES — ce fichier gere tout.
   ══════════════════════════════════════════════════════════════ */

var VALEUR_BASE = 'https://celinebourbon-ux.github.io/HomePageAppliValeur/';

var MODULE_URLS = {
  home:    VALEUR_BASE,
  module0: VALEUR_BASE + 'index.html',
  module1: VALEUR_BASE + 'module1.html',
  module2: VALEUR_BASE + 'module2.html',
  module3: VALEUR_BASE + 'module3.html',
  module4: VALEUR_BASE + 'module4.html',
  module5: VALEUR_BASE + 'module5.html',
  module6: VALEUR_BASE + 'module6.html'
};

var MODULES_DEF = [
  { key:'module1', letter:'V', name:'VOIR',       color:'#e53e3e', lsKey:'valeur_module1_complete' },
  { key:'module2', letter:'A', name:'ACCUEILLIR', color:'#ed8936', lsKey:'valeur_module2_complete' },
  { key:'module3', letter:'L', name:'LOCALISER',  color:'#d69e2e', lsKey:'valeur_module3_complete' },
  { key:'module4', letter:'E', name:'EXPLORER',   color:'#38a169', lsKey:'valeur_module4_complete' },
  { key:'module5', letter:'U', name:'UNIFIER',    color:'#3182ce', lsKey:'valeur_module5_complete' },
  { key:'module6', letter:'R', name:'RENFORCER',  color:'#805ad5', lsKey:'valeur_module6_complete' }
];

var VALEUR_PROGRESS = {

  getPercent: function() {
    var done = 0;
    MODULES_DEF.forEach(function(m) {
      try { if (localStorage.getItem(m.lsKey)) done++; } catch(e) {}
    });
    return Math.round((done / MODULES_DEF.length) * 100);
  },

  complete: function(moduleKey) {
    MODULES_DEF.forEach(function(m) {
      if (m.key === moduleKey) {
        try { localStorage.setItem(m.lsKey, 'true'); } catch(e) {}
      }
    });
    VALEUR_PROGRESS.renderBar();
  },

  isDone: function(moduleKey) {
    var result = false;
    MODULES_DEF.forEach(function(m) {
      if (m.key === moduleKey) {
        try { result = !!localStorage.getItem(m.lsKey); } catch(e) {}
      }
    });
    return result;
  },

  getCurrentModule: function() {
    var path = window.location.pathname;
    if (path.indexOf('module6') !== -1) return 'module6';
    if (path.indexOf('module5') !== -1) return 'module5';
    if (path.indexOf('module4') !== -1) return 'module4';
    if (path.indexOf('module3') !== -1) return 'module3';
    if (path.indexOf('module2') !== -1) return 'module2';
    if (path.indexOf('module1') !== -1) return 'module1';
    return 'module0';
  },

  renderBar: function() {
    var currentModule = this.getCurrentModule();
    var bar = document.getElementById('valeur-progress-bar');

    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'valeur-progress-bar';
      document.body.insertBefore(bar, document.body.firstChild);
    }

    var self = this;
    var pct = this.getPercent();
    var stepsHTML = '';

    MODULES_DEF.forEach(function(m) {
      var isDone = self.isDone(m.key);
      var isCurrent = m.key === currentModule;
      var cls = 'vpb-step';
      if (isDone) cls += ' done';
      else if (isCurrent) cls += ' active';
      var click = (isDone && !isCurrent) ? ' onclick="window.location.href=MODULE_URLS.' + m.key + '"' : '';
      var cursor = (isDone && !isCurrent) ? 'pointer' : 'default';
      stepsHTML += '<div class="' + cls + '" style="cursor:' + cursor + '"' + click + '>';
      stepsHTML += '<span class="vpb-letter">' + m.letter + '</span></div>';
    });

    bar.innerHTML =
      '<button class="vpb-home" onclick="window.location.href=MODULE_URLS.home" title="Accueil">&#8962;</button>' +
      '<div class="vpb-steps">' + stepsHTML + '</div>' +
      '<span class="vpb-pct">' + pct + '%</span>';
  },

  /* Alias pour compatibilite avec les modules existants */
  render: function(moduleKey) { this.renderBar(); }
};

/* ── CSS ──────────────────────────────────────────────────────── */
(function() {
  if (document.getElementById('valeur-progress-css')) return;
  var style = document.createElement('style');
  style.id = 'valeur-progress-css';
  style.textContent =
    '#valeur-progress-bar{position:fixed;top:0;left:0;right:0;z-index:9999;' +
    'background:#0d1526;border-bottom:1px solid #1e2f4a;' +
    'padding:10px 16px;display:flex;align-items:center;gap:12px;' +
    "font-family:'Jost',sans-serif;}" +
    '.vpb-home{background:none;border:none;cursor:pointer;' +
    'color:#6b82a8;font-size:18px;padding:4px;transition:color 0.2s;line-height:1;}' +
    '.vpb-home:hover{color:#f2ede6;}' +
    '.vpb-steps{display:flex;gap:6px;flex:1;align-items:center;}' +
    '.vpb-step{flex:1;height:28px;border-radius:6px;background:#1e2f4a;' +
    'display:flex;align-items:center;justify-content:center;transition:all 0.4s ease;}' +
    '.vpb-step.done{background:linear-gradient(135deg,#c9a84c,#f0d080);' +
    'box-shadow:0 2px 8px rgba(201,168,76,0.3);}' +
    '.vpb-step.active{background:linear-gradient(135deg,#1e2f4a,#2a3f60);' +
    'border:1px solid #c9a84c;animation:vpb-pulse 2s ease-in-out infinite;}' +
    '@keyframes vpb-pulse{0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,0.4);}' +
    '50%{box-shadow:0 0 0 4px rgba(201,168,76,0);}}' +
    '.vpb-letter{font-size:11px;font-weight:800;letter-spacing:1px;color:#f2ede6;}' +
    '.vpb-step.done .vpb-letter{color:#070d1a;}' +
    '.vpb-pct{font-size:12px;font-weight:700;color:#c9a84c;' +
    'white-space:nowrap;min-width:32px;text-align:right;}' +
    '@media(max-width:400px){.vpb-letter{font-size:9px;}.vpb-step{height:22px;}}';
  document.head.appendChild(style);
})();

/* ── LANCEMENT AUTOMATIQUE — MutationObserver ─────────────────────
   Attend que React finisse de construire le DOM puis injecte la barre.
   Fonctionne meme si render() n'est pas appele dans le module.      */
(function() {
  var rendered = false;

  function tryRender() {
    if (rendered) return;
    /* Attend que #root soit peuple par React */
    var root = document.getElementById('root');
    if (root && root.children.length > 0) {
      rendered = true;
      VALEUR_PROGRESS.renderBar();
      return;
    }
    /* Si pas de #root (page simple sans React) */
    if (!root && document.body) {
      rendered = true;
      VALEUR_PROGRESS.renderBar();
    }
  }

  /* Observer qui surveille les changements dans le body */
  function startObserver() {
    tryRender();
    if (rendered) return;

    var observer = new MutationObserver(function() {
      tryRender();
      if (rendered) observer.disconnect();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    /* Filet de securite : apres 3 secondes max */
    setTimeout(function() {
      if (!rendered) {
        rendered = true;
        VALEUR_PROGRESS.renderBar();
      }
    }, 3000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserver);
  } else {
    startObserver();
  }
})();
