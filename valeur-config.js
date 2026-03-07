/* ══════════════════════════════════════════════════════════════════
   VALEUR-CONFIG.JS v4 — Barre de progression 7 cercles premium
   © 2025 Méthode V.A.L.E.U.R© — Céline Bourbon, Psychologue
   Tous droits réservés. Reproduction interdite.
   ══════════════════════════════════════════════════════════════════ */

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

/* Définition des 7 étapes — couleurs des masques */
var STEPS_ALL = [
  { key:'module0', letter:'C', name:'Comprendre', color:'#4A90D9', url: MODULE_URLS.module0 },
  { key:'module1', letter:'V', name:'Voir',        color:'#E74C3C', url: MODULE_URLS.module1 },
  { key:'module2', letter:'A', name:'Accueillir',  color:'#E67E22', url: MODULE_URLS.module2 },
  { key:'module3', letter:'L', name:'Localiser',   color:'#F1C40F', url: MODULE_URLS.module3 },
  { key:'module4', letter:'E', name:'Explorer',    color:'#2ECC71', url: MODULE_URLS.module4 },
  { key:'module5', letter:'U', name:'Unifier',     color:'#8E44AD', url: MODULE_URLS.module5 },
  { key:'module6', letter:'R', name:'Renforcer',   color:'#D4AF37', url: MODULE_URLS.module6 }
];

/* Définition des modules 1-6 pour la compatibilité avec l'API complete() */
var MODULES_DEF = [
  { key:'module1', letter:'V', name:'VOIR',       color:'#E74C3C', lsKey:'valeur_module1_complete', emailKey:'progressM1',     doneFields:['done','module1_done'] },
  { key:'module2', letter:'A', name:'ACCUEILLIR', color:'#E67E22', lsKey:'valeur_module2_complete', emailKey:'module2Progress', doneFields:['completed'] },
  { key:'module3', letter:'L', name:'LOCALISER',  color:'#F1C40F', lsKey:'valeur_module3_complete', emailKey:'module3Progress', doneFields:['completed'] },
  { key:'module4', letter:'E', name:'EXPLORER',   color:'#2ECC71', lsKey:'valeur_module4_complete', emailKey:'module4Progress', doneFields:['completed'] },
  { key:'module5', letter:'U', name:'UNIFIER',    color:'#8E44AD', lsKey:'valeur_module5_complete', emailKey:'module5Progress', doneFields:['completed'] },
  { key:'module6', letter:'R', name:'RENFORCER',  color:'#D4AF37', lsKey:'valeur_module6_complete', emailKey:'module6Progress', doneFields:['completed'] }
];

/* ── MOTEUR PRINCIPAL ──────────────────────────────────────────── */
var VALEUR_PROGRESS = {

  _email: null,

  /* Récupère l'email de la session active (< 7 jours) */
  getEmail: function() {
    if (this._email) return this._email;
    try {
      var reg = JSON.parse(localStorage.getItem('valeur_registry') || '[]');
      for (var i = 0; i < reg.length; i++) {
        var raw = localStorage.getItem('valeur_' + reg[i].email + '_session');
        if (!raw) continue;
        var s = JSON.parse(raw);
        if (s && s.loginAt) {
          var ageDays = (Date.now() - new Date(s.loginAt).getTime()) / 86400000;
          if (ageDays < 7) { this._email = s.email; return s.email; }
        }
      }
    } catch(e) {}
    return null;
  },

  /* Vérifie si le Module 0 est complété */
  isM0Done: function(email) {
    try {
      var p = JSON.parse(localStorage.getItem('valeur_' + email + '_progress') || '{}');
      return !!(p.module0_done) || (p.completedSections || []).length >= 4;
    } catch(e) { return false; }
  },

  /* Vérifie si un module (1-6) est complété — clé email-spécifique + fallback */
  isModDone: function(email, m) {
    try {
      var p = JSON.parse(localStorage.getItem('valeur_' + email + '_' + m.emailKey) || '{}');
      for (var i = 0; i < m.doneFields.length; i++) {
        if (p[m.doneFields[i]]) return true;
      }
    } catch(e) {}
    try { if (localStorage.getItem(m.lsKey)) return true; } catch(e) {}
    return false;
  },

  /* Retourne un tableau [bool×7] : done state de chaque étape */
  getDoneStates: function() {
    var states = [false, false, false, false, false, false, false];
    var email = this.getEmail();
    if (!email) return states;
    states[0] = this.isM0Done(email);
    for (var i = 0; i < MODULES_DEF.length; i++) {
      states[i + 1] = this.isModDone(email, MODULES_DEF[i]);
    }
    return states;
  },

  /* Détecte le module actif selon l'URL */
  getCurrentStep: function() {
    var path = window.location.pathname;
    if (path.indexOf('module6') !== -1) return 6;
    if (path.indexOf('module5') !== -1) return 5;
    if (path.indexOf('module4') !== -1) return 4;
    if (path.indexOf('module3') !== -1) return 3;
    if (path.indexOf('module2') !== -1) return 2;
    if (path.indexOf('module1') !== -1) return 1;
    return 0;
  },

  /* Détecte si on est sur index.html (React GlobalNav gère la navigation) */
  isHomePage: function() {
    var p = window.location.pathname;
    return p === '/' || p === '/index.html' ||
           p.endsWith('/HomePageAppliValeur/') ||
           p.endsWith('/HomePageAppliValeur/index.html');
  },

  /* Marque un module comme complété + re-render */
  complete: function(moduleKey) {
    var email = this.getEmail();
    MODULES_DEF.forEach(function(m) {
      if (m.key !== moduleKey) return;
      try { localStorage.setItem(m.lsKey, 'true'); } catch(e) {}
      if (email) {
        try {
          var existing = JSON.parse(localStorage.getItem('valeur_' + email + '_' + m.emailKey) || '{}');
          existing.completed = true;
          existing.done = true;
          existing.doneAt = new Date().toISOString();
          localStorage.setItem('valeur_' + email + '_' + m.emailKey, JSON.stringify(existing));
        } catch(e) {}
      }
    });
    VALEUR_PROGRESS.renderBar();
  },

  /* Alias rétro-compatible */
  isDone: function(moduleKey) {
    var email = this.getEmail();
    if (moduleKey === 'module0') return email ? this.isM0Done(email) : false;
    var found = null;
    MODULES_DEF.forEach(function(m) { if (m.key === moduleKey) found = m; });
    if (!found) return false;
    return email ? this.isModDone(email, found) : !!(localStorage.getItem(found.lsKey));
  },

  getPercent: function() {
    return Math.round(this.getDoneStates().filter(Boolean).length / 7 * 100);
  },

  /* ── RENDU DE LA BARRE PREMIUM ─────────────────────────────────── */
  renderBar: function() {
    if (this.isHomePage()) return; /* React GlobalNav gère index.html */

    var bar = document.getElementById('valeur-progress-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'valeur-progress-bar';
      document.body.insertBefore(bar, document.body.firstChild);
    }

    var done = this.getDoneStates();
    var cur  = this.getCurrentStep();
    var pct  = Math.round(done.filter(Boolean).length / 7 * 100);

    var stepsHTML = '';
    for (var i = 0; i < STEPS_ALL.length; i++) {
      var s        = STEPS_ALL[i];
      var isDone   = done[i];
      var isActive = (i === cur);
      var unlocked = (i === 0) || done[i - 1];

      /* Ligne de connexion avant chaque étape (sauf la première) */
      if (i > 0) {
        var lineCls = done[i - 1] ? 'vpb-line vpb-line-done' : 'vpb-line';
        stepsHTML += '<div class="' + lineCls + '"></div>';
      }

      /* Classes et styles du cercle */
      var circleCls = 'vpb-circle';
      if (isDone)        circleCls += ' vpb-done';
      else if (isActive) circleCls += ' vpb-active';
      else if (!unlocked)circleCls += ' vpb-locked';

      var bg     = isDone ? s.color : isActive ? s.color + '28' : !unlocked ? '#0d1526' : s.color + '14';
      var border = isDone ? s.color : isActive ? '#D4AF37' : !unlocked ? '#161f33' : s.color + '55';
      var color  = isDone ? '#fff'  : isActive ? s.color   : !unlocked ? '#1e2d40' : s.color;
      var glow   = isDone ? '0 0 14px ' + s.color + '66' : isActive ? '0 0 20px #D4AF3788,0 0 40px #D4AF3733' : 'none';

      /* Navigation au clic : uniquement si module terminé (et pas l'actif) */
      var navAttr = '';
      if (isDone && !isActive) {
        navAttr = ' onclick="window.location.href=\'' + s.url + '\'" style="cursor:pointer"';
      }
      var title = isDone ? s.name + ' ✓ (terminé)' :
                  isActive ? '→ ' + s.name + ' (en cours)' :
                  !unlocked ? '🔒 Complétez le module précédent d\'abord' : s.name;

      stepsHTML += '<div class="vpb-step' + (isActive ? ' vpb-step-cur' : '') + '"' + navAttr + ' title="' + title + '">';
      stepsHTML += '<div class="' + circleCls + '" style="background:' + bg + ';border-color:' + border + ';color:' + color + ';box-shadow:' + glow + ';">';
      if (isDone)        stepsHTML += '<span class="vpb-icon">✓</span>';
      else if (!unlocked) stepsHTML += '<span class="vpb-icon" style="font-size:9px;opacity:.4">●</span>';
      else               stepsHTML += '<span class="vpb-letter">' + s.letter + '</span>';
      stepsHTML += '</div>';
      stepsHTML += '<span class="vpb-label" style="color:' + (isDone ? s.color : isActive ? s.color : !unlocked ? '#1e2d40' : s.color + '66') + ';">' + s.name + '</span>';
      stepsHTML += '</div>';
    }

    /* Décale le body uniquement quand la barre est vraiment rendue */
    document.body.style.paddingTop = '86px'; /* 62px barre + 24px breadcrumb */

    bar.innerHTML =
      '<div id="vpb-inner">' +
        '<a id="vpb-home-btn" href="' + VALEUR_BASE + '" title="Tableau de bord V.A.L.E.U.R©">&#8962;</a>' +
        '<button id="vpb-burger" onclick="VALEUR_PROGRESS._openMenu()" title="Navigation">' +
          '<span></span><span></span><span></span>' +
        '</button>' +
        '<div id="vpb-steps">' + stepsHTML + '</div>' +
        '<span id="vpb-pct">' + pct + '%</span>' +
      '</div>';

    /* ── BREADCRUMB ── */
    var bc = document.getElementById('vpb-breadcrumb');
    if (!bc) { bc = document.createElement('div'); bc.id = 'vpb-breadcrumb'; document.body.insertBefore(bc, document.body.firstChild.nextSibling || document.body.firstChild); }
    var stepNames = ['Comprendre','Voir','Accueillir','Localiser','Explorer','Unifier','Renforcer'];
    var bcHTML = '<a href="' + VALEUR_BASE + '">Accueil</a>';
    if (cur > 0) bcHTML += '<span class="vpb-bc-sep">›</span><span class="vpb-bc-cur">Module ' + cur + ' — ' + stepNames[cur] + '</span>';
    bc.innerHTML = bcHTML;
  },

  /* Alias pour compatibilité avec les modules existants */
  render: function(moduleKey) { this.renderBar(); },

  /* Ouvre le menu hamburger */
  _openMenu: function() {
    var ov = document.getElementById('vpb-overlay');
    if (ov) { ov.classList.add('vpb-open'); return; }
    var done = this.getDoneStates();
    var cur  = this.getCurrentStep();
    var labels = ['C — Comprendre','V — Voir','A — Accueillir','L — Localiser','E — Explorer','U — Unifier','R — Renforcer'];
    var urls   = [MODULE_URLS.module0,MODULE_URLS.module1,MODULE_URLS.module2,MODULE_URLS.module3,MODULE_URLS.module4,MODULE_URLS.module5,MODULE_URLS.module6];
    var colors = ['#4A90D9','#E74C3C','#E67E22','#F1C40F','#2ECC71','#8E44AD','#D4AF37'];
    var itemsHTML = '';
    for (var i = 0; i < STEPS_ALL.length; i++) {
      var isDone   = done[i];
      var isActive = (i === cur);
      var unlocked = (i === 0) || done[i - 1];
      var cls  = isDone ? 'vpb-menu-item vpb-mi-done' : isActive ? 'vpb-menu-item vpb-mi-active' : !unlocked ? 'vpb-menu-item vpb-mi-locked' : 'vpb-menu-item';
      var icon = isDone ? '✓' : !unlocked ? '🔒' : STEPS_ALL[i].letter;
      var status = isDone ? 'Complété ✓' : isActive ? 'En cours →' : !unlocked ? 'Verrouillé 🔒' : 'Disponible';
      var tag = (unlocked && !isActive) || isDone ? 'a' : 'div';
      var href = (tag === 'a') ? ' href="' + urls[i] + '"' : '';
      itemsHTML += '<' + tag + href + ' class="' + cls + '">' +
        '<div class="vpb-mi-circle" style="background:' + colors[i] + '22;border-color:' + colors[i] + '66;color:' + colors[i] + ';">' + icon + '</div>' +
        '<div class="vpb-mi-info">' +
          '<div class="vpb-mi-name">' + labels[i] + '</div>' +
          '<div class="vpb-mi-status">' + status + '</div>' +
        '</div>' +
        '</' + tag + '>';
    }
    ov = document.createElement('div');
    ov.id = 'vpb-overlay';
    ov.innerHTML =
      '<div id="vpb-overlay-head">' +
        '<span id="vpb-overlay-title">V.A.L.E.U.R©</span>' +
        '<button id="vpb-overlay-close" onclick="VALEUR_PROGRESS._closeMenu()">✕</button>' +
      '</div>' + itemsHTML;
    document.body.appendChild(ov);
    ov.classList.add('vpb-open');
  },

  _closeMenu: function() {
    var ov = document.getElementById('vpb-overlay');
    if (ov) ov.classList.remove('vpb-open');
  }
};

/* ── CSS PREMIUM ───────────────────────────────────────────────── */
(function() {
  /* Import Cormorant Garamond */
  if (!document.getElementById('vpb-gfont')) {
    var lnk = document.createElement('link');
    lnk.id  = 'vpb-gfont';
    lnk.rel = 'stylesheet';
    lnk.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&display=swap';
    document.head.appendChild(lnk);
  }
  if (document.getElementById('valeur-progress-css')) return;
  var s = document.createElement('style');
  s.id = 'valeur-progress-css';
  s.textContent = [

    /* Page fade-in */
    'body{animation:vpb-fadein .35s ease both;}',
    '@keyframes vpb-fadein{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}',

    /* padding-top appliqué dynamiquement par renderBar() — pas ici */

    /* Barre externe */
    '#valeur-progress-bar{position:fixed;top:0;left:0;right:0;z-index:9999;',
    'background:#0d1117;border-bottom:1px solid #192236;',
    'padding:6px 10px 2px;box-shadow:0 2px 20px rgba(0,0,0,.5);}',

    /* Conteneur interne */
    '#vpb-inner{max-width:800px;margin:0 auto;display:flex;align-items:center;gap:6px;}',

    /* Bouton accueil */
    '#vpb-home-btn{color:#3a5070;font-size:22px;text-decoration:none;flex-shrink:0;',
    'padding:2px 8px;border-radius:6px;line-height:1;transition:color .2s;}',
    '#vpb-home-btn:hover{color:#D4AF37;}',

    /* Conteneur étapes */
    '#vpb-steps{flex:1;display:flex;align-items:flex-end;gap:0;overflow:hidden;}',

    /* Étape individuelle */
    '.vpb-step{display:flex;flex-direction:column;align-items:center;gap:2px;',
    'flex:1;min-width:0;transition:transform .2s;}',
    '.vpb-step:not(.vpb-step-cur):hover{transform:translateY(-2px);}',

    /* Ligne de connexion */
    '.vpb-line{height:2px;flex:1;background:#121d2e;border-radius:1px;',
    'align-self:center;margin-bottom:20px;transition:background .6s ease;}',
    '.vpb-line-done{background:linear-gradient(90deg,#D4AF37,#FFD700,#D4AF37);',
    'background-size:200% auto;animation:vpb-lineshimmer 3s linear infinite;}',
    '@keyframes vpb-lineshimmer{0%{background-position:0% center}100%{background-position:200% center}}',

    /* Cercle */
    '.vpb-circle{width:30px;height:30px;border-radius:50%;display:flex;',
    'align-items:center;justify-content:center;border:2px solid;flex-shrink:0;',
    'position:relative;overflow:hidden;',
    'transition:all .4s cubic-bezier(.34,1.56,.64,1);}',

    /* Cercle actif (agrandi + halo doré) */
    '.vpb-active{width:36px!important;height:36px!important;',
    'animation:vpb-glow 2.5s ease-in-out infinite;}',
    '@keyframes vpb-glow{',
    '0%,100%{box-shadow:0 0 10px #D4AF3766,0 0 20px #D4AF3733;}',
    '50%{box-shadow:0 0 22px #D4AF37aa,0 0 44px #D4AF3766,0 0 66px #D4AF3722;}}',

    /* Shimmer doré sur cercles complétés */
    '.vpb-done::after{content:"";position:absolute;inset:0;border-radius:50%;',
    'background:linear-gradient(90deg,transparent 0%,rgba(255,215,0,.5) 50%,transparent 100%);',
    'background-size:200% 100%;animation:vpb-shimmer 2.5s linear infinite;pointer-events:none;}',
    '@keyframes vpb-shimmer{from{background-position:-200% center}to{background-position:200% center}}',

    /* Icônes et lettres */
    '.vpb-letter{font-family:"Cormorant Garamond",Georgia,serif;font-size:13px;',
    'font-weight:700;line-height:1;pointer-events:none;position:relative;z-index:1;}',
    '.vpb-icon{font-size:13px;font-weight:800;line-height:1;pointer-events:none;',
    'position:relative;z-index:1;}',

    /* Label sous le cercle */
    '.vpb-label{font-family:"Cormorant Garamond",Georgia,serif;font-size:8px;',
    'font-weight:700;letter-spacing:.3px;text-align:center;max-width:44px;',
    'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;',
    'transition:color .3s;line-height:1.2;padding-bottom:3px;}',
    '.vpb-step-cur .vpb-label{font-size:9px;}',

    /* Pourcentage */
    '#vpb-pct{font-size:11px;font-weight:800;color:#D4AF37;',
    'white-space:nowrap;min-width:28px;text-align:right;flex-shrink:0;}',

    /* ── SCROLL TO TOP ─────────────────────────────────── */
    '#vpb-scroll-top{position:fixed;bottom:22px;right:16px;',
    'width:40px;height:40px;border-radius:50%;',
    'background:linear-gradient(135deg,#c9a84c,#8a6820);',
    'color:#000;border:none;cursor:pointer;font-size:20px;font-weight:700;',
    'display:flex;align-items:center;justify-content:center;',
    'box-shadow:0 4px 16px rgba(201,168,76,.5);',
    'opacity:0;transform:translateY(10px);',
    'transition:opacity .3s,transform .3s;z-index:8888;pointer-events:none;}',
    '#vpb-scroll-top.vpb-visible{opacity:1;transform:none;pointer-events:all;}',
    '#vpb-scroll-top:hover{transform:translateY(-3px)!important;',
    'box-shadow:0 6px 22px rgba(201,168,76,.7);}',

    /* ── FOOTER COPYRIGHT ──────────────────────────────── */
    '#vpb-footer{position:fixed;bottom:0;left:0;right:0;',
    'background:rgba(10,15,26,.97);border-top:1px solid #1a2640;',
    'padding:3px 16px;text-align:center;font-size:9px;color:#3a4e66;',
    'z-index:8800;pointer-events:none;letter-spacing:.3px;}',

    /* ── BREADCRUMB ─────────────────────────────────────── */
    '#vpb-breadcrumb{position:fixed;top:62px;left:0;right:0;z-index:9998;',
    'background:#080d17;border-bottom:1px solid #141e30;',
    'padding:4px 16px;font-size:10px;color:#3a5070;letter-spacing:.3px;',
    'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
    '#vpb-breadcrumb a{color:#3a5070;text-decoration:none;transition:color .2s;}',
    '#vpb-breadcrumb a:hover{color:#D4AF37;}',
    '#vpb-breadcrumb .vpb-bc-sep{margin:0 5px;opacity:.4;}',
    '#vpb-breadcrumb .vpb-bc-cur{color:#6a8aaa;}',

    /* ── HAMBURGER BUTTON ───────────────────────────────── */
    '#vpb-burger{display:none;flex-direction:column;justify-content:center;gap:4px;',
    'background:none;border:none;cursor:pointer;padding:6px;flex-shrink:0;',
    'width:34px;height:34px;border-radius:6px;transition:background .2s;}',
    '#vpb-burger:hover{background:rgba(212,175,55,.12);}',
    '#vpb-burger span{display:block;height:2px;background:#5a7090;border-radius:1px;transition:all .25s;}',
    '#vpb-burger:hover span{background:#D4AF37;}',

    /* ── MENU OVERLAY ───────────────────────────────────── */
    '#vpb-overlay{position:fixed;inset:0;z-index:99999;background:rgba(5,8,16,.95);',
    'backdrop-filter:blur(8px);display:none;flex-direction:column;',
    'padding:24px 20px;overflow-y:auto;}',
    '#vpb-overlay.vpb-open{display:flex;}',
    '#vpb-overlay-head{display:flex;justify-content:space-between;align-items:center;',
    'margin-bottom:24px;}',
    '#vpb-overlay-title{font-family:"Cormorant Garamond",Georgia,serif;',
    'font-size:20px;font-weight:700;color:#D4AF37;letter-spacing:1px;}',
    '#vpb-overlay-close{background:none;border:1px solid #1e2d40;color:#94a3b8;',
    'font-size:22px;line-height:1;cursor:pointer;border-radius:50%;',
    'width:36px;height:36px;display:flex;align-items:center;justify-content:center;',
    'transition:all .2s;}',
    '#vpb-overlay-close:hover{border-color:#D4AF37;color:#D4AF37;}',
    '.vpb-menu-item{display:flex;align-items:center;gap:14px;padding:14px 18px;',
    'border-radius:14px;margin-bottom:8px;border:1px solid #1a2640;',
    'text-decoration:none;transition:all .25s;cursor:pointer;}',
    '.vpb-menu-item.vpb-mi-done{border-color:rgba(52,211,153,.25);background:rgba(52,211,153,.04);}',
    '.vpb-menu-item.vpb-mi-active{border-color:rgba(212,175,55,.4);background:rgba(212,175,55,.06);',
    'box-shadow:0 0 16px rgba(212,175,55,.12);}',
    '.vpb-menu-item.vpb-mi-locked{opacity:.45;cursor:default;}',
    '.vpb-menu-item:not(.vpb-mi-locked):hover{transform:translateX(4px);',
    'border-color:rgba(212,175,55,.3);}',
    '.vpb-mi-circle{width:40px;height:40px;border-radius:50%;display:flex;',
    'align-items:center;justify-content:center;font-size:14px;font-weight:800;',
    'flex-shrink:0;border:2px solid;}',
    '.vpb-mi-info{flex:1;}',
    '.vpb-mi-name{font-family:"Cormorant Garamond",Georgia,serif;font-size:15px;',
    'font-weight:700;color:#e2e8f0;margin-bottom:2px;}',
    '.vpb-mi-status{font-size:11px;color:#64748b;}',
    '.vpb-mi-done .vpb-mi-status{color:#34d399;}',
    '.vpb-mi-active .vpb-mi-status{color:#D4AF37;}',

    /* ── MICRO-INTERACTIONS GLOBALES ────────────────────── */
    /* Hover élévation + lueur dorée sur tous les boutons */
    'button:not(#vpb-scroll-top):not(#vpb-burger):not(#vpb-overlay-close){',
    'transition:transform .18s,box-shadow .18s,border-color .18s;}',
    'button:not(#vpb-scroll-top):not(#vpb-burger):not(#vpb-overlay-close):hover{',
    'transform:translateY(-2px);',
    'box-shadow:0 4px 18px rgba(212,175,55,.18)!important;}',
    /* Cards hover */
    '.card,.highlight-box,.formula-box,.peda,.access-card{transition:box-shadow .25s,transform .25s!important;}',
    '.card:hover,.highlight-box:hover,.peda:hover{',
    'box-shadow:0 8px 32px rgba(212,175,55,.12)!important;',
    'transform:translateY(-2px)!important;}',
    /* Curseur pointer partout où c'est interactif */
    'a,button,[onclick]{cursor:pointer;}',

    /* ── SCROLL SMOOTH + MARGIN ANCRES ─────────────────── */
    'html{scroll-behavior:smooth;}',
    '[id]{scroll-margin-top:80px;}',

    /* ── RESPONSIVE ────────────────────────────────────── */
    '@media(max-width:520px){',
    '.vpb-label{display:none;}',
    '.vpb-circle{width:24px;height:24px;}',
    '.vpb-active{width:30px!important;height:30px!important;}',
    '.vpb-letter,.vpb-icon{font-size:11px;}',
    '#vpb-pct{font-size:10px;}',
    '#vpb-burger{display:flex;}',
    '#vpb-steps{display:none;}',
    '#vpb-pct{display:none;}',
    '}'

  ].join('');
  document.head.appendChild(s);
})();

/* ── SCROLL TO TOP + sessionStorage ───────────────────────────── */
(function() {
  /* Restaure la position si l'utilisateur revient en arrière */
  try {
    var savedKey = 'vpb_scroll_' + window.location.pathname;
    var savedY   = parseInt(sessionStorage.getItem(savedKey) || '0', 10);
    if (savedY > 0) {
      window.addEventListener('load', function() { window.scrollTo(0, savedY); }, { once: true });
    }
  } catch(e) {}

  function addScrollTop() {
    if (document.getElementById('vpb-scroll-top')) return;
    var btn = document.createElement('button');
    btn.id = 'vpb-scroll-top';
    btn.innerHTML = '↑';
    btn.title = 'Retour en haut de la page';
    btn.setAttribute('aria-label', 'Retour en haut');
    btn.onclick = function() { window.scrollTo({ top: 0, behavior: 'smooth' }); };
    document.body.appendChild(btn);

    var scrollTimer;
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) btn.classList.add('vpb-visible');
      else btn.classList.remove('vpb-visible');
      /* Sauvegarde la position dans sessionStorage */
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function() {
        try { sessionStorage.setItem('vpb_scroll_' + window.location.pathname, window.scrollY); } catch(e) {}
      }, 300);
    }, { passive: true });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addScrollTop);
  } else {
    addScrollTop();
  }
  /* Scroll to top on fresh page load (pas de retour arrière) */
  if (!sessionStorage.getItem('vpb_scroll_' + window.location.pathname)) {
    window.scrollTo(0, 0);
  }
})();

/* ── FOOTER COPYRIGHT ──────────────────────────────────────────── */
(function() {
  function addFooter() {
    if (document.getElementById('vpb-footer') || VALEUR_PROGRESS.isHomePage()) return;
    var f = document.createElement('div');
    f.id = 'vpb-footer';
    f.innerHTML = '© Céline Bourbon &mdash; Méthode V.A.L.E.U.R© &mdash; Tous droits réservés &middot; Reproduction interdite &middot; <em>De la peur à la joie d\'être soi</em> &mdash; Éd. L\'Harmattan';
    document.body.appendChild(f);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addFooter);
  } else {
    addFooter();
  }
})();

/* ── PROTECTION ANTI-COPIE (universelle) ──────────────────────── */
(function() {
  document.addEventListener('contextmenu',  function(e) { e.preventDefault(); });
  document.addEventListener('selectstart',  function(e) { e.preventDefault(); });
  document.addEventListener('copy',         function(e) { e.preventDefault(); });
  document.addEventListener('cut',          function(e) { e.preventDefault(); });
  document.addEventListener('dragstart',    function(e) { e.preventDefault(); });
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && ['s','a','u','p','c'].includes(e.key.toLowerCase()))
      e.preventDefault();
    if (e.key === 'F12') e.preventDefault();
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i','j','c'].includes(e.key.toLowerCase()))
      e.preventDefault();
  });
})();

/* ── LANCEMENT AUTOMATIQUE ─────────────────────────────────────── */
(function() {
  var rendered = false;

  function tryRender() {
    if (rendered) return;
    if (VALEUR_PROGRESS.isHomePage()) { rendered = true; return; }
    if (document.body) {
      rendered = true;
      VALEUR_PROGRESS.renderBar();
    }
  }

  function start() {
    tryRender();
    if (rendered) return;
    var obs = new MutationObserver(function() {
      tryRender();
      if (rendered) obs.disconnect();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function() {
      if (!rendered) { rendered = true; VALEUR_PROGRESS.renderBar(); }
    }, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
