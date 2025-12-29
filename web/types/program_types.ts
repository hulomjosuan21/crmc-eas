export interface Program {
  programId: string;
  departmentId: string;
  programName: string;
  programCode: string;
  programCreatedAt: string;
  programUpdatedAt: string;
}

export type CreateProgram = Pick<
  Program,
  "programName" | "programCode" | "departmentId"
>;

export type ProgramSelectOption = Pick<
  Program,
  "programName" | "programCode" | "programId"
>;
