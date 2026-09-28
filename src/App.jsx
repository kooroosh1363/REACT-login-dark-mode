import { useEffect, useMemo, useState } from "react";
import { FORM_STATES, nextFormState, validateCredentials } from "./lib/auth-policy";
import { readRememberedEmail, storeRememberedEmail } from "./lib/remembered-email";
import { readTheme, resolveTheme, writeTheme } from "./lib/theme-policy";

function useResolvedTheme() {
  const [preference, setPreference] = useState(() => readTheme());
  const [prefersDark, setPrefersDark] = useState(
    () => window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false
  );

  useEffect(() => {
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!media) return undefined;

    const onChange = (event) => setPrefersDark(event.matches);
    media.addEventListener?.("change", onChange);
    return () => media.removeEventListener?.("change", onChange);
  }, []);

  const resolved = resolveTheme(preference, prefersDark);

  useEffect(() => {
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;
  }, [resolved]);

  const updatePreference = (next) => {
    setPreference(next);
    writeTheme(next);
  };

  return { preference, resolved, setPreference: updatePreference };
}

export default function App() {
  const rememberedEmail = useMemo(() => readRememberedEmail(), []);
  const [email, setEmail] = useState(rememberedEmail);
  const [password, setPassword] = useState("");
  const [rememberEmail, setRememberEmail] = useState(Boolean(rememberedEmail));
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formState, setFormState] = useState(FORM_STATES.IDLE);
  const { preference, resolved, setPreference } = useResolvedTheme();

  const handleEdit = () => {
    if (formState !== FORM_STATES.IDLE) {
      setFormState((current) => nextFormState(current, "EDIT"));
    }
  };

  const submit = async (event) => {
    event.preventDefault();

    const result = validateCredentials({ email, password });
    setErrors(result.errors);

    if (!result.valid) {
      setFormState((current) => nextFormState(current, "INVALID"));
      return;
    }

    setFormState((current) => nextFormState(current, "SUBMIT"));
    storeRememberedEmail(result.data.email, rememberEmail);

    await new Promise((resolve) => window.setTimeout(resolve, 260));

    setFormState((current) => nextFormState(current, "SUCCESS"));
    setPassword("");
  };

  const resetDemo = () => {
    setPassword("");
    setErrors({});
    setFormState((current) => nextFormState(current, "RESET"));
  };

  const submitting = formState === FORM_STATES.SUBMITTING;
  const success = formState === FORM_STATES.SUCCESS;

  return (
    <main className="auth-page">
      <section className="context-panel" aria-labelledby="context-title">
        <a className="brand" href="#sign-in">
          <span aria-hidden="true">AS</span>
          AuthSurface
        </a>

        <div className="context-panel__content">
          <p className="eyebrow">React authentication UX demo</p>
          <h1 id="context-title">Sign-in behavior is a state problem before it is a backend problem.</h1>
          <p className="context-copy">
            This demo isolates the client-side experience: validation, submission states,
            password visibility, remembered email, and system-aware theming. It does not
            pretend to authenticate against a real server.
          </p>

          <dl className="capability-list">
            <div><dt>Theme modes</dt><dd>System / Light / Dark</dd></div>
            <div><dt>Remembered data</dt><dd>Email only</dd></div>
            <div><dt>Password storage</dt><dd>Never</dd></div>
            <div><dt>Authentication</dt><dd>Demo state machine</dd></div>
          </dl>
        </div>

        <p className="context-note">
          Portfolio scope: front-end auth UX, not identity, sessions, OAuth, or credential verification.
        </p>
      </section>

      <section className="auth-panel" id="sign-in" aria-labelledby="sign-in-title">
        <div className="auth-panel__topbar">
          <label className="theme-control">
            <span>Theme</span>
            <select
              value={preference}
              onChange={(event) => setPreference(event.target.value)}
              aria-label="Theme preference"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <span className="resolved-theme" aria-live="polite">
            Active: {resolved}
          </span>
        </div>

        <div className="auth-card">
          <div className="auth-card__heading">
            <p className="eyebrow">Secure form behavior</p>
            <h2 id="sign-in-title">Welcome back</h2>
            <p>Use any valid-looking email and an 8+ character password to exercise the demo flow.</p>
          </div>

          {success ? (
            <section className="success-state" aria-live="polite" aria-labelledby="success-title">
              <div className="success-mark" aria-hidden="true">✓</div>
              <h3 id="success-title">Demo sign-in completed</h3>
              <p>
                Validation and the submission state machine completed successfully.
                No credentials were sent to a server.
              </p>
              <button className="primary-button" type="button" onClick={resetDemo}>
                Return to form
              </button>
            </section>
          ) : (
            <form onSubmit={submit} noValidate aria-describedby="form-status">
              <div className="field">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength="254"
                  value={email}
                  disabled={submitting}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setErrors((current) => ({ ...current, email: undefined }));
                    handleEdit();
                  }}
                />
                <span className="field-error" id="email-error">
                  {errors.email || ""}
                </span>
              </div>

              <div className="field">
                <label htmlFor="password">Password</label>
                <div className="password-field">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    minLength="8"
                    maxLength="128"
                    value={password}
                    disabled={submitting}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? "password-error" : "password-hint"}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setErrors((current) => ({ ...current, password: undefined }));
                      handleEdit();
                    }}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((current) => !current)}
                    disabled={submitting}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <span className="field-hint" id="password-hint">8–128 characters for this demo.</span>
                <span className="field-error" id="password-error">
                  {errors.password || ""}
                </span>
              </div>

              <label className="remember-control">
                <input
                  type="checkbox"
                  checked={rememberEmail}
                  disabled={submitting}
                  onChange={(event) => setRememberEmail(event.target.checked)}
                />
                <span>
                  <strong>Remember email</strong>
                  <small>Password is never stored.</small>
                </span>
              </label>

              <button className="primary-button" type="submit" disabled={submitting}>
                {submitting ? "Checking demo state…" : "Continue"}
              </button>

              <p
                id="form-status"
                className={formState === FORM_STATES.INVALID ? "form-status form-status--error" : "form-status"}
                aria-live="polite"
              >
                {formState === FORM_STATES.INVALID
                  ? "Review the highlighted fields."
                  : "No network request is made by this demo."}
              </p>
            </form>
          )}

          <div className="auth-card__boundary">
            <strong>Engineering boundary</strong>
            <p>
              A production sign-in would send credentials over HTTPS to a trusted identity service
              and receive a server-managed session. This repository intentionally stops before that boundary.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
