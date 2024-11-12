import React from "react";
import { render, screen } from "@testing-library/react";
import Navbar from "@/components/navbar/navbar";

describe("Navbar Component", () => {
  it("renders the logo", () => {
    render(<Navbar />);
    const logoImage = screen.getByAltText("Fort Worth Psycworks");
    expect(logoImage).toBeInTheDocument();
  });

  // it("renders navigation links with correct paths", () => {
  //   render(<Navbar />);

  //   expect(screen.getByRole("link", { name: /assessments/i })).toHaveAttribute(
  //     "href",
  //     "/assessments"
  //   );
  //   expect(screen.getByRole("link", { name: /templates/i })).toHaveAttribute(
  //     "href",
  //     "/templates"
  //   );
  //   expect(screen.getByRole("link", { name: /settings/i })).toHaveAttribute(
  //     "href",
  //     "/settings"
  //   );
  // });

  it("renders the UserAvatar component in the navbar", () => {
    render(<Navbar />);
    expect(screen.getByRole("button")).toBeInTheDocument(); // UserAvatar button
  });
});
