import { z } from "zod";

const createProgramSchema = z.object({
  programName: z
    .string()
    .min(10, "Program name is required")
    .regex(
      /^(Bachelor|Master|Doctorate).*of/i,
      "Program name must follow the format: Bachelor/Master/Doctorate of …"
    ),
  programCode: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .regex(/^[A-Z]+$/, "Program code must be all uppercase letters"),
  departmentId: z.string().min(1, "Department ID is required"),
});

export { createProgramSchema };
