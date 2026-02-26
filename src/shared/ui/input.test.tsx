import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Input } from "./input";

describe("Input", () => {
  it("renders with placeholder and data-slot", () => {
    render(<Input placeholder="Enter value" />);
    const input = screen.getByPlaceholderText("Enter value");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("data-slot", "input");
    // When type is not passed, HTML input defaults to text (attribute may be absent)
    expect(input.getAttribute("type")).not.toBe("password");
  });

  it("renders with type email", () => {
    render(<Input type="email" placeholder="Email" />);
    expect(screen.getByPlaceholderText("Email")).toHaveAttribute(
      "type",
      "email",
    );
  });

  it("renders with type password", () => {
    render(<Input type="password" placeholder="Password" />);
    expect(screen.getByPlaceholderText("Password")).toHaveAttribute(
      "type",
      "password",
    );
  });

  it("accepts and displays user input", async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Type here" />);
    const input = screen.getByPlaceholderText("Type here");
    await user.type(input, "hello");
    expect(input).toHaveValue("hello");
  });

  it("can be disabled", () => {
    render(<Input placeholder="Disabled" disabled />);
    expect(screen.getByPlaceholderText("Disabled")).toBeDisabled();
  });

  it("forwards aria-invalid when invalid", () => {
    render(<Input placeholder="Invalid" aria-invalid />);
    expect(screen.getByPlaceholderText("Invalid")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("applies custom className", () => {
    render(<Input placeholder="Styled" className="custom-input" />);
    expect(screen.getByPlaceholderText("Styled")).toHaveClass("custom-input");
  });
});
