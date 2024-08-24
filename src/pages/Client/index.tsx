import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/Table";
import { Card, CardContent } from "../../components/ui/Card";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "./fetchClient";
import { catchError } from "../../lib/utils";
import { ClientActions } from "../../components/action/ClientActions";
import { UserSkeleton } from "../UserSkeleton";

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
                <UserSkeleton />
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
                                    <p className="text-sm font-semibold">Name</p>
                                    <p className="font-sm uppercase">{client.clientName || ' - '}</p>

                                    <p className="text-sm font-semibold">Email</p>
                                    <p className="text-sm lowercase">{client.clientEmail || ' - '}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm font-semibold">Telephone</p>
                                    <p className="text-sm uppercase">{client.clientTelephone || ' - '}</p>

                                    <p className="text-sm font-semibold">Address</p>
                                    <p className="text-sm uppercase">{client.clientAddress || ' - '}</p>

                                    <p className="text-sm font-semibold">Country</p>
                                    <p className="text-sm uppercase">{client.clientCountry || ' - '}</p>

                                    <p className="text-sm font-semibold">City</p>
                                    <p className="text-sm uppercase">{client.clientCity || ' - '}</p>

                                    <p className="text-sm font-semibold">Post Code</p>
                                    <p className="text-sm uppercase">{client.clientPostCode || ' - '}</p>
                                </div>
                            </div>

                            <div className="grid gap-4 grid-cols-3">
                                <div className="space-y-1">
                                    <p className=" text-sm">State</p>
                                    <p className="uppercase">{client.clientState || ' - '}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className=" text-sm">Category</p>
                                    <p className="uppercase">{client.clientCategory || ' - '}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className=" text-sm">GST Number</p>
                                    <p className="uppercase">{client.clientGSTNumber || ' - '}</p>
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
                                            <TableCell className="uppercase">{client.clientName || ' - '}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Email</TableCell>
                                            <TableCell className="lowercase">{client.clientEmail || ' - '}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Telephone</TableCell>
                                            <TableCell className="uppercase">{client.clientTelephone || ' - '}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Address</TableCell>
                                            <TableCell className="uppercase">{client.clientAddress || ' - '}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Country</TableCell>
                                            <TableCell className="uppercase">{client.clientCountry || ' - '}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>City</TableCell>
                                            <TableCell className="uppercase">{client.clientCity || ' - '}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Post Code</TableCell>
                                            <TableCell className="uppercase">{client.clientPostCode || ' - '}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>State</TableCell>
                                            <TableCell className="uppercase">{client.clientState || ' - '}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Category</TableCell>
                                            <TableCell className="uppercase">{client.clientCategory || ' - '}</TableCell>
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
