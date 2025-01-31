"use client"

import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import Link from "next/link";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

export default function UsersCard() {
    // need to fetch all users from DB
    const users = [
        {
            email: 'doe@email.com',
            last_sign_in_at: '',
        },
        {
            email: 'smith@email.com',
            last_sgn_in_at: '',
        }
    ]

    return(
        <Card>
            <CardHeader>
              <CardTitle>User management</CardTitle>
              <CardDescription>Add, delete, or modify users in your system</CardDescription>
            </CardHeader>

            <CardContent>
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Last sign in</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                {users.length > 0 ? (
                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow key={index}>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.last_sign_in_at}</TableCell>
                                <TableCell>
                                    <div className="flex justify-center gap-2">
                                        <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-primary/10"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>

                                        <Link href={`/`} passHref>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-primary/10"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </Link>

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
                    <TableCell colSpan={3} className="text-center">
                        No users found
                    </TableCell>
                )}
                </Table>
              </div>
            </CardContent>
          </Card>
    )
}