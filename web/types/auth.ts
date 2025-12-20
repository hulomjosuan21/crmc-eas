export interface AuthDepartment {
  authDepartmentId: string;
  authName: string;
  authEmail: string;
  authType: "department" | "officer";
  authRole: "school" | "department" | "officer";
  authPermissions: string[];
  authImage: string | null;
}
