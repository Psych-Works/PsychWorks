import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthForm } from "@/components/auth/auth-form";
import { useRouter } from "next/navigation";

// Mock next/navigation's useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("AuthForm Component", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(null),
    });

    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("renders the form with email and password fields", () => {
    render(<AuthForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("displays an error message when email is missing", async () => {
    render(<AuthForm />);
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() =>
      expect(
        screen.getByText("Please enter a valid email address.")
      ).toBeInTheDocument()
    );
  });

  it("displays an error message for invalid email format", async () => {
    render(<AuthForm />);
    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() =>
      expect(
        screen.getByText("Please enter a valid email address.")
      ).toBeInTheDocument()
    );
  });

  it("displays an error message when password is missing", async () => {
    render(<AuthForm />);
    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() =>
      expect(
        screen.getByText("Password must be at least 8 characters.")
      ).toBeInTheDocument()
    );
  });

  it("submits the form with correct values", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ session: { userId: "123" } }),
    }) as jest.Mock;

    render(<AuthForm />);
    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/assessments");
    });

    (global.fetch as jest.Mock).mockRestore();
  });

  it("displays an error message when invalid credentials are submitted", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Invalid credentials" }),
    }) as jest.Mock;

    render(<AuthForm />);
    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() =>
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument()
    );

    (global.fetch as jest.Mock).mockRestore();
  });
});
