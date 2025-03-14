import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ChangePasswordForm } from "@/components/settings/change-password-form";
import AdminCard from "@/components/settings/admin-card";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    redirect("/sign-in");
  }
  const { data: isAdmin, error: rpcError } = await supabase.rpc("is_admin", {
    userid: user.id,
  });

  if (rpcError) {
    console.error("Failed to check admin status:", rpcError);
  }

  const isAdminUser = isAdmin || false;

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="user" className="space-y-4">
        <TabsList>
          <TabsTrigger value="user">User</TabsTrigger>
          {isAdminUser && <TabsTrigger value="admin">Admin</TabsTrigger>}
        </TabsList>

        <TabsContent value="user" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your personal information and profile settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user.email}
                    disabled
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>
        </TabsContent>

        {isAdminUser && (
          <TabsContent value="admin">
            <AdminCard />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
