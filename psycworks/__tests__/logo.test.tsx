import React from "react";
import { render, screen } from "@testing-library/react";
import Logo from "@/components/logo/logo";

describe("Logo Component", () => {
  it("renders the logo with the correct alt text and dimensions", () => {
    render(<Logo width={450} height={60} />);

    const logoImage = screen.getByAltText("Fort Worth Psycworks");
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute("width", "450");
    expect(logoImage).toHaveAttribute("height", "60");
  });

  it("links to the homepage", () => {
    render(<Logo width={450} height={60} />);

    const logoLink = screen.getByRole("link");
    expect(logoLink).toHaveAttribute("href", "/");
  });
});
