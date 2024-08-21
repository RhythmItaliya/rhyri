import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FirebaseError } from "firebase/app";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { catchError } from "../lib/utils";

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
      return await queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "bank" || query.queryKey[0] === "banks",
      });
    },
    onError(error) {
      catchError(error);
    },
  });

  return {
    deleteBankMutation,
  };
};
