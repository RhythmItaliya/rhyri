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
import { useCompany } from "../../hooks/useCompany";

interface CompanyActionsProps {
  isCompanyPage: boolean;
  companyId: string;
}

export function CompanyActions({
  isCompanyPage,
  companyId,
}: CompanyActionsProps) {
  const navigate = useNavigate();
  const { deleteCompanyMutation } = useCompany();

  const handleView = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/company/${companyId}`);
  };

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/company/edit/${companyId}`);
  };

  const handleDelete = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await deleteCompanyMutation.mutateAsync(companyId);
      if (isCompanyPage) {
        navigate("/companies");
      }
    } catch (error) {
      console.error("Failed to delete company:", error);
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
          <DropdownMenuLabel className="font-semibold">
            Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {!isCompanyPage && (
            <DropdownMenuItem onClick={handleView}>View</DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={deleteCompanyMutation.isPending}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
