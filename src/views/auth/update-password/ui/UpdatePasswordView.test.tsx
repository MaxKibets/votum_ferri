import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UpdatePasswordView } from "./UpdatePasswordView";

vi.mock("@/features/auth", () => ({
  UpdatePasswordForm: () => (
    <div data-testid="update-password-form">UpdatePasswordForm</div>
  ),
}));

describe("UpdatePasswordView", () => {
  it("renders UpdatePasswordForm", () => {
    render(<UpdatePasswordView />);
    expect(screen.getByTestId("update-password-form")).toBeInTheDocument();
    expect(screen.getByText("UpdatePasswordForm")).toBeInTheDocument();
  });
});
