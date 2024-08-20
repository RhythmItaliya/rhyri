import { ClientForm } from "../ClientForm"
import { Skeleton } from "../../../components/Skeleton"

import { Navigate, useNavigate, useParams } from "react-router-dom"

import { fetchClient } from "../fetchClient"
import { useMutation, useQuery } from "@tanstack/react-query"

import { useAuth } from "../../../contexts/AuthContext"
import { catchError } from "../../../lib/utils"
import { ClientInputs } from "../clientValidator"
import { updateClient } from "./updateClient"

export function EditClientPage() {
    const navigate = useNavigate()
    const { id } = useParams()
    const { currentUser } = useAuth()

    if (!currentUser || !id) return null

    const {
        data: client,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["client", currentUser.uid, id],
        queryFn: () => fetchClient(id, currentUser.uid),
    })

    const { mutate: editClient, isPending } = useMutation({
        mutationFn: async (values: ClientInputs) => {
            await updateClient(values, id)
        },
        onSuccess() {
            navigate(`/client/${id}`)
        },
        onError(error) {
            catchError(error)
        },
    })

    if (error) {
        catchError(error)
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
    )
}
