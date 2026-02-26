import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

describe("Card", () => {
  it("renders Card with children", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
    expect(
      screen.getByText("Card content").closest("[data-slot='card']"),
    ).toBeInTheDocument();
  });

  it("renders CardHeader with CardTitle and CardDescription", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description text</CardDescription>
        </CardHeader>
      </Card>,
    );
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description text")).toBeInTheDocument();
    expect(
      screen.getByText("Title").closest("[data-slot='card-title']"),
    ).toBeInTheDocument();
    expect(
      screen
        .getByText("Description text")
        .closest("[data-slot='card-description']"),
    ).toBeInTheDocument();
  });

  it("renders CardContent", () => {
    render(
      <Card>
        <CardContent>
          <p>Body content</p>
        </CardContent>
      </Card>,
    );
    expect(screen.getByText("Body content")).toBeInTheDocument();
    expect(
      screen.getByText("Body content").closest("[data-slot='card-content']"),
    ).toBeInTheDocument();
  });

  it("renders CardFooter", () => {
    render(
      <Card>
        <CardFooter>Footer content</CardFooter>
      </Card>,
    );
    expect(screen.getByText("Footer content")).toBeInTheDocument();
    expect(
      screen.getByText("Footer content").closest("[data-slot='card-footer']"),
    ).toBeInTheDocument();
  });

  it("renders CardAction", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardAction>
            <button type="button">Action</button>
          </CardAction>
        </CardHeader>
      </Card>,
    );
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
    expect(
      screen
        .getByRole("button", { name: "Action" })
        .closest("[data-slot='card-action']"),
    ).toBeInTheDocument();
  });

  it("applies custom className to Card", () => {
    render(<Card className="custom-class">Content</Card>);
    const card = screen.getByText("Content").closest("[data-slot='card']");
    expect(card).toHaveClass("custom-class");
  });
});
