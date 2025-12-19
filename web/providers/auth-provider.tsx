"use client";
import axiosClient from "@/lib/axiosClient";
import { AuthDepartment } from "@/types/auth";
import { createContext, ReactNode, useEffect, useState } from "react";

interface AuthContextType {
  authDepartment: AuthDepartment | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export const AuthContext = createContext<AuthContextType>({
  authDepartment: null,
  isLoading: true,
  isError: false,
  error: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
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

      try {
        const res = await axiosClient.get<AuthDepartment>("/auth/me");

        if (res.status === 200 && res.data) {
          setAuthDepartment(res.data);
        } else {
          setAuthDepartment(null);
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
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ authDepartment, isLoading, isError, error }}>
      {children}
    </AuthContext.Provider>
  );
}
