import React from "react";
import { render, screen } from "@testing-library/react";
import { SearchBar } from "@/components/searchbar/search-bar";

describe("SearchBar Component", () => {
  it("renders the search input with default placeholder", () => {
    render(<SearchBar />);
    const searchInput = screen.getByPlaceholderText("Search assessments...");
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute("type", "search");
  });

  it("renders the search input with custom placeholder", () => {
    render(<SearchBar placeholder="Search templates..." />);
    const searchInput = screen.getByPlaceholderText("Search templates...");
    expect(searchInput).toBeInTheDocument();
  });

//   it("renders the magnifying glass icon", () => {
//     render(<SearchBar />);
//     const icon = screen.getByRole("img", { hidden: true });
//     expect(icon).toBeInTheDocument();
//     expect(icon).toHaveClass("h-4 w-4");
//   });
});
