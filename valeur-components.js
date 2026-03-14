/*
 ╔══════════════════════════════════════════════════════════════╗
 ║    V.A.L.E.U.R© — COMPOSANTS RÉUTILISABLES PREMIUM         ║
 ║    Accordion intra-module + Drawer journal + Toast          ║
 ║    © Céline Bourbon — Tous droits réservés                  ║
 ╚══════════════════════════════════════════════════════════════╝

 COMPOSANTS :
  • PB_Accordion — Progressive disclosure intra-module
  • PB_JournalDrawer — Drawer unifié pour tous modules
  • PB_Toast — Notifications premium
  • PB_ModuleProgress — Indicateur progression intra-module
*/

var PB_Components = (function() {
  'use strict';

  /* ══════════════════════════════════════════════════════════════
     1. ACCORDION — Progressive Disclosure
  ══════════════════════════════════════════════════════════════ */

  var Accordion = function(containerSelector) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) {
      console.warn('[PB_Accordion] Container not found:', containerSelector);
      return;
    }
    this.items = this.container.querySelectorAll('.pb-accordion-item');
    this.init();
  };

  Accordion.prototype.init = function() {
    var self = this;
    this.items.forEach(function(item) {
      var btn = item.querySelector('.pb-accordion-btn');
      if (!btn) return;

      btn.addEventListener('click', function() {
        self.toggle(item);
      });

      /* Keyboard accessibility */
      btn.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          var next = item.nextElementSibling;
          if (next && next.classList.contains('pb-accordion-item')) {
            var nextBtn = next.querySelector('.pb-accordion-btn');
            if (nextBtn) nextBtn.focus();
          }
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          var prev = item.previousElementSibling;
          if (prev && prev.classList.contains('pb-accordion-item')) {
            var prevBtn = prev.querySelector('.pb-accordion-btn');
            if (prevBtn) prevBtn.focus();
          }
        }
      });
    });
  };

  Accordion.prototype.toggle = function(item) {
    var isOpen = item.classList.contains('open');
    if (isOpen) {
      this.close(item);
    } else {
      this.open(item);
    }
  };

  Accordion.prototype.open = function(item) {
    item.classList.add('open');
    var content = item.querySelector('.pb-accordion-content');
    if (content) {
      content.style.maxHeight = '2000px';
    }
  };

  Accordion.prototype.close = function(item) {
    item.classList.remove('open');
    var content = item.querySelector('.pb-accordion-content');
    if (content) {
      content.style.maxHeight = '0';
    }
  };

  Accordion.prototype.closeAll = function() {
    var self = this;
    this.items.forEach(function(item) {
      self.close(item);
    });
  };

  Accordion.prototype.openAll = function() {
    var self = this;
    this.items.forEach(function(item) {
      self.open(item);
    });
  };

  /* ══════════════════════════════════════════════════════════════
     2. JOURNAL DRAWER — Unifié pour tous modules
  ══════════════════════════════════════════════════════════════ */

  var JournalDrawer = function(options) {
    options = options || {};
    this.fabSelector = options.fabSelector || '#journal-fab';
    this.drawerId = options.drawerId || 'pb-journal';
    this.moduleKey = options.moduleKey || 'default';
    this.maxLength = options.maxLength || 1500;

    this.fab = document.querySelector(this.fabSelector);
    this.drawer = document.getElementById(this.drawerId);
    this.overlay = document.querySelector('[class*="overlay"][class*="journal"]');
    this.textarea = this.drawer ? this.drawer.querySelector('textarea') : null;
    this.charCount = this.drawer ? this.drawer.querySelector('.pb-char-count') : null;
    this.saveBtn = this.drawer ? this.drawer.querySelector('.pb-btn-save') : null;
    this.clearBtn = this.drawer ? this.drawer.querySelector('.pb-btn-clear') : null;

    if (!this.fab || !this.drawer) {
      console.warn('[PB_JournalDrawer] Missing FAB or Drawer');
      return;
    }

    this.init();
  };

  JournalDrawer.prototype.init = function() {
    var self = this;

    /* FAB click → Open drawer */
    this.fab.addEventListener('click', function(e) {
      e.preventDefault();
      self.open();
    });

    /* Overlay click → Close drawer */
    if (this.overlay) {
      this.overlay.addEventListener('click', function() {
        self.close();
      });
    }

    /* Textarea events */
    if (this.textarea) {
      this.textarea.addEventListener('input', function() {
        self.updateCharCount();
      });

      /* Load saved content */
      var saved = self.loadContent();
      if (saved) {
        this.textarea.value = saved;
        self.updateCharCount();
      }
    }

    /* Save button */
    if (this.saveBtn) {
      this.saveBtn.addEventListener('click', function() {
        self.save();
      });
    }

    /* Clear button */
    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', function() {
        if (confirm('Êtes-vous sûr de vouloir effacer votre journal ?')) {
          self.clear();
        }
      });
    }

    /* Keyboard: Escape to close */
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && self.drawer.classList.contains('open')) {
        self.close();
      }
    });
  };

  JournalDrawer.prototype.open = function() {
    this.drawer.classList.add('open');
    if (this.overlay) this.overlay.classList.add('open');
    if (this.textarea) this.textarea.focus();
    this.logEvent('journal_opened');
  };

  JournalDrawer.prototype.close = function() {
    this.drawer.classList.remove('open');
    if (this.overlay) this.overlay.classList.remove('open');
    this.logEvent('journal_closed');
  };

  JournalDrawer.prototype.updateCharCount = function() {
    if (!this.textarea || !this.charCount) return;
    var count = this.textarea.value.length;
    this.charCount.textContent = count + ' / ' + this.maxLength;

    /* Warning si > 80% */
    if (count > this.maxLength * 0.8) {
      this.charCount.style.color = 'rgba(229, 62, 62, 0.8)';
    } else {
      this.charCount.style.color = '';
    }
  };

  JournalDrawer.prototype.save = function() {
    if (!this.textarea) return;

    var content = this.textarea.value.trim();
    if (!content) {
      this.showToast('Votre journal est vide. Rien à enregistrer.', 'warning');
      return;
    }

    try {
      var key = 'pb_journal_' + this.moduleKey;
      localStorage.setItem(key, JSON.stringify({
        content: content,
        savedAt: new Date().toISOString(),
        module: this.moduleKey
      }));
      this.showToast('✓ Votre journal a été enregistré', 'success');
      this.logEvent('journal_saved');
    } catch (e) {
      console.error('[PB_JournalDrawer] Save failed:', e);
      this.showToast('Erreur lors de l\'enregistrement', 'error');
    }
  };

  JournalDrawer.prototype.clear = function() {
    if (!this.textarea) return;
    this.textarea.value = '';
    this.updateCharCount();
    try {
      var key = 'pb_journal_' + this.moduleKey;
      localStorage.removeItem(key);
      this.showToast('✓ Journal effacé', 'success');
      this.logEvent('journal_cleared');
    } catch (e) {
      console.error('[PB_JournalDrawer] Clear failed:', e);
    }
  };

  JournalDrawer.prototype.loadContent = function() {
    try {
      var key = 'pb_journal_' + this.moduleKey;
      var data = JSON.parse(localStorage.getItem(key) || '{}');
      return data.content || '';
    } catch (e) {
      console.error('[PB_JournalDrawer] Load failed:', e);
      return '';
    }
  };

  JournalDrawer.prototype.showToast = function(message, type) {
    type = type || 'info';
    var toast = document.querySelector('.pb-toast') || document.querySelector('.vl-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'pb-toast';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.className = 'pb-toast show ' + type;

    setTimeout(function() {
      toast.classList.remove('show');
    }, 3000);
  };

  JournalDrawer.prototype.logEvent = function(eventName) {
    try {
      console.log('[PB_Journal]', eventName, { module: this.moduleKey, timestamp: new Date().toISOString() });
    } catch (e) {}
  };

  /* ══════════════════════════════════════════════════════════════
     3. TOAST — Notifications Premium Unifiées
  ══════════════════════════════════════════════════════════════ */

  var Toast = function(options) {
    options = options || {};
    this.message = options.message || 'Message';
    this.type = options.type || 'info';  /* success | error | warning | info */
    this.duration = options.duration || 3000;
    this.container = options.container || document.body;
  };

  Toast.prototype.show = function() {
    var self = this;
    var toast = document.createElement('div');
    toast.className = 'pb-toast show ' + this.type;
    toast.textContent = this.message;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    this.container.appendChild(toast);

    setTimeout(function() {
      toast.classList.remove('show');
      setTimeout(function() {
        toast.remove();
      }, 300);
    }, this.duration);
  };

  /* ══════════════════════════════════════════════════════════════
     4. MODULE PROGRESS — Indicateur intra-module
  ══════════════════════════════════════════════════════════════ */

  var ModuleProgress = function(containerSelector) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) {
      console.warn('[PB_ModuleProgress] Container not found:', containerSelector);
      return;
    }
    this.progressBar = this.container.querySelector('progress');
  };

  ModuleProgress.prototype.update = function(current, total) {
    if (!this.progressBar) return;
    this.progressBar.value = current;
    this.progressBar.max = total;
  };

  ModuleProgress.prototype.getPercent = function() {
    if (!this.progressBar) return 0;
    return Math.round((this.progressBar.value / this.progressBar.max) * 100);
  };

  /* ══════════════════════════════════════════════════════════════
     5. CONFETTI — Mini celebration (non-intrusive)
  ══════════════════════════════════════════════════════════════ */

  var Confetti = function(options) {
    options = options || {};
    this.particleCount = options.particleCount || 50;
    this.duration = options.duration || 2000;
    this.colors = options.colors || ['#C9A84C', '#F0D080', '#E74C3C', '#2ECC71', '#8E44AD'];
  };

  Confetti.prototype.shoot = function() {
    var self = this;
    var canvas = document.getElementById('confetti-canvas') || document.createElement('canvas');
    if (!canvas.id) {
      canvas.id = 'confetti-canvas';
      document.body.appendChild(canvas);
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext('2d');

    var particles = [];
    for (var i = 0; i < this.particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 5 + 3,
        size: Math.random() * 3 + 2,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        life: 1
      });
    }

    var startTime = Date.now();

    var animate = function() {
      var elapsed = Date.now() - startTime;
      var progress = elapsed / self.duration;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(function(p) {
        p.y += p.vy;
        p.vy += 0.1;  /* Gravity */
        p.life -= progress / 100;

        if (p.life > 0) {
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        canvas.style.display = 'none';
      }
    };

    animate();
  };

  /* ══════════════════════════════════════════════════════════════
     6. PUBLIC API
  ══════════════════════════════════════════════════════════════ */

  return {
    Accordion: Accordion,
    JournalDrawer: JournalDrawer,
    Toast: Toast,
    ModuleProgress: ModuleProgress,
    Confetti: Confetti,

    /* Factory methods */
    initAccordion: function(selector) {
      return new Accordion(selector);
    },

    initJournalDrawer: function(options) {
      return new JournalDrawer(options);
    },

    showToast: function(message, type, duration) {
      var toast = new Toast({
        message: message,
        type: type,
        duration: duration
      });
      toast.show();
    },

    shootConfetti: function(options) {
      var confetti = new Confetti(options);
      confetti.shoot();
    },

    /* Version & Info */
    version: '1.0.0',
    name: 'PB_Components'
  };
})();

/* ══════════════════════════════════════════════════════════════
   AUTO-INIT (si data-auto-init="true")
══════════════════════════════════════════════════════════════ */

(function() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  function autoInit() {
    /* Auto-init accordion */
    var accordions = document.querySelectorAll('[data-accordion-init]');
    accordions.forEach(function(container) {
      PB_Components.initAccordion(container.getAttribute('data-accordion-init'));
    });

    /* Auto-init journal drawer */
    var drawerConfigs = document.querySelectorAll('[data-journal-drawer]');
    drawerConfigs.forEach(function(el) {
      var config = el.getAttribute('data-journal-drawer');
      try {
        var options = config ? JSON.parse(config) : {};
        PB_Components.initJournalDrawer(options);
      } catch (e) {
        console.warn('[PB_Components] Failed to parse journal config:', e);
      }
    });
  }
})();

console.log('✓ PB_Components loaded (v' + PB_Components.version + ')');
