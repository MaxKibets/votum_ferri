import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "./ThemeToggle";

const mockSetTheme = vi.fn();

vi.mock("next-themes", () => ({
  useTheme: () => ({
    setTheme: mockSetTheme,
    resolvedTheme: "light",
  }),
}));

describe("ThemeToggle", () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
  });

  it("renders toggle button with accessible label", () => {
    render(<ThemeToggle />);
    expect(
      screen.getByRole("button", { name: /toggle theme/i }),
    ).toBeInTheDocument();
  });

  it("calls setTheme when clicked", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(screen.getByRole("button", { name: /toggle theme/i }));
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });
});
