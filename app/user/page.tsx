import { auth } from "@clerk/nextjs/server";
import { AccessDenied } from "@/components/access-denied";

export default async function UserPage() {
  const { sessionClaims } = await auth();

  if (sessionClaims?.metadata?.role !== "user" && sessionClaims?.metadata?.role !== "superadmin") {
    return <AccessDenied />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Page</h1>
      <p>Welcome to the user-specific content!</p>
    </div>
  );
}
