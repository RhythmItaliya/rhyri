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

import { Bank } from "../../types";
import { ColumnDef } from "./schema";
import { BankActions } from "../../components/action/BankActions";

interface BanksTableProps {
  banks?: Bank[];
  isPending: boolean;
  columns: ColumnDef[];
}

export function BanksTable({
  isPending,
  banks,
  columns,
}: BanksTableProps) {
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
          ) : banks?.length ? (
            banks.map((bank) => (
              <TableRow
                key={bank.id}
                className="cursor-pointer"
                onClick={() => navigate(`/bank/${bank.id}`)}
              >
                {visibleColumns.map((column) => (
                  <TableCell key={column.id}>
                    {column.id === "bankName" && (bank.bankName?.toUpperCase() || "")}
                    {column.id === "bankAccountNumber" && bank.bankAccountNumber}
                    {column.id === "bankIfscCode" && bank.bankIfscCode?.toUpperCase() || ""}
                  </TableCell>
                ))}
                <TableCell>
                  <BankActions
                    bankId={bank.id}
                    isBankPage={false}
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
                No Banks
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
