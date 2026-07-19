import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FirebaseError } from "firebase/app";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { appToast, catchError } from "../lib/utils";
import { invalidateRootQueries } from "../lib/queryInvalidation";

export const useBankClient = () => {
  const queryClient = useQueryClient();

  const deleteBankMutation = useMutation({
    mutationFn: async (bankId: string) => {
      try {
        const accountRef = doc(db, "banks", bankId);
        await deleteDoc(accountRef);
      } catch (error) {
        if (error instanceof FirebaseError) {
          console.error(error.message);
        } else {
          console.error(error);
        }
        throw new Error("Unable to delete account");
      }
    },
    onSettled: async () => {
      return await invalidateRootQueries(queryClient, ["bank", "banks"]);
    },
    onSuccess() {
      appToast.success("Bank deleted");
    },
    onError(error) {
      appToast.error("Unable to delete bank");
      catchError(error);
    },
  });

  return {
    deleteBankMutation,
  };
};
