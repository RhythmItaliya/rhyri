import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { UserSkeleton } from "../../../components/UserSkeleton";
import { useAuth } from "../../../contexts/AuthContext";
import { invalidateRootQueries } from "../../../lib/queryInvalidation";
import { appToast, catchError } from "../../../lib/utils";
import { ChallanForm } from "../ChallanForm";
import { ChallanInputs } from "../challanValidator";
import { getChallanTotals } from "../challanUtils";
import { fetchChallan } from "../fetchChallan";
import { updateChallan } from "./updateChallan";

export function EditChallanPage() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (!currentUser || !id) return null;

  const {
    data: challan,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["challan", currentUser.uid, id],
    queryFn: () => fetchChallan(id, currentUser.uid),
  });

  const { mutate: handleUpdateChallan, isPending } = useMutation({
    mutationFn: async (values: ChallanInputs) => {
      const totals = getChallanTotals(values.itemList);

      await updateChallan(
        {
          ...values,
          totalPieces: totals.totalPieces,
          amount: totals.amount,
        },
        id,
      );
    },
    onSuccess() {
      appToast.success("Challan updated successfully");
      invalidateRootQueries(queryClient, ["challan", "challans", "dashboard"]);
      navigate("/challans");
    },
    onError(error: any) {
      appToast.error(error.message);
      catchError(error);
    },
  });

  if (error) {
    catchError(error);
  }

  if (isLoading) {
    return <UserSkeleton />;
  }

  if (!challan) {
    return <Navigate to="/challans" />;
  }

  return (
    <ChallanForm
      challan={challan}
      onSubmit={handleUpdateChallan}
      isPending={isPending}
    />
  );
}
