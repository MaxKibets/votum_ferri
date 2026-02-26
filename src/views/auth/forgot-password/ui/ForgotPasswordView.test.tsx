import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ForgotPasswordView } from "./ForgotPasswordView";

vi.mock("@/features/auth", () => ({
  ForgotPasswordForm: () => (
    <div data-testid="forgot-password-form">ForgotPasswordForm</div>
  ),
}));

describe("ForgotPasswordView", () => {
  it("renders ForgotPasswordForm", () => {
    render(<ForgotPasswordView />);
    expect(screen.getByTestId("forgot-password-form")).toBeInTheDocument();
    expect(screen.getByText("ForgotPasswordForm")).toBeInTheDocument();
  });
});
