import { describe, expect, it } from "vitest";
import { FORM_STATES, nextFormState, validateCredentials } from "./auth-policy";

describe("auth policy", () => {
  it("normalizes valid credentials without changing password contents", () => {
    const result = validateCredentials({
      email: "  PERSON@Example.com  ",
      password: "valid-pass-123"
    });

    expect(result.valid).toBe(true);
    expect(result.data.email).toBe("person@example.com");
    expect(result.data.password).toBe("valid-pass-123");
  });

  it("rejects malformed email and short password", () => {
    const result = validateCredentials({ email: "bad-email", password: "short" });

    expect(result.valid).toBe(false);
    expect(result.errors.email).toMatch(/valid email/i);
    expect(result.errors.password).toMatch(/at least 8/i);
  });

  it("moves through deterministic form states", () => {
    expect(nextFormState(FORM_STATES.IDLE, "INVALID")).toBe(FORM_STATES.INVALID);
    expect(nextFormState(FORM_STATES.INVALID, "EDIT")).toBe(FORM_STATES.IDLE);
    expect(nextFormState(FORM_STATES.IDLE, "SUBMIT")).toBe(FORM_STATES.SUBMITTING);
    expect(nextFormState(FORM_STATES.SUBMITTING, "SUCCESS")).toBe(FORM_STATES.SUCCESS);
    expect(nextFormState(FORM_STATES.SUCCESS, "SUBMIT")).toBe(FORM_STATES.SUCCESS);
  });
});
