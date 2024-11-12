import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CreationForm } from "@/components/assessments/creation-form";

describe("CreationForm", () => {
  it("renders the Create New Assessment button initially", () => {
    render(<CreationForm />);
    expect(screen.getByText(/Create New Assessment/i)).toBeInTheDocument();
  });

  it("opens the form modal when Create New Assessment button is clicked", async () => {
    render(<CreationForm />);
    fireEvent.click(screen.getByText(/Create New Assessment/i));
    await waitFor(() => {
      expect(screen.getByText(/Create Assessment Form/i)).toBeInTheDocument();
    });
  });

  it("allows adding a new Domain field", async () => {
    render(<CreationForm />);
    fireEvent.click(screen.getByText(/Create New Assessment/i));
    fireEvent.click(screen.getByText(/Add Domain/i));

    // Verify that the Domain field has been added with a placeholder
    expect(
      screen.getByPlaceholderText(/Enter Domain name/i)
    ).toBeInTheDocument();
  });

  it("allows adding a new Subtest field", async () => {
    render(<CreationForm />);
    fireEvent.click(screen.getByText(/Create New Assessment/i));
    fireEvent.click(screen.getByText(/Add Subtest/i));

    // Verify that the Subtest field has been added with a placeholder
    expect(
      screen.getByPlaceholderText(/Enter Subtest name/i)
    ).toBeInTheDocument();
  });

  // it("allows removing a field", async () => {
  //   render(<CreationForm />);
  //   fireEvent.click(screen.getByText(/Create New Assessment/i));
  //   fireEvent.click(screen.getByText(/Add Domain/i));

  //   // Confirm the Domain field is present
  //   expect(screen.getByPlaceholderText(/Enter Domain name/i)).toBeInTheDocument();

  //   // Remove the added field by clicking the delete button
  //   fireEvent.click(screen.getByRole("button", { name: /delete field/i }));

  //   // Confirm the Domain field is removed
  //   await waitFor(() => {
  //     expect(screen.queryByPlaceholderText(/Enter Domain name/i)).not.toBeInTheDocument();
  //   });
  // });

  it("validates the field name input", async () => {
    render(<CreationForm />);
    fireEvent.click(screen.getByText(/Create New Assessment/i));
    fireEvent.click(screen.getByText(/Add Domain/i));

    // Submit without entering a name
    const submitButton = screen
      .getAllByText(/Create Assessment/i)
      .find((button) => button.tagName === "BUTTON");
    if (submitButton) {
      fireEvent.click(submitButton);
    } else {
      throw new Error("Submit button not found");
    }

    // Check that validation error appears
    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
    });
  });

  it("allows selecting a score type for each field", async () => {
    render(<CreationForm />);
    fireEvent.click(screen.getByText(/Create New Assessment/i));
    fireEvent.click(screen.getByText(/Add Domain/i));

    // Open score type dropdown and select "Z"
    fireEvent.click(screen.getByText(/Score/i));
    fireEvent.click(screen.getByText("Z"));

    // Confirm "Z" is now selected
    expect(screen.getByText("Z")).toBeInTheDocument();
  });

  // it("calls onSubmit with correct data on form submission", async () => {
  //   const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {}); // Spy on console.log for verification

  //   render(<CreationForm />);
  //   fireEvent.click(screen.getByText(/Create New Assessment/i));
  //   fireEvent.click(screen.getByText(/Add Domain/i));

  //   // Fill out the form
  //   fireEvent.change(screen.getByPlaceholderText(/Enter Domain name/i), {
  //     target: { value: "Sample Domain" },
  //   });
  //   fireEvent.click(screen.getByText(/Score/i));
  //   fireEvent.click(screen.getByText("Z"));

  //   // Submit the form
  //   const submitButton = screen
  //     .getAllByText(/Create Assessment/i)
  //     .find((button) => button.tagName === "BUTTON");

  //   if (submitButton) {
  //     fireEvent.click(submitButton);
  //   } else {
  //     throw new Error("Submit button not found");
  //   }

  //   // Check that console.log was called with the correct values
  //   await waitFor(() => {
  //     expect(consoleSpy).toHaveBeenCalledWith({
  //       fields: [
  //         {
  //           name: "Sample Domain",
  //           type: "domain",
  //           scoreType: "Z",
  //         },
  //       ],
  //     });
  //   });

  //   consoleSpy.mockRestore();
  // });
});
