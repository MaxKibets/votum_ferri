import { render, screen } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import { describe, expect, it, vi } from "vitest";
import { AuthErrorView } from "./AuthErrorView";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  usePathname: () => "/",
  useSearchParams: vi.fn(() => new URLSearchParams()),
  useParams: () => ({}),
}));

describe("AuthErrorView", () => {
  it("renders default error message when no error_code", () => {
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams());

    render(<AuthErrorView />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(
      screen.getByText(/an unexpected error occurred/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to login/i }),
    ).toHaveAttribute("href", "/auth/login");
  });

  it("renders email confirmation error when error_code is email_confirmation_failed", () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams({ error_code: "email_confirmation_failed" }),
    );

    render(<AuthErrorView />);
    expect(
      screen.getByText(/we could not confirm your email/i),
    ).toBeInTheDocument();
  });

  it("renders Back to login link with correct href", () => {
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams());

    render(<AuthErrorView />);
    const link = screen.getByRole("link", { name: /back to login/i });
    expect(link).toHaveAttribute("href", "/auth/login");
  });
});
