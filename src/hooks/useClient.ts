import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FirebaseError } from "firebase/app";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { appToast, catchError } from "../lib/utils";
import { invalidateRootQueries } from "../lib/queryInvalidation";

export const useClient = () => {
  const queryClient = useQueryClient();

  const deleteClientMutation = useMutation({
    mutationFn: async (clientId: string) => {
      try {
        const clientRef = doc(db, "clients", clientId);
        await deleteDoc(clientRef);
      } catch (error) {
        error instanceof FirebaseError
          ? console.error(error.message)
          : console.error(error);
        throw new Error("Unable to delete client");
      }
    },
    onSettled: async () => {
      return await invalidateRootQueries(queryClient, ["client", "clients"]);
    },
    onSuccess() {
      appToast.success("Client deleted");
    },
    onError(error) {
      appToast.error("Unable to delete client");
      catchError(error);
    },
  });

  return {
    deleteClientMutation,
  };
};
