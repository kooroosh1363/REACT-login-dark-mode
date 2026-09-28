export const FORM_STATES = Object.freeze({
  IDLE: "idle",
  INVALID: "invalid",
  SUBMITTING: "submitting",
  SUCCESS: "success"
});

export function validateCredentials(input = {}) {
  const email = String(input.email ?? "").trim().toLowerCase();
  const password = String(input.password ?? "");
  const errors = {};

  if (!email) {
    errors.email = "Email is required.";
  } else if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (password.length > 128) {
    errors.password = "Password must be 128 characters or fewer.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    data: { email, password }
  };
}

export function nextFormState(currentState, event) {
  const current = Object.values(FORM_STATES).includes(currentState)
    ? currentState
    : FORM_STATES.IDLE;

  switch (event) {
    case "INVALID":
      return FORM_STATES.INVALID;
    case "SUBMIT":
      return current === FORM_STATES.SUCCESS ? FORM_STATES.SUCCESS : FORM_STATES.SUBMITTING;
    case "SUCCESS":
      return FORM_STATES.SUCCESS;
    case "EDIT":
    case "RESET":
      return FORM_STATES.IDLE;
    default:
      return current;
  }
}
