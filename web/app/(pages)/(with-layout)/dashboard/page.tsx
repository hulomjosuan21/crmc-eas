import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | CRMC-EAS",
  description: "Manage users, reports, and analytics",
  icons: {
    icon: "/favicon.ico",
  },
};

async function fetchSlowData() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    message: "Data loaded successfully after 3 seconds!",
    timestamp: new Date().toLocaleTimeString(),
  };
}

export default async function Page() {
  const data = await fetchSlowData();
  return (
    <main className="h-fit-layout grid place-content-center">
      <section>{JSON.stringify(data, null, 2)}</section>
    </main>
  );
}
