"use client";

import { useState } from "react";
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
import { Plus, Trash2 } from "lucide-react"; // You'll need to install lucide-react
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Update the schema to include the score type
const fieldSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["domain", "subtest"]),
  scoreType: z.enum(["T", "Z", "ScS", "StS"])
});

// Schema for the entire form
const formSchema = z.object({
  fields: z.array(fieldSchema),
});

export function CreationForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fields: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    // Handle your form submission here
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex  justify-center my-4">
          <Button>Create New Assessment</Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] h-[80vh] w-[100vw] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create Assessment Form</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-start">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <div className="flex-1 flex gap-4">
                    <FormField
                      control={form.control}
                      name={`fields.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>
                            {fields[index].type === "domain" ? "Domain Name:" : "Subtest Name:"}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={`Enter ${fields[index].type === "domain" ? "Domain" : "Subtest"} name`} 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`fields.${index}.scoreType`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Score Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-[100px]">
                              <SelectValue placeholder="Score" />
                            </SelectTrigger>
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
              ))}
            </div>

            <div className="space-y-4 mt-4 border-t pt-4">
              <div className="flex gap-2 w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="w-[32%]"
                  onClick={() => append({ 
                    name: "", 
                    type: "domain",
                    scoreType: "T"  // Default value
                  })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Domain
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-[32%]"
                  onClick={() => append({ 
                    name: "", 
                    type: "subtest",
                    scoreType: "T"  // Default value
                  })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subtest
                </Button>

                <Button type="submit" className="w-[32%]">
                  Create Assessment
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}