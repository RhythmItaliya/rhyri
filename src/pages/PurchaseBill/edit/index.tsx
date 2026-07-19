import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { Skeleton } from "../../../components/Skeleton";
import { useAuth } from "../../../contexts/AuthContext";
import { db } from "../../../lib/firebase";
import { appToast, catchError } from "../../../lib/utils";
import { fetchPurchaseBill } from "../fetchPurchaseBill";
import { PurchaseBillForm } from "../PurchaseBillForm";
import { calculatePurchaseBillTotals } from "../purchaseBillUtils";
import { PurchaseBillInputs } from "../purchaseBillValidator";
import { updatePurchaseBill } from "./updatePurchaseBill";

export function EditPurchaseBillPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  if (!currentUser || !id) return null;

  const {
    data: purchaseBill,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["purchaseBill", currentUser.uid, id],
    queryFn: () => fetchPurchaseBill(id, currentUser.uid),
  });

  const { mutate: editPurchaseBill, isPending } = useMutation({
    mutationFn: async (values: PurchaseBillInputs) => {
      const purchaseBillsRef = collection(db, "purchaseBills");
      const duplicateQuery = query(
        purchaseBillsRef,
        where("uid", "==", currentUser.uid),
        where("purchaseBillNumber", "==", values.purchaseBillNumber),
      );
      const querySnapshot = await getDocs(duplicateQuery);
      const isDuplicate = querySnapshot.docs.some((doc) => doc.id !== id);

      if (isDuplicate) {
        throw new Error(
          `Purchase bill number "${values.purchaseBillNumber}" already exists in another purchase bill.`,
        );
      }

      const totals = calculatePurchaseBillTotals(values.itemList);
      await updatePurchaseBill({ ...values, amount: totals.roundedAmount }, id);
    },
    onSuccess() {
      appToast.success("Purchase bill updated successfully");
      queryClient.invalidateQueries({ queryKey: ["purchaseBill"] });
      queryClient.invalidateQueries({ queryKey: ["purchaseBills"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      navigate(`/purchase-bill/${id}`);
    },
    onError(error: any) {
      appToast.error(error.message);
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
      ) : purchaseBill ? (
        <PurchaseBillForm
          onSubmit={editPurchaseBill}
          isPending={isPending}
          purchaseBill={purchaseBill}
        />
      ) : (
        <Navigate to="/purchase-bills" />
      )}
    </>
  );
}
