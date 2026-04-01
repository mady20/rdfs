Prioritized Fixes & Implementation Plan

Overview
- This document summarizes the remaining high-priority fixes discovered during the full-project audit and provides a recommended implementation order, owners, and rough effort estimates.

Priority 1 — Critical (Money & Auth)
1. Implement DB transactions for wallet flows
   - Files: `backend/src/controllers/walletController.js` (transferWallet, adminAdjustWallet)
   - Why: Prevent double-spend and race conditions under concurrent transfers.
   - Work: Use Mongoose sessions (startSession, withTransaction), ensure atomic writes to Wallet and WalletLedger, add tests for concurrent transfers.
   - Owner: Backend
   - Estimate: 1.5-2 days (implementation + tests)

2. Migrate auth tokens to httpOnly secure cookies + refresh-token flow
   - Files: `backend/src/controllers/authController.js`, `backend/src/middleware/authMiddleware.js`, `frontend/src/context/AuthContext.js`, `frontend/src/api/axios.js`
   - Why: LocalStorage-stored JWTs are vulnerable to XSS; httpOnly cookies mitigate that risk and require CSRF protections.
   - Work: Implement refresh token endpoints, set `Set-Cookie` on login, update frontend to stop storing token in localStorage and rely on cookie-authenticated requests; add CSRF protection or SameSite cookie settings and server-side checks.
   - Owner: Backend + Frontend
   - Estimate: 2-4 days (server + frontend changes + QA)

Priority 2 — High (Security & reliability)
3. Add security middleware and hardened headers
   - Files: `backend/src/app.js`
   - Why: Improve default HTTP security posture (CSP, HSTS, XSS protections).
   - Work: Add `helmet()` (done), consider CSP policy and secure cookie flags.
   - Owner: Backend
   - Estimate: 0.5 day

4. Add rate limiting and request size limits for sensitive endpoints
   - Files: `backend/src/app.js`, route level where needed
   - Why: Reduce abuse and brute-force/DoS risk on auth and wallet endpoints.
   - Work: Add `express-rate-limit`, apply to `/api/auth/login`, `/api/wallets/transfer`.
   - Owner: Backend
   - Estimate: 0.5-1 day

Priority 3 — Medium (UX, accessibility, maintainability)
5. Finish accessibility sweep and remove legacy CSS
   - Files: `frontend/src/components/**`, `frontend/src/pages/**`, `frontend/src/assets/styles/legacy/**`
   - Why: Improve keyboard navigation, ARIA attributes, semantic headers and eliminate legacy style drift.
   - Work: Fix any remaining non-semantic elements, ensure `alt` on images, add form validation aria alerts, remove legacy classes.
   - Owner: Frontend
   - Estimate: 1-2 days

6. Component improvements and codemods
   - Files: `frontend/src/components/common/*`
   - Why: Make components more reusable and consistent (className, rest props).
   - Work: Add prop forwarding, standardize spacing tokens, add unit tests for components.
   - Owner: Frontend
   - Estimate: 0.5-1 day

Priority 4 — Lower (tests, CI, performance)
7. Add E2E tests for wallet flows and concurrency scenarios
   - Files: test suite (Cypress or Playwright)
   - Why: Prevent regressions for money flows.
   - Work: Write E2E for login -> transfer, simulate parallel transfers.
   - Owner: Fullstack
   - Estimate: 2-3 days

8. CI pipeline + vulnerability scanning
   - Files: `.github/workflows/*` or ADO pipeline
   - Why: Automated builds, tests, and dependency checks.
   - Work: Add build/test/lint job and dependency vulnerability scanning.
   - Owner: DevOps
   - Estimate: 0.5-1 day

Immediate Next Steps (recommendation)
1. Implement DB transactions for wallet flows (Priority 1).
2. Start auth migration design (httpOnly + refresh token) and plan backward-compatible endpoints.
3. Add rate-limiting for login and transfer endpoints.
4. Finish accessibility sweep and remove legacy CSS.

Notes
- Several compatibility routes were added to avoid breaking the current frontend (`/api/profile` compat, wallet routes). These should be removed after coordinated rollout of API changes.
- I can implement tasks 1 and 3 next (backend work) if you want — choose which to start first.

Contact me which task to start first (1 or 2 recommended).