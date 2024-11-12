import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import CreateAssessmentField from "@/components/assessments/create-assessment-field";

describe("CreateAssessmentField", () => {
  const fieldName = "Test Field";

  it("renders without crashing", () => {
    render(<CreateAssessmentField name={fieldName} />);
    expect(screen.getByText(`${fieldName}:`)).toBeInTheDocument();
  });

  it("displays the correct label text based on the name prop", () => {
    render(<CreateAssessmentField name={fieldName} />);
    expect(screen.getByText(`${fieldName}:`)).toBeInTheDocument();
  });

  it("renders an input field", () => {
    render(<CreateAssessmentField name={fieldName} />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("allows typing in the input field", () => {
    render(<CreateAssessmentField name={fieldName} />);
    const input = screen.getByRole("textbox");

    // Simulate typing
    fireEvent.change(input, { target: { value: "Some input text" } });
    expect(input).toHaveValue("Some input text");
  });
});
