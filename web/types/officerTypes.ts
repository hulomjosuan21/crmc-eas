export interface Officer {
  officerId: string;
  departmentId: string;
  fullName: string;
  roleLabel: string;
  assignedPermissions: string[];
  oauthId: string;
  oauthEmail: string;
  oauthImage: string | null;
  officerCreatedAt: string;
  officerUpdatedAt: string;
}

export type OfficerManagementTableRow = Pick<
  Officer,
  | "officerId"
  | "departmentId"
  | "fullName"
  | "roleLabel"
  | "assignedPermissions"
  | "oauthEmail"
  | "oauthImage"
  | "officerCreatedAt"
  | "officerUpdatedAt"
>;

export type OfficerSelectOption = Pick<Officer, "departmentId" | "fullName">;
