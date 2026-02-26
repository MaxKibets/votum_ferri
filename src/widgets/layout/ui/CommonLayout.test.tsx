import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CommonLayout } from "./CommonLayout";

vi.mock("@/widgets/header", () => ({
  Header: () => <header data-testid="header">Header</header>,
}));

vi.mock("@/widgets/footer", () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

describe("CommonLayout", () => {
  it("renders Header and Footer", () => {
    render(
      <CommonLayout>
        <span>Page content</span>
      </CommonLayout>,
    );
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("renders children in main area", () => {
    render(
      <CommonLayout>
        <span>Page content</span>
      </CommonLayout>,
    );
    expect(screen.getByText("Page content")).toBeInTheDocument();
    const main = document.querySelector("main");
    expect(main).toContainElement(screen.getByText("Page content"));
  });

  it("wraps content in flex column layout", () => {
    const { container } = render(
      <CommonLayout>
        <div>Child</div>
      </CommonLayout>,
    );
    const flexDiv = container.querySelector(".flex.h-screen.flex-col");
    expect(flexDiv).toBeInTheDocument();
  });
});
