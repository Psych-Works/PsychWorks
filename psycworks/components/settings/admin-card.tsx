"use client"

import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardHeader, 
    CardTitle } from "@/components/ui/card";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow } from "@/components/ui/table";
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface User {
    email: string;
    last_sign_in_at: string | null;
    id: string;
}

export default function AdminCard() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No authenticated user");

            const response = await fetch(`/api/settings/fetch-users?userId=${user.id}`);
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
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No authenticated user");

            const response = await fetch(`/api/settings/delete-user`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    adminId: user.id,
                    userToDeleteId: userId
                })
            });

            if (!response.ok) {
                throw new Error("Failed to delete user");
            }

            // Refresh the users list
            await fetchUsers();
        } catch (err) {
            console.error("Error deleting user:", err);
            setError(err instanceof Error ? err.message : "Failed to delete user");
        }
    };

    useEffect(() => {
        fetchUsers();

        // Set up real-time subscription
        const supabase = createClient();
        const subscription = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_OUT' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                fetchUsers();
            }
        });

        return () => {
            subscription.data.subscription.unsubscribe();
        };
    }, []);

    // need to fetch changes from DB
    const logs = [ // dummies
        {
            history: 'description 1',
            date: null,
        },
        {
            history: 'description 2',
            date: '01-31-2025',
        }
    ]

    return(
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Add, delete, or modify users in your system</CardDescription>
                </CardHeader>

                <CardContent>
                    <Table className="border-[1px]">
                    <TableHeader>
                        <TableRow className="border-b border-primary/20 hover:bg-primary/5">
                            <TableHead className="bg-primary/5 text-center">Email</TableHead>
                            <TableHead className="bg-primary/5 text-center">Last sign in</TableHead>
                            <TableHead className="bg-primary/5 text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-8">
                                    Loading users...
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-8 text-red-500">
                                    {error}
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-8">
                                    No users found
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user, index) => (
                                <TableRow key={index} className="border-b border-primary/10 hover:bg-primary/5">
                                    <TableCell className="font-medium text-center">{user.email}</TableCell>
                                    <TableCell className="font-medium text-center">
                                        {user.last_sign_in_at ? format(new Date(user.last_sign_in_at), "PPP") : '-'}
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
                                                    Are you sure you want to delete this user? This action cannot be undone.
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
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Audit Logs</CardTitle>
                    <CardDescription>Changes in the system</CardDescription>
                </CardHeader>

                <CardContent>
                    <Table className="border-[1px]">
                        <TableHeader>
                            <TableRow className="border-b border-primary/20 hover:bg-primary/5">
                                <TableHead className="bg-primary/5 text-center">History</TableHead>
                                <TableHead className="bg-primary/5 text-center">Date</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {logs.length > 0 ? (
                                logs.map((log, index) => (
                                    <TableRow 
                                    key={index}
                                    className="border-b border-primary/10 hover:bg-primary/5"
                                    >
                                        <TableCell className="font-medium text-center">{log.history}</TableCell>
                                        <TableCell className="font-medium text-center">{log.date ? format((new Date(log.date)), "PPP") : '-'}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center py-8">
                                        No logs found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    )
}