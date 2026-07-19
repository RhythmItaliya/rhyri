import { Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { PurchaseBillActions } from "../../components/action/PurchaseBillActions";
import { Icons } from "../../components/Icons";
import { InvoiceStatusBadge } from "../../components/InvoiceStatusBadge";
import { Skeleton } from "../../components/Skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import { useTheme } from "../../contexts/ThemeContext";
import { cn, formatCurrency, formatFirestoreTimestamp } from "../../lib/utils";
import { PurchaseBillStatus } from "../../types/purchaseBillTypes";
import { ColumnDef } from "./schema";

interface PurchaseBillsTableProps {
  purchaseBills?: {
    id: string;
    date: Timestamp;
    supplier: string;
    status: PurchaseBillStatus;
    amount: number;
    purchaseBillNumber: string;
  }[];
  isPending: boolean;
  columns: ColumnDef[];
  onDownload: (
    purchaseBillId: string,
    event: React.MouseEvent<HTMLDivElement>,
  ) => void;
  downloadingId?: string | null;
}

export function PurchaseBillsTable({
  isPending,
  purchaseBills,
  columns,
  onDownload,
  downloadingId,
}: PurchaseBillsTableProps) {
  const navigate = useNavigate();
  const visibleColumns = columns.filter((column) => column.isVisible);
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";

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
          ) : purchaseBills?.length ? (
            purchaseBills.map((purchaseBill, index) => (
              <TableRow
                key={purchaseBill.id}
                className="cursor-pointer"
                onClick={() => navigate(`/purchase-bill/${purchaseBill.id}`)}
              >
                {visibleColumns.map((column) => (
                  <TableCell key={column.id} className="uppercase">
                    {column.id === "srNo" && index + 1}
                    {column.id === "purchaseBill" && (purchaseBill.id || " - ")}
                    {column.id === "purchaseBillNumber" &&
                      (purchaseBill.purchaseBillNumber || " - ")}
                    {column.id === "date" &&
                      (purchaseBill.date
                        ? formatFirestoreTimestamp(purchaseBill.date)
                        : " - ")}
                    {column.id === "supplier" &&
                      (purchaseBill.supplier
                        ? purchaseBill.supplier.toUpperCase()
                        : " - ")}
                    {column.id === "status" && (
                      <InvoiceStatusBadge status={purchaseBill.status} />
                    )}
                    {column.id === "amount" &&
                      formatCurrency(purchaseBill.amount || 0)}
                  </TableCell>
                ))}

                <TableCell>
                  <div
                    className={cn(
                      "inline-flex items-center justify-center rounded-md font-medium transition-colors h-10 w-10",
                      purchaseBill.id === downloadingId
                        ? "cursor-not-allowed opacity-70"
                        : "hover:bg-border/80 cursor-pointer",
                    )}
                    onClick={(event) => {
                      if (purchaseBill.id === downloadingId) return;
                      onDownload(
                        purchaseBill.id,
                        event as React.MouseEvent<HTMLDivElement>,
                      );
                    }}
                  >
                    {purchaseBill.id === downloadingId ? (
                      <Icons.spinner className="h-5 w-5 animate-spin" />
                    ) : (
                      (isDarkTheme ? Icons.downloadDark : Icons.downloadLight)(
                        {},
                      )
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <PurchaseBillActions
                    isPurchaseBillPage={false}
                    purchaseBillId={purchaseBill.id}
                    isMarkedAsPaid={purchaseBill.status === "paid"}
                    isDrafted={purchaseBill.status === "drafted"}
                    isPending={purchaseBill.status === "pending"}
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
                No Purchase Bills
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
