import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Label } from "./label";

describe("Label", () => {
  it("renders label text", () => {
    render(<Label>Email</Label>);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("associates with input via htmlFor", () => {
    render(
      <>
        <Label htmlFor="email-input">Email</Label>
        <input id="email-input" type="email" />
      </>,
    );
    const label = screen.getByText("Email");
    expect(label).toHaveAttribute("for", "email-input");
  });

  it("has data-slot attribute", () => {
    render(<Label>Field</Label>);
    expect(screen.getByText("Field")).toHaveAttribute("data-slot", "label");
  });

  it("applies custom className", () => {
    render(<Label className="custom-label">Field</Label>);
    expect(screen.getByText("Field")).toHaveClass("custom-label");
  });
});
