import { BankForm } from "../BankForm";
import { Skeleton } from "../../../components/Skeleton";

import { Navigate, useNavigate, useParams } from "react-router-dom";

import { fetchBank } from "../fetchBank";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useAuth } from "../../../contexts/AuthContext";
import { catchError } from "../../../lib/utils";
import { BankInputs } from "../bankValidator";
import { updateBank } from "./updateBank";

export function EditBankPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { currentUser } = useAuth();

    if (!currentUser || !id) return null;

    const {
        data: bank,
        error,  
        isLoading,
    } = useQuery({
        queryKey: ["bank", currentUser.uid, id],
        queryFn: () => fetchBank(id, currentUser.uid),
    });

    const { mutate: editBank, isPending } = useMutation({
        mutationFn: async (values: BankInputs) => {
            await updateBank(values, id);
        },
        onSuccess() {
            navigate(`/bank/${id}`);
        },
        onError(error) {
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
            ) : bank ? (
                <BankForm
                    onSubmit={editBank}
                    isPending={isPending}
                    bank={bank}
                />
            ) : (
                <Navigate to="/banks" />
            )}
        </>
    );
}
