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

// Update the schema to include the score type validation
const fieldSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["domain", "subtest"]),
  scoreType: z.enum(["T", "Z", "ScS", "StS", ""])
}).refine((data) => data.scoreType !== "", {
  message: "Score type must be selected",
  path: ["scoreType"]  // This will make the error appear on the scoreType field
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
    console.log(values);
    // Handle your form submission here

  };

  const handleClose = () => {
    // If the form is dirty (has changes), show confirmation
    if (form.formState.isDirty) {
      setShowConfirmDialog(true);
    } else {
      onOpenChange(false);
    }
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
                    <div key={field.id}>
                      <div className="flex gap-4 items-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className={`mt-8 ${fields[index].type === "subtest" ? "ml-[8%] mr-0" : ""}`}
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
                    {/* Add domain/subtest buttons that are populated under the last domain/subtest */}
                      <div className="flex gap-2 mt-2 mb-4 pl-14">
                        {/* Show Add Domain button only if current field is last */}
                        {index === fields.length - 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            className={`w-[20%] ${fields[index].type === "subtest" ? "ml-[8%]" : ""}`}
                            onClick={() => insert(index + 1, { 
                              name: "", 
                              type: "domain",
                              scoreType: ""
                            })}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Domain
                          </Button>
                        )}
                        {/* Show Add Subtest button with proper indentation based on current field type */}
                        <Button
                          type="button"
                          variant="outline"
                          className={`w-[20%] ${
                            fields[index].type === "subtest" && index !== fields.length - 1 ? "ml-[8%]" : ""
                          }`}
                          onClick={() => insert(index + 1, { 
                            name: "", 
                            type: "subtest",
                            scoreType: ""
                          })}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Subtest
                        </Button>
                      </div>
                  </div>
                  ))}
                  
                  {/* Add domain/subtest buttons that are only shown when the form is not dirty*/}
                  <div className="flex gap-2 mt-2 mb-4">
                  {!form.formState.isDirty && (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-[20%]"
                      onClick={() => append({ 
                        name: "", 
                        type: "domain",
                        scoreType: ""  // Default value
                      })}
                    >
                    <Plus className="h-4 w-4 mr-2" />
                      Add Domain
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-[20%]"
                      onClick={() => append({ 
                        name: "", 
                        type: "subtest",
                        scoreType: ""  // Default value
                      })}
                    >
                    <Plus className="h-4 w-4 mr-2" />
                        Add Subtest
                      </Button>
                    </>
                  )}
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