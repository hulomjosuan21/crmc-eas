"use client";

import { useAuth } from "@/hooks/useAuth";

export default function Page() {
  const { authDepartment, isLoading } = useAuth();
  return (
    <div className="p-8">
      <pre>
        {isLoading ? "Loading..." : JSON.stringify(authDepartment, null, 2)}
      </pre>
    </div>
  );
}
