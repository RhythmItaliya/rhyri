import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../contexts/AuthContext";
import { usePurchaseBill } from "../../../hooks/usePurchaseBill";
import { useDownloadPurchaseBill } from "../../../lib/invoiceUtils";

interface PurchaseBillActionsHandlersProps {
  purchaseBillId: string;
  isMarkedAsPaid: boolean;
  isDrafted: boolean;
  isPending: boolean;
}

export function usePurchaseBillActionsHandlers({
  purchaseBillId,
  isMarkedAsPaid,
  isDrafted,
  isPending,
}: PurchaseBillActionsHandlersProps) {
  const navigate = useNavigate();
  const {
    markPurchaseBillAsPaidMutation,
    addPurchaseBillToDraftMutation,
    addPurchaseBillToPendingMutation,
    deletePurchaseBillMutation,
  } = usePurchaseBill();
  const { currentUser } = useAuth();
  const { downloadPurchaseBill, progress } = useDownloadPurchaseBill();
  const [uid, setUid] = useState<string | null>(null);
  const [showMarkAsPaid, setShowMarkAsPaid] = useState(false);
  const [showAddToDraft, setShowAddToDraft] = useState(false);
  const [showMarkAsPending, setShowMarkAsPending] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setUid(currentUser.uid);
    }
  }, [currentUser]);

  useEffect(() => {
    setShowMarkAsPaid(!isMarkedAsPaid);
    setShowAddToDraft(!isDrafted);
    setShowMarkAsPending(!isPending);
  }, [isMarkedAsPaid, isDrafted, isPending]);

  const handleView = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/purchase-bill/${purchaseBillId}`);
  };

  const handleDownload = (event: React.MouseEvent) => {
    event.stopPropagation();
    downloadPurchaseBill(purchaseBillId, uid);
  };

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/purchase-bill/edit/${purchaseBillId}`);
  };

  const handleDelete = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!uid) return;

    try {
      await deletePurchaseBillMutation.mutateAsync(purchaseBillId);
      navigate("/purchase-bills");
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAsPaid = (event: React.MouseEvent) => {
    event.stopPropagation();
    markPurchaseBillAsPaidMutation.mutate(purchaseBillId);
  };

  const handleMarkAsPending = (event: React.MouseEvent) => {
    event.stopPropagation();
    addPurchaseBillToPendingMutation.mutate(purchaseBillId);
  };

  const handleAddToDraft = (event: React.MouseEvent) => {
    event.stopPropagation();
    addPurchaseBillToDraftMutation.mutate(purchaseBillId);
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
    markPurchaseBillAsPaidMutation,
    addPurchaseBillToDraftMutation,
    addPurchaseBillToPendingMutation,
    deletePurchaseBillMutation,
  };
}
