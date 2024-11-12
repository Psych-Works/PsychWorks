import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import CreateAssessmentHeader from "@/components/assessments/create-assessment-header";

describe("CreateAssessmentHeader", () => {
  it("renders without crashing", () => {
    render(<CreateAssessmentHeader />);
    expect(screen.getByText(/Create Assessment Table/i)).toBeInTheDocument();
  });

  it("shows placeholder text in select box initially", () => {
    render(<CreateAssessmentHeader />);
    expect(screen.getByText(/Select a type/i)).toBeInTheDocument();
  });

  it("renders the correct table types in the dropdown", () => {
    render(<CreateAssessmentHeader />);
    fireEvent.click(screen.getByText(/Select a type/i));

    expect(screen.getByText(/Type 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Type 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Type 3/i)).toBeInTheDocument();
  });

  it("updates the selected type when an option is clicked", () => {
    render(<CreateAssessmentHeader />);
    fireEvent.click(screen.getByText(/Select a type/i));
    fireEvent.click(screen.getByText(/Type 1/i));

    // Verify that the selection has updated
    expect(screen.getByText(/Type 1/i)).toBeInTheDocument();
    expect(screen.queryByText(/Select a type/i)).not.toBeInTheDocument();
  });
});
