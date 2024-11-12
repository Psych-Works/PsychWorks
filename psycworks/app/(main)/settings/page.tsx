import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

const SettingsPage = () => {
  return (
    <div className="px-4 space-y-6 md:px-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="Enter your email" type="email" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Change Password</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                placeholder="Enter your current password"
                type="password"
              />
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                placeholder="Enter your new password"
                type="password"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                placeholder="Confirm your new password"
                type="password"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <Button size="lg">Save</Button>
      </div>
    </div>
  );
};

export default SettingsPage;
