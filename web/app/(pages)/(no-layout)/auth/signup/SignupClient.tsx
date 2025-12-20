"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ImageCropper } from "@/components/ImageCrop";
import { useState } from "react";
import { useImageCropper } from "@/hooks/use-image-cropper";
import axios, { AxiosError } from "axios";
import axiosClient from "@/lib/axiosClient";
import { ApiResponse } from "@/lib/response";
import { toast } from "sonner";

export default function SignupClient() {
  const { file, onCropComplete } = useImageCropper();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError("Please select and crop a department image.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      formData.append("imageFile", file);
      const response = await axiosClient.post<ApiResponse<string>>(
        `/auth/department/signup`,
        formData
      );

      const data = response.data;

      toast.success(data.detail);

      if (data.payload) {
        setTimeout(() => {
          window.location.href = data.payload!;
        }, 1500);
      }
    } catch (err) {
      console.error("Signup error:", err);
      if (axios.isAxiosError(err)) {
        const errorMsg =
          err.response?.data?.detail ||
          "Something went wrong. Please try again.";
        setError(errorMsg);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Sign up Department</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter the details below to create a new department account
          </p>
        </div>

        {/* Added Form Tag */}
        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <Field>
            <FieldLabel htmlFor="departmentCode">Department Code</FieldLabel>
            <Input
              id="departmentCode"
              name="departmentCode" // Added name for FormData
              type="text"
              placeholder="e.g., CCS"
              required
              disabled={isLoading}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="departmentName">Department Name</FieldLabel>
            <Input
              id="departmentName"
              name="departmentName" // Added name for FormData
              type="text"
              placeholder="e.g., College of Computer Studies"
              required
              disabled={isLoading}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="departmentImage">Department Image</FieldLabel>
            <ImageCropper
              id="departmentImage"
              quality={0.25}
              ratio={16 / 9}
              onCropComplete={onCropComplete}
              placeholder="Select an image..."
            />
          </Field>

          {error && (
            <p className="text-sm text-red-500 text-center font-medium">
              {error}
            </p>
          )}

          <Field>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Redirecting..." : "Sign up Department"}
            </Button>
            <FieldDescription className="text-center text-xs mt-2">
              After clicking, you will be redirected to our OAuth provider to
              authenticate the department administrator.
            </FieldDescription>
          </Field>
        </form>

        <div className="text-center text-sm">
          Already registered?{" "}
          <Link href="/auth/signin" className="underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </FieldGroup>
    </div>
  );
}
