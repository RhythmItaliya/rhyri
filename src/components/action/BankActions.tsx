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
import { useBankClient } from "../../hooks/useBank";

interface BankClientActionsProps {
  isBankPage: boolean;
  bankId: string;
}

export function BankActions({
  isBankPage,
  bankId,
}: BankClientActionsProps) {
  const navigate = useNavigate();
  const { deleteBankMutation } = useBankClient();

  const handleView = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/bank/${bankId}`);
  };

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/bank/edit/${bankId}`);
  };

  const handleDelete = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await deleteBankMutation.mutateAsync(bankId);
      if (isBankPage) {
        navigate("/banks");
      }
    } catch (error) {
      console.error("Failed to delete bank:", error);
    }
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
          <DropdownMenuLabel className="font-semibold">Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {!isBankPage && (
            <DropdownMenuItem onClick={handleView}>View</DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={deleteBankMutation.isPending}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
