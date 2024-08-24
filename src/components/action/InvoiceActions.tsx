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
import { useInvoice } from "../../hooks/useInvoice";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import ProgressPopup from "../../components/popup/ProgressPopup";
import { useDownloadInvoice } from "../../lib/invoiceUtils";

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
  const navigate = useNavigate();

  const {
    markInvoiceAsPaidMutation,
    addInvoiceToDraftMutation,
    addInvoiceToPendingMutation,
    deleteInvoiceMutation,
  } = useInvoice();

  const [uid, setUid] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const { downloadInvoice, progress } = useDownloadInvoice();
  const [showMarkAsPaid, setShowMarkAsPaid] = useState<boolean>(false);
  const [showAddToDraft, setShowAddToDraft] = useState<boolean>(false);
  const [showMarkAsPending, setShowMarkAsPending] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      setUid(currentUser.uid);
    }
  }, [currentUser]);

  useEffect(() => {
    let markAsPaidVisible = false;
    let addToDraftVisible = false;
    let markAsPendingVisible = false;
    if (isMarkedAsPaid) {
      markAsPaidVisible = false;
      addToDraftVisible = true;
      markAsPendingVisible = true;
    } else if (isDrafted) {
      markAsPaidVisible = true;
      addToDraftVisible = false;
      markAsPendingVisible = true;
    } else if (isPending) {
      markAsPaidVisible = true;
      addToDraftVisible = true;
      markAsPendingVisible = false;
    } else {
      markAsPaidVisible = true;
      addToDraftVisible = true;
      markAsPendingVisible = true;
    }
    setShowMarkAsPaid(markAsPaidVisible);
    setShowAddToDraft(addToDraftVisible);
    setShowMarkAsPending(markAsPendingVisible);
  }, [isMarkedAsPaid, isDrafted, isPending]);

  const handleView = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/invoice/${invoiceId}`);
  };

  const handleDownload = (event: React.MouseEvent) => {
    event.stopPropagation();
    downloadInvoice(invoiceId, uid);
  };

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/invoice/edit/${invoiceId}`);
  };

  const handleDelete = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!uid) {
      console.error("UID is not available");
      return;
    }
    try {
      await deleteInvoiceMutation.mutateAsync(invoiceId);
      navigate("/invoices");
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAsPaid = (event: React.MouseEvent) => {
    event.stopPropagation();
    markInvoiceAsPaidMutation.mutate(invoiceId);
  };

  const handleMarkAsPending = (event: React.MouseEvent) => {
    event.stopPropagation();
    addInvoiceToPendingMutation.mutate(invoiceId);
  };

  const handleAddToDraft = (event: React.MouseEvent) => {
    event.stopPropagation();
    addInvoiceToDraftMutation.mutate(invoiceId);
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
