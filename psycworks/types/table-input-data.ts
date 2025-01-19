import { z } from "zod";

export interface HierarchicalData {
    type: "domain" | "subtest";
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
    associatedText?: string;
  }

// Update the schema to track parent-child relationships
export const fieldSchema = z
.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["domain", "subtest"]),
  scoreType: z.enum(["T", "Z", "ScS", "StS", ""]),
  Id: z.string().optional(), // To track which domain a subtest belongs to
})
.refine((data) => data.scoreType !== "", {
  message: "Score type must be selected",
});

// Schema for the entire form
export const tableDataSchema = z.object({
fields: z.array(fieldSchema),
associatedText: z.string(),
});

export type InputData = z.infer<typeof tableDataSchema>;
