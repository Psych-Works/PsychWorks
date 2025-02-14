"use client"

import { SearchBar } from "@/components/searchbar/search-bar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";

export default async function ReportEditPage(){
    const report = { // dummies
        name: 'Adult Female Master Template',
        updated_at: null,
        assessments: [ 
            {
                name: 'Intellectual Functioning',
                updated_at: '02-13-2025'
            },
            {
                name: 'Executive Functioning',
                updated_at: null,
            },
            {
                name: 'Neuropsychological Status',
                updated_at: '02-02-2025'
            }
        ],
    }
    return (
        <div className="container mx-auto space-y-8 py-8">
            <div className="text-3xl font-bold text-center my-8">Edit report template</div>

            <div className="my-8">
                <div className="grid grid-cols-4 my-8">
                    <div className="flex col-start-1 col-end-3 font-bold text-2xl bg-gray-200 items-center justify-center">
                        {report.name}
                    </div>
                    <div className="col-start-4 col-span-1">
                        <Button className="w-full h-full text-xl" 
                        onClick={() => {
                            // handle add
                        }}>Add assessment</Button>
                    </div>
                </div>

                <div className="my-8">
                    <Table className="border-[1px]">
                        <TableCaption>A list of all assessments in this report template</TableCaption>
                        <TableHeader>
                            <TableRow className="border-b border-primary/20 hover:bg-primary/5">
                                <TableHead className="bg-primary/5 text-center font-bold border-[1px] text-xl">Assessment Name</TableHead>
                                <TableHead className="bg-primary/5 text-center font-bold border-[1px] text-xl">Last Updated</TableHead>
                                <TableHead className="bg-primary/5 text-center font-bold border-[1px] text-xl">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {report.assessments.map((assessment, index) => (
                                <TableRow
                                key={index}
                                className="border-b border-primary/10 hover:bg-primary/5"
                                >
                                    <TableCell className="text-xl text-center border-[1px]">{assessment.name}</TableCell>
                                    <TableCell className="text-xl text-center border-[1px]">{assessment.updated_at ? format(new Date(assessment.updated_at), "PPP") : '-'}</TableCell>
                                    <TableCell className="border-[1px]">
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
                                                        <span className="font-bold">{assessment.name}</span>{" "}
                                                        will be permanently removed from this report template!
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
                    </Table>
                </div>
            </div>

            <div className="grid grid-cols-4">
                <Button className="col-start-1 col-span-1 h-full text-xl" 
                onClick={() => {
                    // handle cancel
                }}
                >Cancel</Button>

                <Button className="col-start-4 col-span-1 h-full text-xl"
                onClick={() => {
                    // handle edit
                }}>Edit Report</Button>
            </div>
        </div>
    )
}