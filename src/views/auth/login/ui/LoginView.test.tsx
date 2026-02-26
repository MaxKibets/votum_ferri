import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LoginView } from "./LoginView";

vi.mock("@/features/auth", () => ({
  LoginForm: () => <div data-testid="login-form">LoginForm</div>,
}));

describe("LoginView", () => {
  it("renders LoginForm", () => {
    render(<LoginView />);
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(screen.getByText("LoginForm")).toBeInTheDocument();
  });
});
