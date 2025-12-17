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
import signupImage from "@/public/images/28149134_7392281.jpg";
import { ImageCropper } from "@/components/ImageCrop";
import { useState } from "react";
import { useImageCropper } from "@/hooks/use-image-cropper";

export default function SignupClient() {
  const { file, onCropComplete } = useImageCropper();

  return (
    <div className="flex flex-col gap-6">
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Sign up Department</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter the details below to create a new department account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="departmentCode">Department Code</FieldLabel>
          <Input
            id="departmentCode"
            type="text"
            placeholder="e.g., CCS"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="departmentName">Department Name</FieldLabel>
          <Input
            id="departmentName"
            type="text"
            placeholder="e.g., College of Computer Studies"
            required
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
        <Field>
          <Button type="submit" className="w-full">
            Sign up Department
          </Button>
          <FieldDescription className="text-center text-xs">
            After clicking, you will be redirected to our OAuth provider to
            authenticate the department administrator.
          </FieldDescription>
        </Field>
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
