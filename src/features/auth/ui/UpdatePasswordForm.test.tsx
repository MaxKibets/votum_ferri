import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { updatePasswordAction } from "../api/actions";
import { UpdatePasswordForm } from "./UpdatePasswordForm";

const mockPush = vi.fn();

vi.mock("../api/actions", () => ({
  updatePasswordAction: vi.fn(),
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

describe("UpdatePasswordForm", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renders form with new password field", () => {
    render(<UpdatePasswordForm />);
    expect(screen.getByText(/update your password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /update password/i }),
    ).toBeInTheDocument();
  });

  it("calls updatePasswordAction and redirects on success", async () => {
    vi.mocked(updatePasswordAction).mockResolvedValueOnce({ error: null });

    const user = userEvent.setup();
    render(<UpdatePasswordForm />);

    await user.type(
      screen.getByLabelText(/new password/i),
      "NewSecurePass123!",
    );
    await user.click(screen.getByRole("button", { name: /update password/i }));

    await vi.waitFor(() => {
      expect(updatePasswordAction).toHaveBeenCalledWith({
        password: "NewSecurePass123!",
      });
    });
    await vi.waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/protected");
    });
  });

  it("shows server error when action returns error", async () => {
    vi.mocked(updatePasswordAction).mockResolvedValueOnce({
      error: "Password too weak",
    });

    const user = userEvent.setup();
    render(<UpdatePasswordForm />);

    await user.type(screen.getByLabelText(/new password/i), "ValidPass8");
    await user.click(screen.getByRole("button", { name: /update password/i }));

    expect(await screen.findByText("Password too weak")).toBeInTheDocument();
  });

  it("disables submit button while pending", async () => {
    vi.mocked(updatePasswordAction).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ error: null }), 100),
        ),
    );

    const user = userEvent.setup();
    render(<UpdatePasswordForm />);

    await user.type(screen.getByLabelText(/new password/i), "NewPass123!");
    const submitBtn = screen.getByRole("button", { name: /update password/i });
    await user.click(submitBtn);

    await vi.waitFor(() => {
      expect(submitBtn).toBeDisabled();
    });
    expect(submitBtn).toHaveTextContent(/updating/i);
  });
});
