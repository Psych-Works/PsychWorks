import { z } from "zod";

  // Define the schema for domain/subtests
  const fieldSchema = z.object ({
    name: z.string().min(1, "Subtest name is required"),
    score_type: z.enum(["T", "Z", "ScS", "StS", ""]), // Add validation for specific score types 
    id: z.string().optional(), 
  }).refine((data) => data.score_type !== "", {
    message: "Score type must be selected",
  });
  
  // Define the schema for HierarchicalData
  export const hierarchicalDataSchema = z.object({
    type: z.enum(["domain", "subtest"]),
    fieldData: fieldSchema,
    subtests: z.array(fieldSchema).optional(), // You can refine this further if needed
  });

// Schema for the entire form
export const tableDataSchema = z.object({
fields: z.array(hierarchicalDataSchema),
associatedText: z.string(),
});

export type InputData = z.infer<typeof tableDataSchema>;
