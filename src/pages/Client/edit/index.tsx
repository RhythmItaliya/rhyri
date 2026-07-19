import { ClientForm } from "../ClientForm";
import { Skeleton } from "../../../components/Skeleton";

import { Navigate, useNavigate, useParams } from "react-router-dom";

import { fetchClient } from "../fetchClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "../../../contexts/AuthContext";
import { appToast, catchError } from "../../../lib/utils";
import { invalidateRootQueries } from "../../../lib/queryInvalidation";
import { ClientInputs } from "../clientValidator";
import { updateClient } from "./updateClient";

export function EditClientPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  if (!currentUser || !id) return null;

  const {
    data: client,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["client", currentUser.uid, id],
    queryFn: () => fetchClient(id, currentUser.uid),
  });

  const { mutate: editClient, isPending } = useMutation({
    mutationFn: async (values: ClientInputs) => {
      await updateClient(values, id);
    },
    onSuccess() {
      appToast.success("Client updated successfully");
      invalidateRootQueries(queryClient, ["client", "clients"]);
      navigate(`/client/${id}`);
    },
    onError(error) {
      appToast.error("Unable to update client");
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
      ) : client ? (
        <ClientForm
          onSubmit={editClient}
          isPending={isPending}
          client={client}
        />
      ) : (
        <Navigate to="/clients" />
      )}
    </>
  );
}
