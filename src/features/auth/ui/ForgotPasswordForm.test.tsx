import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { forgotPasswordAction } from "../api/actions";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

vi.mock("../api/actions", () => ({
  forgotPasswordAction: vi.fn(),
}));

describe("ForgotPasswordForm", () => {
  it("renders form with email field and submit button", () => {
    render(<ForgotPasswordForm />);
    expect(screen.getByText(/reset your password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send reset link/i }),
    ).toBeInTheDocument();
  });

  it("renders Back to login link", () => {
    render(<ForgotPasswordForm />);
    expect(
      screen.getByRole("link", { name: /back to login/i }),
    ).toBeInTheDocument();
  });

  it("shows success message after successful submit", async () => {
    vi.mocked(forgotPasswordAction).mockResolvedValueOnce({ error: null });

    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    expect(
      await screen.findByText(/check your email for a password reset link/i),
    ).toBeInTheDocument();
  });

  it("calls forgotPasswordAction with email", async () => {
    vi.mocked(forgotPasswordAction).mockResolvedValueOnce({ error: null });

    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.type(screen.getByLabelText(/email/i), "reset@example.com");
    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    await vi.waitFor(() => {
      expect(forgotPasswordAction).toHaveBeenCalledWith({
        email: "reset@example.com",
      });
    });
  });

  it("shows server error when action returns error", async () => {
    vi.mocked(forgotPasswordAction).mockResolvedValueOnce({
      error: "Too many requests",
    });

    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    expect(await screen.findByText("Too many requests")).toBeInTheDocument();
  });

  it("disables submit button while pending", async () => {
    vi.mocked(forgotPasswordAction).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ error: null }), 100),
        ),
    );

    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.type(screen.getByLabelText(/email/i), "u@example.com");
    const submitBtn = screen.getByRole("button", { name: /send reset link/i });
    await user.click(submitBtn);

    expect(submitBtn).toBeDisabled();
    expect(submitBtn).toHaveTextContent(/sending/i);
  });
});
