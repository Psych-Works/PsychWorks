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

export default function AdminCard() {
    // need to fetch all users from DB
    const users = [ // dummies
        {
            email: 'doe@email.com',
            last_sign_in_at: '02-03-2025',
        },
        {
            email: 'smith@email.com',
            last_sgn_in_at: '',
        }
    ]

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

                    {users.length > 0 ? (
                        <TableBody>
                            {users.map((user, index) => (
                                <TableRow 
                                key={index}
                                className="border-b border-primary/10 hover:bg-primary/5"
                                >
                                    <TableCell className="font-medium text-center">{user.email}</TableCell>
                                    <TableCell className="font-medium text-center">{user.last_sign_in_at ? format((new Date(user.last_sign_in_at)), "PPP") : '-'}</TableCell>
                                    <TableCell>
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
                                                <AlertDialogTitle>
                                                    Do you really want to delete this?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Data of{" "}
                                                    <span className="font-bold">{}</span>{" "}
                                                    will be permanently removed!
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>

                                                <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => {
                                                        // handle deletion
                                                    }}
                                                >
                                                    Continue
                                                </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                    ) : (
                        <TableCell colSpan={3} className="text-center py-8">
                            No users found
                        </TableCell>
                    )}
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