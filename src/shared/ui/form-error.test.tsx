import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FormError } from "./form-error";

describe("FormError", () => {
  it("renders message when provided", () => {
    render(<FormError message="Invalid email" />);
    expect(screen.getByText("Invalid email")).toBeInTheDocument();
  });

  it("renders nothing when message is undefined", () => {
    const { container } = render(<FormError />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when message is empty string", () => {
    const { container } = render(<FormError message="" />);
    expect(container.firstChild).toBeNull();
  });

  it("applies custom className when message is present", () => {
    render(<FormError message="Error" className="custom-error" />);
    expect(screen.getByText("Error")).toHaveClass("custom-error");
  });

  it("has destructive text class for styling", () => {
    render(<FormError message="Error text" />);
    expect(screen.getByText("Error text")).toHaveClass("text-destructive");
  });
});
