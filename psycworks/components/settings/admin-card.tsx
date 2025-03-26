"use client";

import { Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

interface User {
  email: string;
  last_sign_in_at: string | null;
  id: string;
}

export default function AdminCard() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userRoles, setUserRoles] = useState<Record<string, string[]>>({});
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");

  const fetchUsers = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const response = await fetch(
        `/api/settings/fetch-users?userId=${user.id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const response = await fetch(`/api/settings/delete-user`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminId: user.id,
          userToDeleteId: userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

            // Update local state instead of refetching
            setUsers(users.filter(u => u.id !== userId));
        } catch (err) {
            console.error("Error deleting user:", err);
            setError(err instanceof Error ? err.message : "Failed to delete user");
        }
    };

    const handleToggleDeleteAccess = async (userId: string, isPromoting: boolean) => {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No authenticated user");

            const response = await fetch(`/api/settings/update-user`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    adminId: user.id,
                    targetUserId: userId,
                    isPromoting: isPromoting
                })
            });

            if (!response.ok) {
                throw new Error("Failed to update user role");
            }

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }

            // Update user roles based on promotion or demotion
            setUserRoles({
                ...userRoles,
                [userId]: isPromoting ? ['Elevated_delete'] : []
            });

            // Set dialog message and open dialog
            setDialogMessage(isPromoting ? "User has been granted delete access." : "User's delete access has been revoked.");
            setDialogOpen(true);
        } catch (err) {
            console.error("Error updating user role:", err);
            setError(err instanceof Error ? err.message : "Failed to update user role");
        }
    };

  useEffect(() => {
    fetchUsers();
  }, []);

    return(
        <Card>
            <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Delete, or promote users in your system</CardDescription>
            </CardHeader>

      <CardContent>
        <Table className="border-[1px]">
          <TableHeader>
            <TableRow className="border-b border-primary/20 hover:bg-primary/5">
              <TableHead className="bg-primary/5 text-center">Email</TableHead>
              <TableHead className="bg-primary/5 text-center">
                Last sign in
              </TableHead>
              <TableHead className="bg-primary/5 text-center">
                Manage Permissions
              </TableHead>
              <TableHead className="bg-primary/5 text-center">
                Delete User
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-red-500"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => (
                <TableRow
                  key={index}
                  className="border-b border-primary/10 hover:bg-primary/5"
                >
                  <TableCell className="font-medium text-center">
                    {user.email}
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    {user.last_sign_in_at
                      ? format(new Date(user.last_sign_in_at), "PPP")
                      : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => handleToggleDeleteAccess(user.id, true)}
                        className="text-sm"
                        title="Grant Delete Access"
                      >
                        <ArrowUpCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleToggleDeleteAccess(user.id, false)}
                        className="text-sm"
                        title="Remove Delete Access"
                      >
                        <ArrowDownCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-primary/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this user? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDeleteUser(user.id)}
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogTitle>Success</DialogTitle>
                    <DialogDescription>{dialogMessage}</DialogDescription>
                    <DialogFooter>
                        <DialogTrigger asChild>
                            <Button onClick={() => setDialogOpen(false)}>Close</Button>
                        </DialogTrigger>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
