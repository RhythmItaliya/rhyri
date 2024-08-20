import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FirebaseError } from "firebase/app";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { catchError } from "../lib/utils";

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
      return await queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "client" || query.queryKey[0] === "clients",
      })
    },
    onError(error) {
      catchError(error)
    },
  });

  return {
    deleteClientMutation
  }
}