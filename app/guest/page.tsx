import { auth } from "@clerk/nextjs/server";
import { AccessDenied } from "@/components/access-denied";

export default async function GuestPage() {
  const { sessionClaims } = await auth();

  if (sessionClaims?.metadata?.role !== "guest" && sessionClaims?.metadata?.role !== "superadmin") {
    return <AccessDenied />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Guest Page</h1>
      <p>Welcome, Guest! This content is accessible to guest users.</p>
    </div>
  );
}
