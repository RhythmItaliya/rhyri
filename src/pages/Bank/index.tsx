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
import { fetchBank } from "./fetchBank";
import { catchError } from "../../lib/utils";
import { BankActions } from "../../components/action/BankActions";

export function BankPage() {
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

    if (error) {
        catchError(error);
    }

    return (
        <>
            {isLoading ? (
                <Skeleton className="w-full h-10 rounded-md max-w-5xl mx-auto" />
            ) : bank ? (
                <div className="space-y-4 w-full max-w-5xl mx-auto">
                    <Card>
                        <CardContent className="flex-between pt-4">
                            <div className="text-lg font-semibold">{bank.bankName}</div>
                            <div className="flex items-center space-x-4">
                                <BankActions
                                    bankId={bank.id}
                                    isBankPage={true}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="space-y-8 p-8">
                            <div className="flex items-start flex-col sm:flex-row gap-4 justify-between">
                                <div className="space-y-1">
                                    <p className="font-medium">{bank.bankName}</p>
                                    <p className="text-sm text-muted">{bank.bankAccountNumber}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-muted">{bank.bankBranchName}</p>
                                    <p className="text-sm text-muted">{bank.bankIfscCode}</p>
                                    <p className="text-sm text-muted">{bank.bankAddress}</p>
                                    <p className="text-sm text-muted">{bank.bankCountry}</p>
                                    <p className="text-sm text-muted">{bank.bankCity}</p>
                                    <p className="text-sm text-muted">{bank.bankPostCode}</p>
                                </div>
                            </div>

                            <div className="grid gap-4 grid-cols-2">
                                <div className="space-y-1">
                                    <p className="text-muted text-sm">State</p>
                                    <p>{bank.bankState}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-muted text-sm">Account Type</p>
                                    <p>{bank.bankCategory}</p>
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
                                            <TableCell>Bank Name</TableCell>
                                            <TableCell>{bank.bankName}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Account Number</TableCell>
                                            <TableCell>{bank.bankAccountNumber}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Branch Name</TableCell>
                                            <TableCell>{bank.bankBranchName}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>IFSC Code</TableCell>
                                            <TableCell>{bank.bankIfscCode}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Address</TableCell>
                                            <TableCell>{bank.bankAddress}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Country</TableCell>
                                            <TableCell>{bank.bankCountry}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>City</TableCell>
                                            <TableCell>{bank.bankCity}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Post Code</TableCell>
                                            <TableCell>{bank.bankPostCode}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>State</TableCell>
                                            <TableCell>{bank.bankState}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Account Type</TableCell>
                                            <TableCell>{bank.bankCategory}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <Navigate to="/banks" />
            )}
        </>
    );
}
