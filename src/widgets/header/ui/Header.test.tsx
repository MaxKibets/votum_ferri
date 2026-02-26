import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Header } from "./Header";

describe("Header", () => {
  it("renders site title with link to home", () => {
    render(<Header />);
    const titleLink = screen.getByRole("link", { name: /votum ferri/i });
    expect(titleLink).toBeInTheDocument();
    expect(titleLink).toHaveAttribute("href", "/");
  });

  it("renders Sign in link", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute(
      "href",
      "/auth/login",
    );
  });

  it("renders Sign up link", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute(
      "href",
      "/auth/sign-up",
    );
  });

  it("renders within header element", () => {
    render(<Header />);
    const header = document.querySelector("header");
    expect(header).toBeInTheDocument();
    expect(header).toContainElement(
      screen.getByRole("link", { name: /votum ferri/i }),
    );
  });
});
