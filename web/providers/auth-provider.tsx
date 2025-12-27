"use client";
import axiosClient from "@/lib/axiosClient";
import { AuthDepartment } from "@/types/auth";
import { useRouter, usePathname } from "next/navigation";
import { createContext, ReactNode, useEffect, useState } from "react";

interface AuthContextType {
  authDepartment: AuthDepartment | null;
  authDepartmentId: string | null; // <--- Added direct ID access
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export const AuthContext = createContext<AuthContextType>({
  authDepartment: null,
  authDepartmentId: null,
  isLoading: true,
  isError: false,
  error: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [authDepartment, setAuthDepartment] = useState<AuthDepartment | null>(
    null
  );
  const [isLoading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      setIsError(false);
      setError(null);

      // Don't check auth or redirect if we are already on a public auth page
      if (pathname.startsWith("/auth")) {
        setLoading(false);
        return;
      }

      try {
        const res = await axiosClient.get<AuthDepartment>("/auth/me");

        if (res.status === 200 && res.data) {
          setAuthDepartment(res.data);
        } else {
          // If response is valid but no data, treat as unauthenticated
          setAuthDepartment(null);
          router.push("/auth/signin");
        }
      } catch (err) {
        setAuthDepartment(null);
        setIsError(true);

        if (err instanceof Error) {
          setError(err);
        } else {
          setError(
            new Error("An unknown error occurred during authentication")
          );
        }

        // Redirect on error
        router.push("/auth/signin");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  // Derived value for convenience
  const authDepartmentId = authDepartment?.authDepartmentId ?? null;

  return (
    <AuthContext.Provider
      value={{
        authDepartment,
        authDepartmentId, // <--- Exposed here
        isLoading,
        isError,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
