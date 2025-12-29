import { z } from "zod";

const createAudienceSchema = z.object({
  audienceName: z.string().min(3, "Audience name is required"),
  departmentId: z.string().min(1, "Department ID is required"),
  programId: z.string().min(1, "Department ID is required"),
});

export { createAudienceSchema };
