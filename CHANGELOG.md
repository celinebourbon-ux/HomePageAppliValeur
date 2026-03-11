# CHANGELOG — App V.A.L.E.U.R©

## Audit & Correction — 2026-03-11

---

## AXE 1 — Bugs de progression (critiques)

### valeur-config.js
- **`isM0Done()` fallback** (l. 65) : ajout d'un check direct `localStorage.getItem('valeur_module0_complete') === 'true'` avant la vérification email-spécifique. Garantit que la complétion de M0 est correctement détectée par la barre de progression.

### module0.html
- **Bug A+C** (l. 894) : `localStorage.setItem('VALEUR_module0_complete','1')` → `localStorage.setItem('valeur_module0_complete','true')`. Correction de la casse (MAJUSCULES → minuscules) et standardisation de la valeur (`'1'` → `'true'`). Ce bug empêchait le déverrouillage du Module 1.

### module1.html
- **completeModule()** (l. 1359) : ajout de `localStorage.setItem('valeur_module1_complete','true')` et `VALEUR_PROGRESS.complete('module1')`. Correction du texte copié-collé "Module 3 Validé" → "Module 1 — VOIR — Validé !".

### module2.html
- **completeModule()** (l. 1957) : ajout de `localStorage.setItem('valeur_module2_complete','true')` et `VALEUR_PROGRESS.complete('module2')`. Correction du texte "Module 3 Validé" → "Module 2 — ACCUEILLIR — Validé !".

### module3.html
- **Bug B** — **completeModule()** (l. 1866) : ajout de `localStorage.setItem('valeur_module3_complete','true')` et `VALEUR_PROGRESS.complete('module3')`. La fonction n'écrivait aucune clé localStorage, rendant le déverrouillage du Module 4 impossible.

### module4.html
- **completeModule()** (l. 2207) : ajout de `localStorage.setItem('valeur_module4_complete','true')` et `VALEUR_PROGRESS.complete('module4')`. Correction du texte "Module 3 Validé" → "Module 4 — EXPLORER — Validé !".

### module5.html
- **completeModule()** (l. 1614) : ajout de `localStorage.setItem('valeur_module5_complete','true')` et `VALEUR_PROGRESS.complete('module5')`. Correction du texte "Module 3 Validé" → "Module 5 — UNIFIER — Validé !".

### module6.html
- **Bug CRITIQUE — fonctions dupliquées** (l. 1530 + 1701) : la deuxième déclaration de `function completeModule()` écrasait la première (code mort). La première définissait le `localStorage.setItem`, la seconde ne faisait que les effets visuels. **Fusion des deux** : suppression du premier bloc (l. 1530-1534), réécriture du second (l. 1701) avec : `localStorage.setItem('valeur_module6_complete','true')`, `VALEUR_PROGRESS.complete('module6')`, affichage du `popup-final`, confettis, toast, et correction du texte "Module 3 Validé" → "Module 6 — RENFORCER — Validé !".
- **`launchConfetti()` dupliqué** (l. 1537 + 1711) : suppression du premier bloc (DOM-based, écrasé par le second canvas-based).

---

## AXE 2 — Cohérence visuelle

### module0.html
- **CSS variables** : ajout de `--mod:#8FA3BC`, `--mod-light:#B8C9D8`, `--mod-glow`, `--mod-glass`, `--mc:#8FA3BC`, `--mc-glow` dans `:root`. Couleur du module "Comprendre" (gris-bleu neutre) conforme à la spec.
- **Aurora orb1** : couleur changée de `var(--violet)` → `var(--mod)` (gris-bleu #8FA3BC) pour correspondre à la couleur du module.
- **Copyright** : texte enrichi avec titre de psychologue, titre du livre et éditeur : "© Méthode V.A.L.E.U.R© · Céline Bourbon, Psychologue · *De la peur à la joie d'être soi*, Éd. L'Harmattan · Tous droits réservés".

### module1.html
- **CSS variables** : ajout de `--mc:#E05555`, `--mc-glow:rgba(224,85,85,.45)` dans `:root`.
- **Anti-copy** (l. 1266) : ajout des listeners `selectstart` (avec exemption TEXTAREA/INPUT/SELECT) et `dragstart`. Mise à jour de `copy` pour exempter TEXTAREA/INPUT. Simplification du listener `keydown`.

### module2.html
- **CSS variables** : ajout de `--mc:#E07C3A`, `--mc-glow:rgba(224,124,58,.45)` dans `:root`.
- **Anti-copy** (l. 1864) : ajout des listeners `selectstart` (avec exemption TEXTAREA/INPUT/SELECT) et `dragstart`. Mise à jour de `copy` pour exempter TEXTAREA/INPUT.

### module3.html
- **CSS variables** : ajout de `--mc:#D4AC0D`, `--mc-glow:rgba(212,172,13,.45)` dans `:root`.
- **Anti-copy** (l. 1773) : ajout des listeners `selectstart` (avec exemption TEXTAREA/INPUT/SELECT) et `dragstart`. Mise à jour de `copy` pour exempter TEXTAREA/INPUT.

### module4.html
- **CSS variables** : ajout de `--mc:#38A169`, `--mc-glow:rgba(56,161,105,.45)` dans `:root`.
- **Anti-copy** (l. 2114) : ajout des listeners `selectstart` (avec exemption TEXTAREA/INPUT/SELECT) et `dragstart`. Mise à jour de `copy` pour exempter TEXTAREA/INPUT.

### module5.html
- **CSS variables** : ajout de `--mc:#3A8FE0`, `--mc-glow:rgba(58,143,224,.45)` dans `:root`.
- **Anti-copy** (l. 1521) : ajout des listeners `selectstart` (avec exemption TEXTAREA/INPUT/SELECT) et `dragstart`. Mise à jour de `copy` pour exempter TEXTAREA/INPUT.

### module6.html
- **CSS variables** : ajout de `--mc:#8A5CF6`, `--mc-glow:rgba(138,92,246,.45)` dans `:root`.
- **Anti-copy** (l. 1583) : ajout des listeners `selectstart` (avec exemption TEXTAREA/INPUT/SELECT) et `dragstart`. Mise à jour de `copy` pour exempter TEXTAREA/INPUT.

---

## Récapitulatif standard appliqué

Chaque module appelle désormais en fin de complétion :
1. `localStorage.setItem('valeur_module[N]_complete', 'true')` — clé directe pour le système de déverrouillage
2. `VALEUR_PROGRESS.complete('module[N]')` — mise à jour barre de progression + clés email-spécifiques
3. Confettis + toast + indicateur visuel (bouton, unlock-preview)

## Vérification de la chaîne complète

```
M0 complété → valeur_module0_complete = 'true' → M1 déverrouillé ✓
M1 complété → valeur_module1_complete = 'true' → M2 déverrouillé ✓
M2 complété → valeur_module2_complete = 'true' → M3 déverrouillé ✓
M3 complété → valeur_module3_complete = 'true' → M4 déverrouillé ✓
M4 complété → valeur_module4_complete = 'true' → M5 déverrouillé ✓
M5 complété → valeur_module5_complete = 'true' → M6 déverrouillé ✓
M6 complété → valeur_module6_complete = 'true' → 100% progression ✓
```
