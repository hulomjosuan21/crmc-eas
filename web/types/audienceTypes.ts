export interface Audience {
  audienceId: string;
  audienceName: string;
  departmentId: string;
  programId: string | null;
  programName: string | null;
  programCode: string | null;
  audienceCreatedAt: string;
  audienceUpdatedAt: string;
}

export type CreateAudience = Pick<
  Audience,
  "audienceName" | "programId" | "departmentId"
>;
