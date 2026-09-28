# AuthSurface — Accessible Sign-In State Machine

AuthSurface modernizes the original 2023 React dark-mode login exercise into a focused front-end authentication UX demo.

## Focus

This repository demonstrates the client-side boundary of sign-in:

- deterministic email/password validation
- explicit form states: idle, invalid, submitting, success
- password visibility control
- remembered email only
- password is never persisted
- System / Light / Dark theme preferences
- live response to system color-scheme changes
- accessible labels, errors, status messages, and focus states
- responsive layout
- reduced-motion support

It intentionally does **not** pretend to provide real authentication.

## Why the upgrade was needed

The original version used Create React App, had a broken local-storage hook call, JSX `class` attributes, a controlled checkbox without change handling, an obsolete test looking for "learn react", external font/icon assumptions, and no meaningful validation or submission state model.

## Architecture

```text
auth-policy.js
  ├── validation
  └── form state machine

theme-policy.js
  └── System / Light / Dark resolution

remembered-email.js
  └── email-only persistence

App.jsx
  └── accessible React UI
```

## Security boundary

This is a front-end demo. A production sign-in flow should send credentials over HTTPS to a trusted identity/backend service and receive a server-managed session.

AuthSurface never stores passwords. The optional "Remember email" control persists only the normalized email address.

## Local development

```bash
npm install
npm run dev
```

## Tests

```bash
npm test
```

The suite covers validation, state transitions, theme resolution, email persistence, password visibility, invalid-form feedback, successful demo submission, and theme switching.

## Production build

```bash
npm run build
```

## GitHub Pages

Enable **Settings → Pages → Source → GitHub Actions**, then run **Actions → Deploy Pages → Run workflow**.

## Scope

No OAuth, real sessions, password reset, account creation, backend authentication, credential verification, or production identity provider is implemented.

## License

MIT.
