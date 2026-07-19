import { BankForm } from "../BankForm";
import { Skeleton } from "../../../components/Skeleton";

import { Navigate, useNavigate, useParams } from "react-router-dom";

import { fetchBank } from "../fetchBank";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "../../../contexts/AuthContext";
import { appToast, catchError } from "../../../lib/utils";
import { invalidateRootQueries } from "../../../lib/queryInvalidation";
import { BankInputs } from "../bankValidator";
import { updateBank } from "./updateBank";

export function EditBankPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  if (!currentUser || !id) return null;

  const {
    data: bank,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["bank", currentUser.uid, id],
    queryFn: () => fetchBank(id, currentUser.uid),
  });

  const { mutate: editBank, isPending } = useMutation({
    mutationFn: async (values: BankInputs) => {
      await updateBank(values, id);
    },
    onSuccess() {
      appToast.success("Bank updated successfully");
      invalidateRootQueries(queryClient, ["bank", "banks"]);
      navigate(`/bank/${id}`);
    },
    onError(error) {
      appToast.error("Unable to update bank");
      catchError(error);
    },
  });

  if (error) {
    catchError(error);
  }

  return (
    <>
      {isLoading ? (
        <Skeleton className="w-full h-10 rounded-md max-w-5xl mx-auto" />
      ) : bank ? (
        <BankForm onSubmit={editBank} isPending={isPending} bank={bank} />
      ) : (
        <Navigate to="/banks" />
      )}
    </>
  );
}
