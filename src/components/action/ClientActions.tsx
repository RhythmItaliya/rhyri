import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { useClient } from "../../hooks/useClient";

interface ClientActionsProps {
  isClientPage: boolean;
  clientId: string;
}

export function ClientActions({ isClientPage, clientId }: ClientActionsProps) {
  const navigate = useNavigate();
  const { deleteClientMutation } = useClient();

  const handleView = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/client/${clientId}`);
  };

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/client/edit/${clientId}`);
  };

  const handleDelete = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await deleteClientMutation.mutateAsync(clientId);
      if (isClientPage) {
        navigate("/clients");
      }
    } catch (error) {
      console.error("Failed to delete client:", error);
    }
  };

  const handleViewAll = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/client/invoice/${clientId}`);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" sizes="icon">
            <DotsHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="font-semibold">
            Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {!isClientPage && (
            <DropdownMenuItem onClick={handleView}>View</DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleViewAll}>
            View All Invoices
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={deleteClientMutation.isPending}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
