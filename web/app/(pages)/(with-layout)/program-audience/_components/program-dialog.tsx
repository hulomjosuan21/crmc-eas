"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
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
  Field,
  FieldError,
  FieldLabel,
  FieldGroup,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Program, CreateProgram } from "@/types/program_types";
import { getError } from "@/lib/error";
import { createProgramSchema } from "@/schemas/program.schema";
import { programService } from "@/services/program.service";
import { VisuallyHidden } from "radix-ui";
import { ApiResponse } from "@/lib/response";

interface ProgramFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program?: Program | null;
  departmentId: string;
  refresh: () => Promise<any>;
}

export function ProgramDialog({
  open,
  onOpenChange,
  program,
  departmentId,
  refresh,
}: ProgramFormDialogProps) {
  const [inputData, setInputData] = useState({
    programName: "",
    programCode: "",
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  useEffect(() => {
    if (program && open) {
      setInputData({
        programName: program.programName,
        programCode: program.programCode,
      });
    } else if (!open) {
      setInputData({ programName: "", programCode: "" });
    }
    setErrors({});
  }, [program, open]);

  const createMutation = useMutation({
    mutationFn: (payload: CreateProgram) => programService.createOne(payload),
    onSuccess: async (response: ApiResponse) => {
      await refresh();
      toast.success(response.code, { description: response.detail });
      onOpenChange(false);
    },
    onError: (err) => {
      const { title, description } = getError(err);
      toast.error(title, { description });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true }), 1500);
      });
    },
    onSuccess: async (response: any) => {
      await refresh();
      toast.success(response.code, { description: response.detail });
      onOpenChange(false);
    },
    onError: (err) => {
      const { title, description } = getError(err);
      toast.error(title, { description });
    },
  });

  const handleSave = () => {
    const validationData = { ...inputData, departmentId };
    const result = createProgramSchema.safeParse(validationData);

    if (!result.success) {
      const formattedErrors: any = {};
      result.error.issues.forEach(
        (i) => (formattedErrors[i.path[0]] = i.message)
      );
      setErrors(formattedErrors);
      return;
    }

    if (program) {
      updateMutation.mutate();
    } else {
      createMutation.mutate(result.data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {program ? "Edit Program" : "Add New Program"}
          </DialogTitle>
          <VisuallyHidden.Root>
            <DialogDescription>dialog description goes here.</DialogDescription>
          </VisuallyHidden.Root>
        </DialogHeader>
        <FieldGroup className="">
          <Field>
            <FieldLabel>Program Name</FieldLabel>
            <Input
              value={inputData.programName}
              onChange={(e) =>
                setInputData({ ...inputData, programName: e.target.value })
              }
              placeholder="e.g. BS Information Technology"
              disabled={isPending}
            />
            {errors.programName && (
              <FieldError>{errors.programName}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel>Program Code</FieldLabel>
            <Input
              value={inputData.programCode}
              onChange={(e) =>
                setInputData({ ...inputData, programCode: e.target.value })
              }
              placeholder="e.g. BSIT"
              disabled={isPending}
            />
            {errors.programCode && (
              <FieldError>{errors.programCode}</FieldError>
            )}
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
