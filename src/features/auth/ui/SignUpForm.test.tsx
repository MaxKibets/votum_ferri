import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { signUpAction } from "../api/actions";
import { SignUpForm } from "./SignUpForm";

const mockPush = vi.fn();

vi.mock("../api/actions", () => ({
  signUpAction: vi.fn(),
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

describe("SignUpForm", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renders sign up form with all fields", () => {
    render(<SignUpForm />);
    expect(screen.getByText(/create an account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^sign up$/i }),
    ).toBeInTheDocument();
  });

  it("renders Sign In link", () => {
    render(<SignUpForm />);
    expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
  });

  it("calls signUpAction and redirects on success", async () => {
    vi.mocked(signUpAction).mockResolvedValueOnce({ error: null });

    const user = userEvent.setup();
    render(<SignUpForm />);

    await user.type(screen.getByLabelText(/^email$/i), "new@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "SecurePass123!");
    await user.type(
      screen.getByLabelText(/confirm password/i),
      "SecurePass123!",
    );
    await user.click(screen.getByRole("button", { name: /^sign up$/i }));

    await vi.waitFor(() => {
      expect(signUpAction).toHaveBeenCalledWith({
        email: "new@example.com",
        password: "SecurePass123!",
        confirmPassword: "SecurePass123!",
      });
    });
    await vi.waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/auth/sign-up-success");
    });
  });

  it("shows server error when signUpAction returns error", async () => {
    vi.mocked(signUpAction).mockResolvedValueOnce({
      error: "Email already registered",
    });

    const user = userEvent.setup();
    render(<SignUpForm />);

    await user.type(screen.getByLabelText(/^email$/i), "existing@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.type(screen.getByLabelText(/confirm password/i), "password123");
    await user.click(screen.getByRole("button", { name: /^sign up$/i }));

    expect(
      await screen.findByText("Email already registered"),
    ).toBeInTheDocument();
  });

  it("disables submit button while pending", async () => {
    vi.mocked(signUpAction).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ error: null }), 100),
        ),
    );

    const user = userEvent.setup();
    render(<SignUpForm />);

    await user.type(screen.getByLabelText(/^email$/i), "u@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "pass12345");
    await user.type(screen.getByLabelText(/confirm password/i), "pass12345");
    const submitBtn = screen.getByRole("button", { name: /^sign up$/i });
    await user.click(submitBtn);

    await vi.waitFor(() => {
      expect(submitBtn).toBeDisabled();
    });
    expect(submitBtn).toHaveTextContent(/creating account/i);
  });
});
