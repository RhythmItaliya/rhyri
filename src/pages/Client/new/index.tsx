import { useMutation } from "@tanstack/react-query";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import { ClientInputs } from "../clientValidator";
import { ClientForm } from "../ClientForm";

import { catchError } from "../../../lib/utils";
import { generateClientId } from "./generateClientId";

export function CreateClientPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    console.error('No authenticated user found');
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
      navigate("/clients");
    },
    onError(error) {
      catchError(error);
    },
  });

  return <ClientForm onSubmit={createClient} isPending={isPending} />;
}
