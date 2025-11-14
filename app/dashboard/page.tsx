import { auth, currentUser} from "@clerk/nextjs/server"

export default async function DashboardPage() {
    const authObject = await auth();
    const currentUserObject = await currentUser();

    console.log("Auth Object:", authObject);
    console.log("Current User Object:", currentUserObject);
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard page.</p>
    </div>
  )
}