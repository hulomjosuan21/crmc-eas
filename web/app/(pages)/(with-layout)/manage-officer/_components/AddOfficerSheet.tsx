import { MultiSelect } from "@/components/multi-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { routePermissions } from "@/lib/routePermission";

import { useDirection } from "@radix-ui/react-direction";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

export default function AddOfficerSheet() {
  const direction = useDirection();
  const [assignedPermissions, setAssignedPermissions] = useState<string[]>([]);

  const assignedPermissionOptions = useMemo<{ value: string; label: string }[]>(
    () => routePermissions,
    []
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm">
          Add officer <Plus className="ml-2" size={16} />
        </Button>
      </SheetTrigger>

      <SheetContent className="p-0" dir={direction}>
        <SheetHeader className="py-4 px-5">
          <SheetTitle>Add Officer</SheetTitle>
          <SheetDescription>
            Fill in the officer's details below
          </SheetDescription>
        </SheetHeader>

        <SheetBody className="py-0 px-2 grow">
          <ScrollArea className="text-sm h-[calc(100dvh-190px)] pe-3 -me-3">
            <div className="space-y-4 [&_h3]:font-semibold [&_h3]:text-foreground px-2 py-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roleLabel">Role label</Label>
                <Input id="roleLabel" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roleLabel">Role label</Label>
                <MultiSelect
                  options={assignedPermissionOptions}
                  onValueChange={setAssignedPermissions}
                  defaultValue={assignedPermissions}
                />
              </div>
            </div>
          </ScrollArea>
        </SheetBody>

        <SheetFooter className="px-4 py-5 border-t border-border">
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button type="submit">Save Officer</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
