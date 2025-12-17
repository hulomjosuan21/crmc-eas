import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description: "Manage users, reports, and analytics",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const status = resolvedSearchParams.status as string | undefined;
  const email = resolvedSearchParams.email as string | undefined;

  return <main>{JSON.stringify({ status, email }, null)}</main>;
}
