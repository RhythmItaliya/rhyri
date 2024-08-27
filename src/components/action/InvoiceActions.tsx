// InvoiceActions.tsx
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
import ProgressPopup from "../../components/popup/ProgressPopup";
import { useInvoiceActionsHandlers } from "./subActions/InvoiceActionsHandlers";

interface InvoiceActionsProps {
  isInvoicePage: boolean;
  invoiceId: string;
  isMarkedAsPaid: boolean;
  isDrafted: boolean;
  isPending: boolean;
}

export function InvoiceActions({
  isInvoicePage,
  invoiceId,
  isMarkedAsPaid,
  isDrafted,
  isPending,
}: InvoiceActionsProps) {
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
    markInvoiceAsPaidMutation,
    addInvoiceToDraftMutation,
    addInvoiceToPendingMutation,
    deleteInvoiceMutation,
  } = useInvoiceActionsHandlers({
    invoiceId,
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
          <DropdownMenuLabel className="font-semibold">Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {!isInvoicePage && (
            <DropdownMenuItem onClick={handleView}>
              View
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          {showMarkAsPaid && (
            <DropdownMenuItem
              onClick={handleMarkAsPaid}
              disabled={markInvoiceAsPaidMutation.isPending}
            >
              Mark as paid
            </DropdownMenuItem>
          )}
          {showAddToDraft && (
            <DropdownMenuItem
              onClick={handleAddToDraft}
              disabled={addInvoiceToDraftMutation.isPending}
            >
              Add to draft
            </DropdownMenuItem>
          )}
          {showMarkAsPending && (
            <DropdownMenuItem
              onClick={handleMarkAsPending}
              disabled={addInvoiceToPendingMutation.isPending}
            >
              Mark as pending
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={deleteInvoiceMutation.isPending}
          >
            Delete
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDownload}>Download</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ProgressPopup progress={progress} onClose={() => { }} />
    </>
  );
}
