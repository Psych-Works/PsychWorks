import { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, CircleMinus } from "lucide-react"; // You'll need to install lucide-react
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Update the schema to track parent-child relationships
const fieldSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["domain", "subtest"]),
  scoreType: z.enum(["T", "Z", "ScS", "StS", ""]),
  Id: z.string().optional(), // To track which domain a subtest belongs to
}).refine((data) => data.scoreType !== "", {
  message: "Score type must be selected",
});

// Schema for the entire form
const formSchema = z.object({
  fields: z.array(fieldSchema),
});

// Add this interface at the top of your creation-form.tsx file
interface CreationFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Add this interface above the onSubmit function
interface HierarchicalData {
  type: 'domain' | 'subtest';
  domainData?: {
    name: string;
    score_type: string;
  };
  subtestData?: {
    name: string;
    score_type: string;
  };
  subtests?: any[];
  id?: string;
}

export const CreationForm = ({ isOpen, onOpenChange }: CreationFormProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Add this useEffect to ensure the dialog starts closed
  useEffect(() => {
    onOpenChange(false);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fields: [],
    },
  });

  const { fields, append, remove, insert } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const hierarchicalData = values.fields.reduce<HierarchicalData[]>((acc, field) => {
      if (field.type === "domain") {
        acc.push({
          type: "domain",
          domainData: {
            name: field.name,
            score_type: field.scoreType,
          },
          subtests: []
        });
      } else if (field.type === "subtest" && field.Id) {
        // Find parent domain and add subtest
        const parentDomain = acc.find(item => item.id === field.Id);
        if (parentDomain) {
          parentDomain.subtests = parentDomain.subtests || [];
          parentDomain.subtests.push({
            name: field.name,
            score_type: field.scoreType,
          });
        }
      } else {
        // Standalone subtest
        acc.push({
          type: "subtest",
          subtestData: {
            name: field.name,
            score_type: field.scoreType,
          }
        });
      }
      return acc;
    }, []);

    console.log(hierarchicalData);
    // Handle submission...
  };

  const handleClose = () => {
    // If the form is dirty (has changes), show confirmation
    if (form.formState.isDirty) {
      setShowConfirmDialog(true);
    } else {
      onOpenChange(false);
    }
  };

  // Update the helper function to distinguish between child and standalone subtests
  const isChildSubtest = (index: number) => {
    const currentField = fields[index];
    // console.log(currentField);
    return currentField.type === "subtest" && currentField.Id;
  };

  // Add this new function to handle domain deletion
  const handleRemove = (index: number) => {
    const currentField = fields[index];
    if (currentField.type === "domain") {
      // If it's a domain, find and remove all associated subtests
      const subtestIndices: number[] = [];

      // Find all subtests that belong to this domain
      fields.forEach((field, idx) => {
        if (field.Id === currentField.id) {
          subtestIndices.push(idx);
        }
      });

      // Remove subtests from highest index to lowest to avoid shifting issues
      [...subtestIndices].reverse().forEach(idx => remove(idx));
    }
    // Remove the current field (domain or subtest)
    remove(index);
  };

  return (
    <>
      {/* Button to open the dialog */}
      <div className="flex justify-center my-4">
        <Button onClick={() => onOpenChange(true)}>Add Domain/Subtest</Button>
      </div>

      {/* Dialog to add domain/subtest 
      dialog is a popup that appears when the button is clicked*/}
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[80%] h-[80vh] w-[80%] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Create Assessment Form</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col flex-1 overflow-hidden"
            >
              {/* Main scrollable container */}
              <div className="flex-1 overflow-auto">
                <div className="pr-2 space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className={`${isChildSubtest(index) ? "ml-16" : ""}`}>
                      <div className="flex gap-4 items-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(index)}
                          className="mt-8"
                        >
                          <CircleMinus
                            className="h-6 w-6"
                            style={{ color: "#757195" }}
                          />
                        </Button>

                        <div className="flex-1 flex gap-4">
                          {/* Form field for the name of the domain/subtest */}
                          <FormField
                            control={form.control}
                            name={`fields.${index}.name`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel >
                                  {fields[index].type === "domain" ? "Domain Name:" : "Subtest Name:"}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={`Enter ${fields[index].type === "domain" ? "Domain" : "Subtest"} name`}
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          {/* Form field for the score type of the domain/subtest that contains the dropdown for the score type*/}
                          <FormField
                            control={form.control}
                            name={`fields.${index}.scoreType`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Score Type:</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-[100px]">
                                      <SelectValue placeholder="Score" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="T">T</SelectItem>
                                    <SelectItem value="Z">Z</SelectItem>
                                    <SelectItem value="ScS">ScS</SelectItem>
                                    <SelectItem value="StS">StS</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      {/* Button for adding child subtests under domains */}
                      <div className="flex gap-2 mt-2 mb-4 pl-14">
                        {field.type === "domain" && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              insert(index + 1, {
                                name: "",
                                type: "subtest",
                                scoreType: "",
                                Id: field.id
                              });
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Child Subtest
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add domain/subtest buttons that are always shown at the bottom */}
                  <div className="flex gap-2 mt-2 mb-4">
                    <Button
                      type="button"
                      className="w-[20%] bg-[#757195] text-white hover:bg-[#757195]/90"
                      onClick={() => append({
                        name: "",
                        type: "domain",
                        scoreType: "",
                        // parentId: ""
                      })}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Domain
                    </Button>

                    <Button
                      type="button"
                      className="w-[20%] bg-[#757195] text-white hover:bg-[#757195]/90"
                      onClick={() => append({
                        name: "",
                        type: "subtest",
                        scoreType: ""
                      })}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Standalone Subtest
                    </Button>
                  </div>
                </div>
              </div>

              {/* Footer stays fixed at bottom */}
              <div className="sticky bottom-0 mt-auto h-14 border-t bg-white flex items-center justify-end px-4">
                <Button type="submit" className="w-[32%] h-9">
                  Create Assessment
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Alert dialog to confirm closing the dialog 
      when the user clicks the close button, the dialog will close and the form will be reset
      */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to close?</AlertDialogTitle>
            <AlertDialogDescription>
              Any unsaved changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowConfirmDialog(false);
                onOpenChange(false);
                form.reset(); // Reset form state
              }}
            >
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}