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
import { usePurchaseBillActionsHandlers } from "./subActions/PurchaseBillActionsHandlers";

interface PurchaseBillActionsProps {
  isPurchaseBillPage: boolean;
  purchaseBillId: string;
  isMarkedAsPaid: boolean;
  isDrafted: boolean;
  isPending: boolean;
}

export function PurchaseBillActions({
  isPurchaseBillPage,
  purchaseBillId,
  isMarkedAsPaid,
  isDrafted,
  isPending,
}: PurchaseBillActionsProps) {
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
    markPurchaseBillAsPaidMutation,
    addPurchaseBillToDraftMutation,
    addPurchaseBillToPendingMutation,
    deletePurchaseBillMutation,
  } = usePurchaseBillActionsHandlers({
    purchaseBillId,
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
          {!isPurchaseBillPage && (
            <DropdownMenuItem onClick={handleView}>View</DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          {showMarkAsPaid && (
            <DropdownMenuItem
              onClick={handleMarkAsPaid}
              disabled={markPurchaseBillAsPaidMutation.isPending}
            >
              Mark as paid
            </DropdownMenuItem>
          )}
          {showAddToDraft && (
            <DropdownMenuItem
              onClick={handleAddToDraft}
              disabled={addPurchaseBillToDraftMutation.isPending}
            >
              Add to draft
            </DropdownMenuItem>
          )}
          {showMarkAsPending && (
            <DropdownMenuItem
              onClick={handleMarkAsPending}
              disabled={addPurchaseBillToPendingMutation.isPending}
            >
              Mark as pending
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={deletePurchaseBillMutation.isPending}
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
