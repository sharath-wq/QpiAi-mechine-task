import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UserCard } from "./user-card";

export const UsersList = ({ users, setRole }: any) => (
  <Card>
    <CardHeader className="pb-4">
      <CardTitle className="text-lg sm:text-xl font-bold">
        User Management
      </CardTitle>
    </CardHeader>

    <CardContent>
      <div className="space-y-4">
        {users.map((user: any) => (
          <UserCard key={user.id} user={user} setRole={setRole} />
        ))}
      </div>
    </CardContent>
  </Card>
);
