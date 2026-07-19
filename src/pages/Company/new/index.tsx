import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import { CompanyInputs } from "../companyValidator";
import { CompanyForm } from "../CompanyForm";

import { appToast, catchError } from "../../../lib/utils";
import { invalidateRootQueries } from "../../../lib/queryInvalidation";
import { generateCompanyId } from "./generateCompanyId";

export function CreateCompanyPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (!currentUser) {
    console.error("No authenticated user found");
    return null;
  }

  const { mutate: createCompany, isPending } = useMutation({
    mutationFn: async (values: CompanyInputs) => {
      const companyId = generateCompanyId();

      await setDoc(doc(db, "companies", companyId), {
        ...values,
        uid: currentUser.uid,
      });
    },
    onSuccess() {
      appToast.success("Company created successfully");
      invalidateRootQueries(queryClient, ["companies"]);
      navigate("/companies");
    },
    onError(error) {
      appToast.error("Unable to create company");
      catchError(error);
    },
  });

  return <CompanyForm onSubmit={createCompany} isPending={isPending} />;
}
