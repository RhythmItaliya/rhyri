import { DotsHorizontalIcon } from "@radix-ui/react-icons";

import ProgressPopup from "../popup/ProgressPopup";
import { Button } from "../ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import { useChallanActionsHandlers } from "./subActions/ChallanActionsHandlers";

interface ChallanActionsProps {
  isChallanPage: boolean;
  challanId: string;
  isMarkedAsPaid: boolean;
  isDrafted: boolean;
  isPending: boolean;
}

export function ChallanActions({
  isChallanPage,
  challanId,
  isMarkedAsPaid,
  isDrafted,
  isPending,
}: ChallanActionsProps) {
  const {
    handleView,
    handleDownload,
    handleEdit,
    handleDelete,
    handleMarkAsPaid,
    handleMarkAsPending,
    handleAddToDraft,
    progress,
    showMarkAsPaid,
    showAddToDraft,
    showMarkAsPending,
    markChallanAsPaidMutation,
    addChallanToDraftMutation,
    addChallanToPendingMutation,
    deleteChallanMutation,
  } = useChallanActionsHandlers({
    challanId,
    isMarkedAsPaid,
    isDrafted,
    isPending,
  });

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
          {!isChallanPage && (
            <DropdownMenuItem onClick={handleView}>View</DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          {showMarkAsPaid && (
            <DropdownMenuItem
              onClick={handleMarkAsPaid}
              disabled={markChallanAsPaidMutation.isPending}
            >
              Mark as complete
            </DropdownMenuItem>
          )}
          {showAddToDraft && (
            <DropdownMenuItem
              onClick={handleAddToDraft}
              disabled={addChallanToDraftMutation.isPending}
            >
              Add to draft
            </DropdownMenuItem>
          )}
          {showMarkAsPending && (
            <DropdownMenuItem
              onClick={handleMarkAsPending}
              disabled={addChallanToPendingMutation.isPending}
            >
              Mark as pending
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={deleteChallanMutation.isPending}
          >
            Delete
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDownload}>Download</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ProgressPopup progress={progress} />
    </>
  );
}
