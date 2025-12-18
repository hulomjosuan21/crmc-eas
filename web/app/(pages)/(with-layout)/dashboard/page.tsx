"use client";
import { useState } from "react";
import { createDepartment } from "@/app/actions/createDepartmentAction";
import { Button } from "@/components/ui/button";
import axiosClient from "@/lib/axiosClient";

export default function Page() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("departmentCode", "CCS");
    formData.append("departmentName", "College of Computer Studies");
    formData.append("role", "department");
    formData.append("imageFile", file, file.name);
    const response = await axiosClient.post<{
      message: string;
      authorization_url: string;
    }>("/auth/department/signup", formData);
    const { authorization_url } = response.data;

    window.location.href = authorization_url;
  };

  const handleSubmitOfficer = async () => {
    const response = await axiosClient.post<{
      message: string;
      authorization_url: string;
    }>("/auth/officer/signup", {
      departmentId: "3f078ea8-c1e1-481a-9399-26cdc5656aa8",
      fullName: "Josuan Leonardo Hulom",
      roleLabel: "Test",
      assignedPermissions: ["Test", "Test"],
    });
    const { authorization_url } = response.data;

    window.location.href = authorization_url;
  };

  return (
    <main>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <Button onClick={handleSubmit}>Submit</Button>
      <Button onClick={handleSubmitOfficer}>officer</Button>
    </main>
  );
}
