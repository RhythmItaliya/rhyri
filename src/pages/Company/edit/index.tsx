import { CompanyForm } from "../CompanyForm";
import { Skeleton } from "../../../components/Skeleton";

import { Navigate, useNavigate, useParams } from "react-router-dom";

import { fetchCompany } from "../fetchCompany";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "../../../contexts/AuthContext";
import { appToast, catchError } from "../../../lib/utils";
import { invalidateRootQueries } from "../../../lib/queryInvalidation";
import { CompanyInputs } from "../companyValidator";
import { updateCompany } from "./updateCompany";

export function EditCompanyPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  if (!currentUser || !id) return null;

  const {
    data: company,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["company", currentUser.uid, id],
    queryFn: () => fetchCompany(id, currentUser.uid),
  });

  const { mutate: editCompany, isPending } = useMutation({
    mutationFn: async (values: CompanyInputs) => {
      await updateCompany(values, id);
    },
    onSuccess() {
      appToast.success("Company updated successfully");
      invalidateRootQueries(queryClient, ["company", "companies"]);
      navigate(`/company/${id}`);
    },
    onError(error) {
      appToast.error("Unable to update company");
      catchError(error);
    },
  });

  if (error) {
    catchError(error);
  }

  return (
    <>
      {isLoading ? (
        <Skeleton className="w-full h-10 rounded-md max-w-5xl mx-auto" />
      ) : company ? (
        <CompanyForm
          onSubmit={editCompany}
          isPending={isPending}
          company={company}
        />
      ) : (
        <Navigate to="/companies" />
      )}
    </>
  );
}
