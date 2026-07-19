import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import { ClientInputs } from "../clientValidator";
import { ClientForm } from "../ClientForm";

import { appToast, catchError } from "../../../lib/utils";
import { invalidateRootQueries } from "../../../lib/queryInvalidation";
import { generateClientId } from "./generateClientId";

export function CreateClientPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (!currentUser) {
    console.error("No authenticated user found");
    return null;
  }

  const { mutate: createClient, isPending } = useMutation({
    mutationFn: async (values: ClientInputs) => {
      const clientId = generateClientId();

      await setDoc(doc(db, "clients", clientId), {
        ...values,
        uid: currentUser.uid,
      });
    },
    onSuccess() {
      appToast.success("Client created successfully");
      invalidateRootQueries(queryClient, ["clients"]);
      navigate("/clients");
    },
    onError(error) {
      appToast.error("Unable to create client");
      catchError(error);
    },
  });

  return <ClientForm onSubmit={createClient} isPending={isPending} />;
}
