import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import UserAvatar from "@/components/auth/user-avatar";
import { useRouter } from "next/navigation";

// Mock next/navigation's useRouter for redirection
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("UserAvatar Component", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(null),
    });
    jest.clearAllMocks();
  });

  it("renders UserIcon trigger", () => {
    render(<UserAvatar />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  //   it("opens the dropdown menu when UserIcon is clicked", async () => {
  //     render(<UserAvatar />);

  //     // Open the dropdown menu using act to handle any state changes
  //     await act(async () => {
  //       fireEvent.click(screen.getByRole("button"));
  //     });

  //     // Wait for the dropdown items to appear
  //     await waitFor(() => {
  //       expect(screen.queryByText("My Account")).toBeInTheDocument();
  //       expect(screen.queryByText("Settings")).toBeInTheDocument();
  //       expect(screen.queryByText("Sign Out")).toBeInTheDocument();
  //     });
  //   });

  //   it("navigates to the Settings page when Settings is clicked", async () => {
  //     render(<UserAvatar />);

  //     await act(async () => {
  //       fireEvent.click(screen.getByRole("button"));
  //     });

  //     const settingsLink = await waitFor(() => screen.queryByText("Settings"));
  //     expect(settingsLink).toBeInTheDocument();

  //     fireEvent.click(settingsLink as HTMLElement);
  //     expect(mockPush).toHaveBeenCalledWith("/settings");
  //   });

  //   it("navigates to the Sign Out page when Sign Out is clicked", async () => {
  //     render(<UserAvatar />);

  //     await act(async () => {
  //       fireEvent.click(screen.getByRole("button"));
  //     });

  //     const signOutLink = await waitFor(() => screen.queryByText("Sign Out"));
  //     expect(signOutLink).toBeInTheDocument();

  //     fireEvent.click(signOutLink as HTMLElement);
  //     expect(mockPush).toHaveBeenCalledWith("/sign-out");
  //   });
});
