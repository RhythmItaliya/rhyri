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

interface InvoiceActionsProps {
  isInvoicePage: boolean;
  invoiceId: string;
  isMarkedAsPaid: boolean;
  isDrafted: boolean;
}

export function InvoiceActions({
  isInvoicePage,
  invoiceId,
  isMarkedAsPaid,
  isDrafted,
}: InvoiceActionsProps) {
  const navigate = useNavigate();

  const {
    markInvoiceAsPaidMutation,
    addInvoiceToDraftMutation,
    deleteInvoiceMutation,
    downloadInvoiceMutation,
  } = useInvoice();

  const [uid, setUid] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const [progress, setProgress] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setUid(currentUser.uid);
    }
  }, [currentUser]);

  const handleView = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/invoice/${invoiceId}`);
  };

  const handleDownload = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (uid === null) {
      console.error("UID is not available");
      return;
    }
    setProgress("Fetching data...");
    try {
      await downloadInvoiceMutation.mutateAsync({
        invoiceId,
        uid,
        onProgress: (progress) => setProgress(progress),
      });
      setTimeout(() => setProgress(null), 1000);
    } catch (error) {
      setProgress("Error occurred");
      setTimeout(() => setProgress(null), 3000);
    }
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
          {!isMarkedAsPaid && (
            <DropdownMenuItem
              onClick={handleMarkAsPaid}
              disabled={markInvoiceAsPaidMutation.isPending}
            >
              Mark as paid
            </DropdownMenuItem>
          )}
          {!isDrafted && (
            <DropdownMenuItem
              onClick={handleAddToDraft}
              disabled={addInvoiceToDraftMutation.isPending}
            >
              Add to draft
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
      <ProgressPopup progress={progress} onClose={() => setProgress(null)} />
    </>
  );
}
