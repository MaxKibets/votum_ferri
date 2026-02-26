import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SignUpView } from "./SignUpView";

vi.mock("@/features/auth", () => ({
  SignUpForm: () => <div data-testid="sign-up-form">SignUpForm</div>,
}));

describe("SignUpView", () => {
  it("renders SignUpForm", () => {
    render(<SignUpView />);
    expect(screen.getByTestId("sign-up-form")).toBeInTheDocument();
    expect(screen.getByText("SignUpForm")).toBeInTheDocument();
  });
});
