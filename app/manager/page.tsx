import { auth } from "@clerk/nextjs/server";
import { AccessDenied } from "@/components/access-denied";

export default async function ManagerPage() {
  const { sessionClaims } = await auth();

  if (sessionClaims?.metadata?.role !== "manager" && sessionClaims?.metadata?.role !== "superadmin") {
    return <AccessDenied />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manager Page</h1>
      <p>Welcome, Manager! This content is accessible to managers.</p>
    </div>
  );
}
