import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../contexts/AuthContext";
import { useChallan } from "../../../hooks/useChallan";
import { useDownloadChallan } from "../../../lib/invoiceUtils";

interface ChallanActionsHandlersProps {
  challanId: string;
  isMarkedAsPaid: boolean;
  isDrafted: boolean;
  isPending: boolean;
}

export function useChallanActionsHandlers({
  challanId,
  isMarkedAsPaid,
  isDrafted,
  isPending,
}: ChallanActionsHandlersProps) {
  const navigate = useNavigate();
  const {
    markChallanAsPaidMutation,
    addChallanToDraftMutation,
    addChallanToPendingMutation,
    deleteChallanMutation,
  } = useChallan();
  const { currentUser } = useAuth();
  const { downloadChallan, progress } = useDownloadChallan();
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
    navigate(`/challan/${challanId}`);
  };

  const handleDownload = (event: React.MouseEvent) => {
    event.stopPropagation();
    downloadChallan(challanId, uid);
  };

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/challan/edit/${challanId}`);
  };

  const handleDelete = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!uid) return;

    try {
      await deleteChallanMutation.mutateAsync(challanId);
      navigate("/challans");
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAsPaid = (event: React.MouseEvent) => {
    event.stopPropagation();
    markChallanAsPaidMutation.mutate(challanId);
  };

  const handleMarkAsPending = (event: React.MouseEvent) => {
    event.stopPropagation();
    addChallanToPendingMutation.mutate(challanId);
  };

  const handleAddToDraft = (event: React.MouseEvent) => {
    event.stopPropagation();
    addChallanToDraftMutation.mutate(challanId);
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
    markChallanAsPaidMutation,
    addChallanToDraftMutation,
    addChallanToPendingMutation,
    deleteChallanMutation,
  };
}
