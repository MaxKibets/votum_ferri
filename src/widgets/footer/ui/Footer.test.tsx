import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Footer } from "./Footer";

vi.mock("@/features/theme-toggle", () => ({
  ThemeToggle: () => (
    <button type="button" aria-label="Theme toggle mock">
      Theme
    </button>
  ),
}));

describe("Footer", () => {
  it("renders site title link to home", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: /votum ferri/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("renders ThemeToggle", () => {
    render(<Footer />);
    expect(
      screen.getByRole("button", { name: /theme toggle mock/i }),
    ).toBeInTheDocument();
  });

  it("renders within footer element", () => {
    render(<Footer />);
    const footer = document.querySelector("footer");
    expect(footer).toBeInTheDocument();
  });
});
