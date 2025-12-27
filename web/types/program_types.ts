export interface Program {
  programId: string;
  departmentId: string;
  programName: string;
  programCode: string;
}

export type CreateProgram = Pick<
  Program,
  "programName" | "programCode" | "departmentId"
>;
