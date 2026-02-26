import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeView } from "./HomeView";

describe("HomeView", () => {
  it("renders welcome heading", () => {
    render(<HomeView />);
    expect(
      screen.getByRole("heading", { name: /welcome to votum ferri/i }),
    ).toBeInTheDocument();
  });

  it("renders main content in a container", () => {
    render(<HomeView />);
    const heading = screen.getByRole("heading", {
      name: /welcome to votum ferri/i,
    });
    expect(heading.closest(".container")).toBeInTheDocument();
  });
});
