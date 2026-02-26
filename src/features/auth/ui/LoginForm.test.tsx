import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { loginAction } from "../api/actions";
import { LoginForm } from "./LoginForm";

const mockPush = vi.fn();

vi.mock("../api/actions", () => ({
  loginAction: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renders login form with email and password fields", () => {
    render(<LoginForm />);
    expect(screen.getByText("Login to your account")).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^login$/i }),
    ).toBeInTheDocument();
  });

  it("renders Sign Up link", () => {
    render(<LoginForm />);
    expect(screen.getByRole("link", { name: /sign up/i })).toBeInTheDocument();
  });

  it("renders Forgot password link", () => {
    render(<LoginForm />);
    expect(
      screen.getByRole("link", { name: /forgot your password/i }),
    ).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    await user.click(screen.getByRole("button", { name: /^login$/i }));
    // Zod + react-hook-form show validation messages or set aria-invalid
    await vi.waitFor(() => {
      const error = document.body.textContent;
      const hasValidation =
        error?.includes("Invalid") ||
        error?.includes("required") ||
        screen.getByLabelText(/email/i).getAttribute("aria-invalid") === "true";
      expect(hasValidation).toBe(true);
    });
  });

  it("calls loginAction and redirects on success", async () => {
    vi.mocked(loginAction).mockResolvedValueOnce({ error: null });

    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /^login$/i }));

    await vi.waitFor(() => {
      expect(loginAction).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "password123",
      });
    });
    await vi.waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/protected");
    });
  });

  it("shows server error when loginAction returns error", async () => {
    vi.mocked(loginAction).mockResolvedValueOnce({
      error: "Invalid credentials",
    });

    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.type(screen.getByLabelText(/password/i), "wrong");
    await user.click(screen.getByRole("button", { name: /^login$/i }));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
  });

  it("disables submit button while pending", async () => {
    vi.mocked(loginAction).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ error: null }), 100),
        ),
    );

    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    const submitBtn = screen.getByRole("button", { name: /^login$/i });
    await user.click(submitBtn);

    expect(submitBtn).toBeDisabled();
    expect(submitBtn).toHaveTextContent(/logging in/i);
  });
});
