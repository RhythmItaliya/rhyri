import * as React from "react";
import { PageHeader, PageHeaderHeading } from "../../components/PageHeader";
import { db } from "../../lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
  query,
  orderBy,
} from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "../../lib/utils";
import { Calendar } from "../../components/ui/Calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/Popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";
import { Skeleton } from "../../components/Skeleton";

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  restrictionDate?: Timestamp | null;
  restrictionType?: "disable" | "hide";
  lastLogin?: Timestamp;
}

export function AdminPage() {
  const [users, setUsers] = React.useState<UserProfile[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchUsers = async () => {
    try {
      const q = query(collection(db, "users"), orderBy("lastLogin", "desc"));
      const querySnapshot = await getDocs(q);
      const userList: UserProfile[] = [];
      querySnapshot.forEach((doc) => {
        userList.push({ uid: doc.id, ...doc.data() } as UserProfile);
      });
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRestrictionDate = async (
    uid: string,
    date: Date | null,
  ) => {
    try {
      const userRef = doc(db, "users", uid);

      await updateDoc(userRef, {
        restrictionDate: date ? Timestamp.fromDate(date) : null,
      });

      toast.success("Restriction date updated");
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error("Error updating restriction date:", error);
      toast.error("Failed to update restriction date");
    }
  };

  const handleUpdateRestrictionType = async (uid: string, type: string) => {
    try {
      const userRef = doc(db, "users", uid);

      await updateDoc(userRef, {
        restrictionType: type,
      });

      toast.success("Restriction type updated to " + type);
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error("Error updating restriction type:", error);
      toast.error("Failed to update restriction type");
    }
  };

  return (
    <div className="space-y-6 px-4 md:px-0">
      <PageHeader>
        <PageHeaderHeading>Admin: User Management</PageHeaderHeading>
      </PageHeader>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Email</TableHead>
              <TableHead>Display Name</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Restrict Before Date</TableHead>
              <TableHead>Restriction Mode</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={6}>
                    <Skeleton className="w-full h-10" />
                  </TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.displayName || "N/A"}</TableCell>
                  <TableCell>
                    {user.lastLogin
                      ? format(user.lastLogin.toDate(), "PPpp")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[180px] pl-3 text-left font-normal border-border bg-background",
                            !user.restrictionDate && "text-muted-foreground",
                          )}
                        >
                          {user.restrictionDate ? (
                            format(user.restrictionDate.toDate(), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            user.restrictionDate
                              ? user.restrictionDate.toDate()
                              : undefined
                          }
                          onSelect={(date) =>
                            handleUpdateRestrictionDate(user.uid, date || null)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={user.restrictionType || "disable"}
                      onValueChange={(value) =>
                        handleUpdateRestrictionType(user.uid, value)
                      }
                    >
                      <SelectTrigger className="w-[180px] bg-background">
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="disable">
                          Disable (Read-Only)
                        </SelectItem>
                        <SelectItem value="hide">Hide Completely</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      sizes="sm"
                      onClick={() =>
                        handleUpdateRestrictionDate(user.uid, null)
                      }
                    >
                      Clear Date
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
