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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { hierarchicalDataSchema, InputData , tableDataSchema} from "@/types/table-input-data";
import { useTableFormContext } from "./assessments-form-context";

export const CreationForm = () => {

  const { setCurrentStep ,formData, updateFormData} = useTableFormContext();
  const form = useForm<z.infer<typeof tableDataSchema>>({
    resolver: zodResolver(tableDataSchema.pick({fields: true})),
    defaultValues: { fields : formData.fields || [] },
  });

  const { fields, append, remove, insert } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  const onSubmit = (values: z.infer<typeof tableDataSchema>) => {
    // Merge the id from 'fields' into 'values.fields'
    const fieldsWithIds = values.fields.map((fieldValue, index) => ({
      ...fieldValue,
      id: fields[index].id,
    }));
  
    // Accumulate data into the correct format
    const newInputData: InputData = fieldsWithIds.reduce<InputData>(
      (acc, field) => {
        if (field.type === "domain") {
          acc.fields.push({
            type: "domain",
            fieldData: {
              name: field.fieldData?.name || "",
              score_type: field.fieldData?.score_type || "",
              id: field.id,
            },
            subtests: [], // Initialize empty subtests
          });
        } else if (field.type === "subtest" && field.id) {
          // Attach subtest to the correct domain
          const parentDomain = acc.fields.find(
            (item) => item.type === "domain" && item.fieldData.id === field.id
          );
          if (parentDomain) {
            parentDomain.subtests = parentDomain.subtests || [];
            parentDomain.subtests.push({
              name: field.fieldData?.name || "",
              score_type: field.fieldData?.score_type || "",
              id: field.fieldData.id,
            });
          }
        } else {
          // Add standalone subtest
          acc.fields.push({
            type: "subtest",
            fieldData: {
              name: field.fieldData?.name || "",
              score_type: field.fieldData?.score_type || "",
            },
          });
        }
  
        return acc;
      },
      { fields: [], associatedText: values.associatedText } // Initialize acc to match InputData
    );
  
    console.log(newInputData);
  };
  
  // Update the helper function to distinguish between child and standalone subtests
  const isChildSubtest = (index: number) => {
    const currentField = fields[index];
    return (
      currentField.type === "subtest" && // Must be a subtest
      currentField.fieldData.id && // Must have an ID
      fields.some(
        (field) => field.type === "domain" && field.id === currentField.fieldData.id
      ) // Must have a matching domain ID
    );
  };
  
  // Add this new function to handle domain deletion
  const handleRemove = (index: number) => {
    const currentField = fields[index];
    if (currentField.type === "domain") {
      // If it's a domain, find and remove all associated subtests
      const subtestIndices: number[] = [];

      // Find all subtests that belong to this domain
      fields.forEach((field, idx) => {
        if (field.fieldData.id === currentField.id) {
          subtestIndices.push(idx);
        }
      });
      console.log(subtestIndices);

      // Remove subtests from highest index to lowest to avoid shifting issues
      [...subtestIndices].reverse().forEach((idx) => remove(idx));
    }
    // Remove the current field (domain or subtest)
    remove(index);
  };

  const handleNext = () => {
    // updateFormData();
    setCurrentStep(2);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
        {/* Main scrollable container */}
        <div className="flex-1 overflow-auto">
          <div className="pr-2 space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className={`${isChildSubtest(index) ? "ml-16" : ""}`}
              >
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
                    name={`fields.${index}.${
                      fields[index].type === "domain" ? "fieldData.name" : "fieldData.name"
                    }`}
                    render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>
                        {fields[index].type === "domain"
                        ? "Domain Name:"
                        : "Subtest Name:"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={`Enter ${
                          fields[index].type === "domain"
                          ? "Domain"
                          : "Subtest"
                          } name`}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                    )}
                  />

                  {/* Form field for the score type of the domain/subtest that contains the dropdown for the score type*/}
                  <FormField
                    control={form.control}
                    name={`fields.${index}.${
                      fields[index].type === "domain" ? "fieldData.score_type" : "fieldData.score_type"
                    }`}
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
                    type: "subtest",
                    fieldData: {
                      name: "",
                      score_type: "",
                      id: field.id,
                    },
                    });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                    Add Subtest
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
                onClick={() =>
                  append({
                  type: "domain",
                  fieldData: {
                    name: "",
                    score_type: ""
                  },
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                  Add Domain
                </Button>

              <Button
                type="button"
                className="w-[20%] bg-[#757195] text-white hover:bg-[#757195]/90"
                onClick={() =>
                  append({
                  type: "subtest",
                  fieldData: {
                    name: "",
                    score_type: ""
                  },
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                  Add Standalone Subtest
              </Button>
            </div>
          </div>
        </div>

{/* ------------------------------------------------------------------------------------ */}

        <div className="sticky bottom-0 mt-auto h-14 border-t bg-white flex items-center px-4">
          <Button
            className="w-[32%] h-9 ml-auto"
            onClick= {handleNext}
            >
            Next
            </Button>
        </div>
      </form>
    </Form>
  </>
  );
};