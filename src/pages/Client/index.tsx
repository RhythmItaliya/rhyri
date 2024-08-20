import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/Table";
import { Card, CardContent } from "../../components/ui/Card";
import { Skeleton } from "../../components/Skeleton";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "./fetchClient";
import { catchError } from "../../lib/utils";
import { ClientActions } from "../../components/action/ClientActions";

export function ClientPage() {
    const { id } = useParams();
    const { currentUser } = useAuth();

    if (!currentUser || !id) return null;

    const {
        data: client,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["client", currentUser.uid, id],
        queryFn: () => fetchClient(id, currentUser.uid),
    });

    if (error) {
        catchError(error);
    }

    return (
        <>
            {isLoading ? (
                <Skeleton className="w-full h-10 rounded-md max-w-5xl mx-auto" />
            ) : client ? (
                <div className="space-y-4 w-full max-w-5xl mx-auto">
                    <Card>
                        <CardContent className="flex-between pt-4">
                            <div className="text-lg font-semibold">{client.clientName}</div>
                            <div className="flex items-center space-x-4">
                                <ClientActions
                                    clientId={client.id}
                                    isClientPage={true}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="space-y-8 p-8">
                            <div className="flex items-start flex-col sm:flex-row gap-4 justify-between">
                                <div className="space-y-1">
                                    <p className="font-medium">{client.clientName}</p>
                                    <p className="text-sm text-muted">{client.clientEmail}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-muted">{client.clientTelephone}</p>
                                    <p className="text-sm text-muted">{client.clientAddress}</p>
                                    <p className="text-sm text-muted">{client.clientCountry}</p>
                                    <p className="text-sm text-muted">{client.clientCity}</p>
                                    <p className="text-sm text-muted">{client.clientPostCode}</p>
                                </div>
                            </div>

                            <div className="grid gap-4 grid-cols-2">
                                <div className="space-y-1">
                                    <p className="text-muted text-sm">State</p>
                                    <p>{client.clientState}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-muted text-sm">Category</p>
                                    <p>{client.clientCategory}</p>
                                </div>
                            </div>

                            <div className="border rounded-sm">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Details</TableHead>
                                            <TableHead>Value</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Client Name</TableCell>
                                            <TableCell>{client.clientName}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Email</TableCell>
                                            <TableCell>{client.clientEmail}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Telephone</TableCell>
                                            <TableCell>{client.clientTelephone}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Address</TableCell>
                                            <TableCell>{client.clientAddress}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Country</TableCell>
                                            <TableCell>{client.clientCountry}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>City</TableCell>
                                            <TableCell>{client.clientCity}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Post Code</TableCell>
                                            <TableCell>{client.clientPostCode}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>State</TableCell>
                                            <TableCell>{client.clientState}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Category</TableCell>
                                            <TableCell>{client.clientCategory}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <Navigate to="/clients" />
            )}
        </>
    );
}
