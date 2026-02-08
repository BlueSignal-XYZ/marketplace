# BlueSignal Audit Findings — 2025-02-08

## Form Investigation

- **Form component location:** `src/pages/landing/components/ContactForm.jsx`
- **Submit handler function:** `handleSubmit` (lines 250–311)
- **Submission method:** Firebase `addDoc` to Firestore collection `contact_submissions`, with mailto fallback
- **Firebase config file:** Exists at `src/pages/landing/utils/firebase.js` (landing-specific, separate from main app config at `src/apis/firebase.js`)
- **Firebase installed:** Yes — `firebase` v^10.8.1 in `dependencies`
- **Bundler:** Vite (vite.config.ts)
- **Env var prefix in config:** `VITE_` (e.g. `import.meta.env.VITE_FIREBASE_API_KEY`)
- **Env var prefix required by bundler:** `VITE_`
- **Prefix match:** Yes — prefixes are correct for Vite
- **.env files present:** **NONE** — zero `.env*` files exist in the project root
- **Firestore rules in repo (`firestore.rules`):** Allows `create` on `contact_submissions` (with email string validation)
- **Firestore rules stated by owner:** Allows `create` on `leads` — **MISMATCH with code and repo rules**

### Diagnosis: A + E hybrid

Firebase is properly configured in code — the landing page has its own lightweight Firebase init (`src/pages/landing/utils/firebase.js`) that creates a named app instance (`'landing'`) with Firestore only. The `ContactForm` imports this and writes to `contact_submissions` via `addDoc`.

**However, the form has NEVER worked because:**

1. **No `.env` file exists locally or was committed.** The `vite.config.ts` injects missing env vars as empty strings (`JSON.stringify(value || '')`). The firebase.js config checks `requiredKeys.every((k) => firebaseConfig[k])` — empty strings are falsy, so `isConfigured` evaluates to `false`, `firestore` stays `null`, and the form **always** enters the mailto fallback branch.

2. **Potential rules mismatch in production.** The code writes to `contact_submissions`, matching the repo's `firestore.rules`. But the owner states they deployed rules allowing `leads` (not `contact_submissions`). If the deployed rules only permit `leads`, Firestore would deny the write → caught by the `catch` block → mailto fallback.

3. **Silent fallback hides the problem.** When `firestore` is `null`, the form opens mailto with zero console output. When Firestore write fails, the error is caught and the user sees "Email prepared!" with no indication that data was lost. No developer has ever seen an error message because none is emitted.

### Required actions (configuration — cannot be done by code changes alone)

1. Owner must create `.env.local` in the project root with all `VITE_FIREBASE_*` variables set to real values from the Firebase Console.
2. Owner must ensure the same variables are set in Cloudflare Pages → Settings → Environment variables.
3. Owner must deploy the repo's `firestore.rules` to align rules with code: `firebase deploy --only firestore:rules`
4. Alternatively, if owner wants to use `leads` collection, the code must be updated to write to `leads` instead of `contact_submissions`.

---

## Pipeline Investigation

- **Pipeline component location:** `src/pages/landing/sections/ArchitectureSection.jsx`
- **Desktop representation:** `TermBody` (`<pre>` with ASCII art) — visible above 768px, hidden at `md` breakpoint
- **Mobile representation:** `MobilePipeline` (accordion) — hidden by default, shown at `md` breakpoint (max-width: 768px)
- **Mobile layout shares same component:** No — completely separate styled components
- **Root cause of horizontal scroll:** The `<pre>` element's intrinsic content width (72+ box-drawing chars at 15px mono + 96px padding) exceeds the viewport at widths between 769px and ~884px. Multiple containment failures allow this to leak to page-level scroll.

### Specific CSS issues

1. **`TermBody` (line 70):** `font-size: 15px`, `padding: 48px`, `overflow-x: auto`. The ASCII separator lines are ~72 box-drawing characters. At 15px IBM Plex Mono (~9–10px/glyph), content width is ~666–740px + 96px padding = ~762–836px minimum. Exceeds available width at narrow desktop.
2. **`Grid` (line 14):** `overflow: hidden` is only applied at the `md` breakpoint (mobile). On desktop, no overflow constraint exists, so the grid track can expand beyond the container.
3. **`html` element (GlobalStyles.js):** Does NOT have `overflow-x: hidden`. Only `body`, `#root`, and `main` do. In some browsers, `overflow-x: hidden` on `body` alone does not prevent document-level horizontal scroll.
4. **CSS Grid min-width behavior:** Even though `Terminal` and `RevealOnScroll` set `min-width: 0`, the `<pre>` element's default `white-space: pre` creates an intrinsic minimum content size that can push the grid track wider.

### Fix approach

- Add `overflow-x: hidden` to `html` in GlobalStyles.js
- Move `overflow: hidden` on `Grid` to all breakpoints (not just `md`)
- Scale `TermBody` font-size and padding with `clamp()` for smaller desktop widths
- All changes gated to desktop-only (`min-width: 769px` or applied to desktop-visible elements). **Mobile layout is NOT touched.**
