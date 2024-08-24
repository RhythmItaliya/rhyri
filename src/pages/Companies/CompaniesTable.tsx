import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/Table";
import { Skeleton } from "../../components/Skeleton";
import { useNavigate } from "react-router-dom";

import { Company } from "../../types";
import { ColumnDef } from "./schema";
import { CompanyActions } from "../../components/action/CompanyActions";

interface CompaniesTableProps {
    companies?: Company[];
    isPending: boolean;
    columns: ColumnDef[];
}

export function CompaniesTable({
    isPending,
    companies,
    columns,
}: CompaniesTableProps) {
    const navigate = useNavigate();
    const visibleColumns = columns.filter((column) => column.isVisible);

    return (
        <div className="rounded-sm border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {visibleColumns.map((column) => (
                            <TableHead key={column.id}>{column.header}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isPending ? (
                        <TableRow>
                            <TableCell colSpan={visibleColumns.length}>
                                <Skeleton className="w-full h-10" />
                            </TableCell>
                        </TableRow>
                    ) : companies?.length ? (
                        companies.map((company) => (
                            <TableRow
                                key={company.id}
                                className="cursor-pointer"
                                onClick={() => navigate(`/company/${company.id}`)}
                            >
                                {visibleColumns.map((column) => (
                                    <TableCell key={column.id}>
                                        {column.id === "name" && (company.companyName?.toUpperCase() || "")}
                                        {column.id === "email" && (company.companyEmail?.toLowerCase() || "")}
                                        {column.id === "telephone" && company.companyTelephone}
                                    </TableCell>
                                ))}
                                <TableCell>
                                    <CompanyActions
                                        companyId={company.id}
                                        isCompanyPage={false}
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={visibleColumns.length}
                                className="text-center h-24"
                            >
                                No Companies
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
