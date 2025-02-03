import { FieldArrayWithId, useFieldArray, useForm } from "react-hook-form";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InputData, tableDataSchema } from "@/types/table-input-data";
import { useTableFormContext } from "./assessments-form-context";

export const CreationForm = () => {
  const { setCurrentStep, formData, updateFormData } = useTableFormContext();

  const form = useForm<z.infer<typeof tableDataSchema>>({
    resolver: zodResolver(tableDataSchema.pick({ fields: true })),
    defaultValues: { fields: formData.fields || [] },
  });

  const { fields, append, remove, insert } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  const { handleSubmit } = form;

  // Add domain, subtest and child subtest as well as update the form data
  const handleAddDomain = () => {
    append({
      type: "domain",
      fieldData: {
        name: "",
        score_type: "",
        id: crypto.randomUUID(),
      },
      subtests: [],
    });
    updateFormData(transformToInputData());
  };

  const handleAddSubtest = () => {
    append({
      type: "subtest",
      fieldData: {
        name: "",
        score_type: "",
        id: crypto.randomUUID(),
      },
    });
    updateFormData(transformToInputData());
  };
  // Add child subtest to a domain
  const handleAddChildSubtest = (index: number) => {
    const parentDomain = fields[index];
    if (parentDomain.type === "domain") {
      const updatedFields = [...fields];
      updatedFields[index].subtests = [
        ...(parentDomain.subtests || []),
        {
          name: "",
          score_type: "",
          id: crypto.randomUUID(),
          domain_id: parentDomain.fieldData.id,
        },
      ];
      form.setValue("fields", updatedFields);
      updateFormData(transformToInputData());
    }
  };

  // Add this new function to handle domain deletion
  const handleRemove = (index: number) => {
    const currentField = fields[index];

    if (currentField.type === "domain") {
      // If it's a domain, find and remove all associated subtests
      const subtestIndices: number[] = [];

      // Find all subtests that belong to this domain
      fields.forEach((field, idx) => {
        if (
          field.type === "subtest" &&
          field.fieldData.id === currentField.id
        ) {
          subtestIndices.push(idx);
        }
      });

      // Remove subtests from highest index to lowest to avoid shifting issues
      [...subtestIndices].reverse().forEach((idx) => remove(idx));

      // Remove the domain itself
      remove(index);
    } else if (currentField.type === "subtest") {
      // First, check if this is a child subtest and update the parent domain
      const parentDomainIndex = fields.findIndex(
        (field) =>
          field.type === "domain" &&
          field.subtests?.some(
            (subtest) => subtest.id === currentField.fieldData.id
          )
      );

      if (parentDomainIndex !== -1) {
        // Update the parent domain's subtests array first
        const updatedFields = [...fields];
        const parentDomain = updatedFields[parentDomainIndex];
        parentDomain.subtests = parentDomain.subtests?.filter(
          (subtest) => subtest.id !== currentField.fieldData.id
        );
        form.setValue("fields", updatedFields);
      }

      // Then remove the subtest from the form
      remove(index);
    }

    // Update the form data after all modifications
    updateFormData(transformToInputData());
  };

  // This translates the array from the form to the InputData type shared between the forms
  // creation-form.tsx

  // Replace the existing transformToInputData function with:
  function transformToInputData(): InputData {
    const formValues = form.getValues();
    const transformedFields = formValues.fields.map((field) => {
      if (field.type === "domain") {
        return {
          type: field.type,
          fieldData: {
            name: field.fieldData.name,
            score_type: field.fieldData.score_type,
            id: field.fieldData.id,
          },
          subtests:
            field.subtests?.map((subtest) => ({
              name: subtest.name,
              score_type: subtest.score_type,
              id: subtest.id,
              domain_id: field.fieldData.id,
            })) || [],
        };
      } else {
        // For standalone subtests
        return {
          type: field.type,
          fieldData: {
            name: field.fieldData.name,
            score_type: field.fieldData.score_type,
            id: field.fieldData.id,
            domain_id: field.fieldData.id,
          },
        };
      }
    });

    return {
      fields: transformedFields,
      associatedText: formData.associatedText || "",
    };
  }

  const handleNext = () => {
    updateFormData(transformToInputData());
    setCurrentStep(2);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(handleNext)}
        className="flex flex-col flex-1 overflow-hidden"
      >
        <div className="flex-1 overflow-auto">
          <div className="pr-2 space-y-4">
            {fields.map((field, index) => (
              <div key={field.id}>
                {/* Domain/Standalone Subtest Container */}
                <div className="flex gap-4 items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(index)}
                    className="mt-8"
                  >
                    <CircleMinus className="h-6 w-6 text-[#757195]" />
                  </Button>

                  <div className="flex-1 flex flex-col gap-4">
                    <div className="flex gap-4">
                      {/* Name Field */}
                      <FormField
                        control={form.control}
                        name={`fields.${index}.fieldData.name`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>
                              {fields[index].type === "domain"
                                ? `Domain Name ${index + 1}`
                                : `Subtest Name ${index + 1}`}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={`Enter ${fields[index].type} name`}
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Score Type Field */}
                      <FormField
                        control={form.control}
                        name={`fields.${index}.fieldData.score_type`}
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

                    {/* Add Child Subtest Button - Moved here */}
                    {field.type === "domain" && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleAddChildSubtest(index)}
                        className="self-start"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Subtest
                      </Button>
                    )}
                  </div>
                </div>

                {/* Nested Subtests */}
                {field.type === "domain" && (
                  <div className="ml-16 mt-4 space-y-4">
                    {field.subtests?.map((subtest, subIndex) => (
                      <div key={subtest.id} className="flex gap-4 items-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            // Remove subtest from domain's subtests array
                            const updatedFields = [...fields];
                            updatedFields[index].subtests =
                              updatedFields[index].subtests?.filter(
                                (_, i) => i !== subIndex
                              ) || [];
                            form.setValue("fields", updatedFields);
                            updateFormData(transformToInputData());
                          }}
                          className="mt-8"
                        >
                          <CircleMinus className="h-6 w-6 text-[#757195]" />
                        </Button>

                        <div className="flex-1 flex gap-4">
                          {/* Subtest Name */}
                          <FormField
                            control={form.control}
                            name={`fields.${index}.subtests.${subIndex}.name`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel>
                                  Subtest Name {subIndex + 1}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter Subtest name"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          {/* Subtest Score Type */}
                          <FormField
                            control={form.control}
                            name={`fields.${index}.subtests.${subIndex}.score_type`}
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
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Add Buttons */}
            <div className="flex gap-2 mt-2 mb-4">
              <Button
                type="button"
                className="w-[20%] bg-[#757195] text-white hover:bg-[#757195]/90"
                onClick={handleAddDomain}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Domain
              </Button>
              <Button
                type="button"
                className="w-[20%] bg-[#757195] text-white hover:bg-[#757195]/90"
                onClick={handleAddSubtest}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Standalone Subtest
              </Button>
            </div>
          </div>
        </div>

        {/* Next Button */}
        <div className="sticky bottom-0 mt-auto h-14 border-t bg-white flex items-center px-4">
          <Button className="w-[32%] h-9 ml-auto" type="submit">
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
};
