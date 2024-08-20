import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FirebaseError } from "firebase/app";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { catchError } from "../lib/utils";

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
      return await queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "company" || query.queryKey[0] === "companies",
      });
    },
    onError(error) {
      catchError(error);
    },
  });

  return {
    deleteCompanyMutation,
  };
};
