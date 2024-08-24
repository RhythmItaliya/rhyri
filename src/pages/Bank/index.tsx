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
import { fetchBank } from "./fetchBank";
import { catchError } from "../../lib/utils";
import { BankActions } from "../../components/action/BankActions";
import { UserSkeleton } from "../UserSkeleton";

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
                <UserSkeleton />
            ) : bank ? (
                <div className="space-y-4 w-full max-w-5xl mx-auto">
                    <Card>
                        <CardContent className="flex-between pt-4">
                            <div className="text-lg font-semibold uppercase">{bank.bankName}</div>
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
                                    <p className="font-semibold text-sm ">Bank Name</p>
                                    <p className="font-medium uppercase">{bank.bankName || ' - '}</p>

                                    <p className="font-semibold text-sm ">Account Number</p>
                                    <p className="text-sm uppercase ">{bank.bankAccountNumber || ' - '}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="font-semibold text-sm ">Branch Name</p>
                                    <p className="text-sm uppercase ">{bank.bankBranchName || ' - '}</p>

                                    <p className="font-semibold text-sm ">IFSC Code</p>
                                    <p className="text-sm uppercase ">{bank.bankIfscCode || ' - '}</p>

                                    <p className="font-semibold text-sm ">Address</p>
                                    <p className="text-sm uppercase">{bank.bankAddress || ' - '}</p>

                                    <p className="font-semibold text-sm ">Country</p>
                                    <p className="text-sm uppercase">{bank.bankCountry || ' - '}</p>

                                    <p className="font-semibold text-sm ">City</p>
                                    <p className="text-sm uppercase ">{bank.bankCity || ' - '}</p>

                                    <p className="font-semibold text-sm ">Post Code</p>
                                    <p className="text-sm  uppercase">{bank.bankPostCode || ' - '}</p>
                                </div>
                            </div>

                            <div className="grid gap-4 grid-cols-2">
                                <div className="space-y-1">
                                    <p className=" text-sm">State</p>
                                    <p className="uppercase">{bank.bankState || ' - '}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className=" text-sm">Account Type</p>
                                    <p className="uppercase">{bank.bankCategory || ' - '}</p>
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
                                            <TableCell className="uppercase">{bank.bankName || ' - '}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Account Number</TableCell>
                                            <TableCell className="uppercase">{bank.bankAccountNumber || ' - '}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Branch Name</TableCell>
                                            <TableCell className="uppercase">{bank.bankBranchName || ' - '}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>IFSC Code</TableCell>
                                            <TableCell className="uppercase">{bank.bankIfscCode || ' - '}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Address</TableCell>
                                            <TableCell className="uppercase">{bank.bankAddress || ' - '}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Country</TableCell>
                                            <TableCell className="uppercase">{bank.bankCountry || ' - '}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>City</TableCell>
                                            <TableCell className="uppercase">{bank.bankCity || ' - '}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Post Code</TableCell>
                                            <TableCell className="uppercase">{bank.bankPostCode || ' - '}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>State</TableCell>
                                            <TableCell className="uppercase">{bank.bankState || ' - '}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Account Type</TableCell>
                                            <TableCell className="uppercase">{bank.bankCategory || ' - '}</TableCell>
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
