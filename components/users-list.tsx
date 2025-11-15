import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UserCard } from "./user-card";
import { AddUserForm } from "./add-user-form";
import { SafeUser } from "@/types/clerk";

interface UsersListProps {
  users: SafeUser[];
  setRole: (formData: FormData) => Promise<void>;
}

export const UsersList = ({ users, setRole }: UsersListProps) => (
  <Card>
    <CardHeader className="pb-4 flex flex-row justify-between items-center">
      <CardTitle className="text-lg sm:text-xl font-bold">
        User Management
      </CardTitle>

      <AddUserForm />
    </CardHeader>

    <CardContent>
      <div className="space-y-4">
        {users.map((user: SafeUser) => (
          <UserCard key={user.id} user={user} setRole={setRole} />
        ))}
      </div>
    </CardContent>
  </Card>
);
