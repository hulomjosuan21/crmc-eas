"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldGroup,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { getError } from "@/lib/error";
import { Audience, CreateAudience } from "@/types/audienceTypes";
import { audienceService } from "@/services/audience.service";
import { createAudienceSchema } from "@/schemas/audience.schema";
import { useAuth } from "@/hooks/useAuth";
import { useProgramSelect } from "@/hooks/useProgramSelect";
import { VisuallyHidden } from "radix-ui";

interface AudienceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  audience?: Audience | null;
  departmentId: string;
  refresh: () => Promise<any>;
}

export function AudienceDialog({
  open,
  onOpenChange,
  audience,
  departmentId,
  refresh,
}: AudienceFormDialogProps) {
  const { authDepartmentId } = useAuth();
  const { programs, isLoading, isError, selectedProgram, setSelectedProgram } =
    useProgramSelect(authDepartmentId);

  const [inputData, setInputData] = useState({ audienceName: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (audience) {
        setInputData({ audienceName: audience.audienceName });
        if (audience.programId) setSelectedProgram(audience.programId);
      }
    } else {
      setInputData({ audienceName: "" });
      setSelectedProgram("");
      setErrors({});
    }
  }, [open, audience, setSelectedProgram]);

  const createMutation = useMutation({
    mutationFn: (payload: CreateAudience) => audienceService.createOne(payload),
    onSuccess: async () => {
      await refresh();
      toast.success("Audience created successfully");
      onOpenChange(false);
    },
    onError: (err) => {
      const { title, description } = getError(err);
      toast.error(title, { description });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      console.log("Mock Update Payload:", payload);
      return new Promise((resolve) => setTimeout(() => resolve(payload), 1500));
    },
    onSuccess: async () => {
      await refresh();
      toast.info("Update successful (Mock Mode)", {
        description: "The UI refreshed, but no backend call was made.",
      });
      onOpenChange(false);
    },
  });

  const handleSave = () => {
    const validationData = {
      audienceName: inputData.audienceName,
      departmentId: departmentId,
      programId: selectedProgram,
    };

    const result = createAudienceSchema.safeParse(validationData);

    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        formattedErrors[i.path[0] as string] = i.message;
      });
      setErrors(formattedErrors);
      return;
    }

    setErrors({});
    if (audience) {
      updateMutation.mutate(result.data);
    } else {
      createMutation.mutate(result.data as CreateAudience);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {audience ? "Edit Audience" : "Add New Audience"}
          </DialogTitle>
          <VisuallyHidden.Root>
            <DialogDescription>dialog description goes here.</DialogDescription>
          </VisuallyHidden.Root>
        </DialogHeader>

        <FieldGroup>
          <Field>
            <FieldLabel>Audience Name</FieldLabel>
            <Input
              value={inputData.audienceName}
              onChange={(e) => {
                setInputData({ ...inputData, audienceName: e.target.value });
                if (errors.audienceName)
                  setErrors((prev) => ({ ...prev, audienceName: "" }));
              }}
              placeholder="e.g., Grade 10 - Section A"
              disabled={isPending}
            />
            {errors.audienceName && (
              <FieldError>{errors.audienceName}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Select Program</FieldLabel>
            <Select
              value={selectedProgram}
              onValueChange={(val) => {
                setSelectedProgram(val);
                if (errors.programId)
                  setErrors((prev) => ({ ...prev, programId: "" }));
              }}
              disabled={isPending || isLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={isLoading ? "Loading..." : "Select a program"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Programs</SelectLabel>
                  {programs.map((p) => (
                    <SelectItem key={p.programId} value={p.programId}>
                      {p.programName} ({p.programCode})
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {/* Note: using 'programId' as the key here to match the schema */}
            {errors.programId && <FieldError>{errors.programId}</FieldError>}
          </Field>
        </FieldGroup>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending} className="w-24">
            {isPending ? <Spinner className="h-4 w-4" /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
