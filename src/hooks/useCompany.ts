import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FirebaseError } from "firebase/app";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { appToast, catchError } from "../lib/utils";
import { invalidateRootQueries } from "../lib/queryInvalidation";

export const useCompany = () => {
  const queryClient = useQueryClient();

  const deleteCompanyMutation = useMutation({
    mutationFn: async (companyId: string) => {
      try {
        const companyRef = doc(db, "companies", companyId);
        await deleteDoc(companyRef);
      } catch (error) {
        error instanceof FirebaseError
          ? console.error(error.message)
          : console.error(error);
        throw new Error("Unable to delete company");
      }
    },
    onSettled: async () => {
      return await invalidateRootQueries(queryClient, ["company", "companies"]);
    },
    onSuccess() {
      appToast.success("Company deleted");
    },
    onError(error) {
      appToast.error("Unable to delete company");
      catchError(error);
    },
  });

  return {
    deleteCompanyMutation,
  };
};
