import { useMutation } from "@tanstack/react-query";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import { BankInputs } from "../bankValidator";
import { BankForm } from "../BankForm";

import { catchError } from "../../../lib/utils";
import { generateBankId } from "./generateBankId";

export function CreateBankPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    console.error("No authenticated user found");
    return null;
  }

  const { mutate: createBank, isPending } = useMutation({
    mutationFn: async (values: BankInputs) => {
      const bankId = generateBankId();

      await setDoc(doc(db, "banks", bankId), {
        ...values,
        uid: currentUser.uid,
      });
    },
    onSuccess() {
      navigate("/banks");
    },
    onError(error) {
      catchError(error);
    },
  });

  return <BankForm onSubmit={createBank} isPending={isPending} />;
}
