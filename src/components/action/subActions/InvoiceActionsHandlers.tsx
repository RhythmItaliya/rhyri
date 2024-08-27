// InvoiceActionsHandlers.tsx
import { useNavigate } from "react-router-dom";
import { useInvoice } from "../../../hooks/useInvoice";
import { useAuth } from "../../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { useDownloadInvoice } from "../../../lib/invoiceUtils";

interface InvoiceActionsHandlersProps {
  invoiceId: string;
  isMarkedAsPaid: boolean;
  isDrafted: boolean;
  isPending: boolean;
}

export function useInvoiceActionsHandlers({
  invoiceId,
  isMarkedAsPaid,
  isDrafted,
  isPending,
}: InvoiceActionsHandlersProps) {
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

  return {
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
  };
}
