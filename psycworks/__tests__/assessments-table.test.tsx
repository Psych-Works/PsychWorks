import "@testing-library/jest-dom";
import { render, screen, waitFor, act } from "@testing-library/react";
import { AssessmentsTable } from "@/components/assessments/assessments-table";
import fetchMock from "jest-fetch-mock";

// Spy on console.error
jest.spyOn(global.console, "error").mockImplementation(() => {});

describe("AssessmentsTable", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks(); // Restore original console.error after tests
  });

  it("renders loading state initially", () => {
    render(<AssessmentsTable />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  const mockAssessments = [
    {
      id: "1",
      table_type_id: "101",
      name: "Assessment 1",
      created_at: "2023-11-01T12:00:00Z",
      updated_at: "2023-11-05T15:00:00Z",
      score_conversion: null,
      score_type: "raw",
      measure: "Measure 1",
    },
    {
      id: "2",
      table_type_id: "102",
      name: "Assessment 2",
      created_at: "2023-11-02T14:00:00Z",
      updated_at: null,
      score_conversion: "50",
      score_type: "standard",
      measure: "Measure 2",
    },
  ];

  it("renders assessments table after data is fetched", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockAssessments), {
      status: 200,
    });

    await act(async () => {
      render(<AssessmentsTable />);
      screen.debug(); // Print the current DOM structure for debugging
    });

    // Wait for the table body to be populated
    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    // Verify content within the table
    expect(await screen.findByText("Assessment 1")).toBeInTheDocument();
    expect(await screen.findByText("Assessment 2")).toBeInTheDocument();
    expect(await screen.findByText("Measure 1")).toBeInTheDocument();
    expect(await screen.findByText("Measure 2")).toBeInTheDocument();
    expect(await screen.findByText("Nov 1, 2023")).toBeInTheDocument();
    expect(await screen.findByText("—")).toBeInTheDocument();
  });

  it("handles fetch errors gracefully", async () => {
    fetchMock.mockReject(new Error("Failed to fetch assessments"));

    await act(async () => {
      render(<AssessmentsTable />);
    });

    await waitFor(() => {
      expect(screen.queryByText("loading")).not.toBeInTheDocument();
    });

    // Ensure error handling logic works
    expect(console.error).toHaveBeenCalledWith(
      "Failed to fetch assessments:",
      expect.any(Error)
    );
  });
});
