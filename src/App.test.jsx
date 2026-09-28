import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("AuthSurface", () => {
  it("shows deterministic validation feedback", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByText("Email is required.")).toBeInTheDocument();
    expect(screen.getByText("Password is required.")).toBeInTheDocument();
    expect(screen.getByText("Review the highlighted fields.")).toBeInTheDocument();
  });

  it("toggles password visibility without changing the password", async () => {
    const user = userEvent.setup();
    render(<App />);

    const password = screen.getByLabelText("Password");
    await user.type(password, "correct-horse");

    expect(password).toHaveAttribute("type", "password");
    await user.click(screen.getByRole("button", { name: "Show" }));
    expect(password).toHaveAttribute("type", "text");
    expect(password).toHaveValue("correct-horse");
  });

  it("completes the demo state machine and stores only the email", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Email address"), "User@Example.com");
    await user.type(screen.getByLabelText("Password"), "correct-horse");
    await user.click(screen.getByRole("checkbox", { name: /remember email/i }));
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByRole("button", { name: /checking demo state/i })).toBeDisabled();

    await waitFor(
      () => expect(screen.getByRole("heading", { name: "Demo sign-in completed" })).toBeInTheDocument(),
      { timeout: 1000 }
    );

    expect(localStorage.getItem("authsurface:remembered-email")).toBe("user@example.com");
    expect(JSON.stringify(localStorage)).not.toContain("correct-horse");
  });

  it("switches between explicit theme preferences", async () => {
    const user = userEvent.setup();
    render(<App />);

    const select = screen.getByRole("combobox", { name: "Theme preference" });
    await user.selectOptions(select, "dark");

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("authsurface:theme")).toBe("dark");
  });
});
