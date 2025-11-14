import { auth, currentUser} from "@clerk/nextjs/server"

export default async function DashboardPage() {
    const authObject = await auth();
    const currentUserObject = await currentUser();
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard page.</p>
    </div>
  )
}