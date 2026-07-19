import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import { BankInputs } from "../bankValidator";
import { BankForm } from "../BankForm";

import { appToast, catchError } from "../../../lib/utils";
import { invalidateRootQueries } from "../../../lib/queryInvalidation";
import { generateBankId } from "./generateBankId";

export function CreateBankPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
      appToast.success("Bank created successfully");
      invalidateRootQueries(queryClient, ["banks"]);
      navigate("/banks");
    },
    onError(error) {
      appToast.error("Unable to create bank");
      catchError(error);
    },
  });

  return <BankForm onSubmit={createBank} isPending={isPending} />;
}
