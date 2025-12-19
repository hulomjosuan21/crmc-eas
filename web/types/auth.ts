export interface AuthDepartment {
  auth_department_id: string;
  user_type: "department" | "officer";
  auth_role: "school" | "department" | "officer";
  auth_permissions: string[];
}
