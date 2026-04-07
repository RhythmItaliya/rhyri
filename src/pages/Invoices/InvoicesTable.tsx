import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import { Skeleton } from "../../components/Skeleton";

import { cn, formatCurrency, formatFirestoreTimestamp } from "../../lib/utils";

import { Timestamp } from "firebase/firestore";
import { InvoiceStatus } from "../../types";
import { ColumnDef } from "./schema";

import { useNavigate } from "react-router-dom";
import { InvoiceStatusBadge } from "../../components/InvoiceStatusBadge";
import { InvoiceActions } from "../../components/action/InvoiceActions";
import { Icons } from "../../components/Icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";

import { startOfDay } from "date-fns";

const isDateRestricted = (date: any, restrictionDate: Date | null) => {
  if (!restrictionDate) return false;
  const d = date instanceof Timestamp ? date.toDate() : new Date(date);
  return startOfDay(d) <= startOfDay(restrictionDate);
};

interface InvoicesTableProps {
  invoices?: {
    id: string;
    date: Timestamp;
    client: string;
    status: InvoiceStatus;
    amount: number;
    invoiceCustomNumber: string;
  }[];
  isPending: boolean;
  columns: ColumnDef[];
  onDownload: (
    invoiceId: string,
    event: React.MouseEvent<HTMLDivElement>,
  ) => void;
  downloadingId?: string | null;
}

export function InvoicesTable({
  isPending,
  invoices,
  columns,
  onDownload,
  downloadingId,
}: InvoicesTableProps) {
  const navigate = useNavigate();
  const visibleColumns = columns.filter((column) => column.isVisible);

  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";
  const { restrictionDate } = useAuth();

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
          ) : invoices?.length ? (
            invoices.map((invoice, index) => {
              const restricted = isDateRestricted(
                invoice.date,
                restrictionDate,
              );
              return (
                <TableRow
                  key={invoice.id}
                  className={cn(
                    "cursor-pointer",
                    restricted && "opacity-50 grayscale pointer-events-none",
                  )}
                  onClick={() =>
                    !restricted && navigate(`/invoice/${invoice.id}`)
                  }
                >
                  {visibleColumns.map((column) => (
                    <TableCell key={column.id} className="uppercase">
                      {column.id === "srNo" && index + 1}
                      {column.id === "invoice" && (invoice.id || " - ")}
                      {column.id === "invoiceCustomNumber" &&
                        (invoice.invoiceCustomNumber || " - ")}
                      {column.id === "date" &&
                        (invoice.date
                          ? formatFirestoreTimestamp(invoice.date)
                          : " - ")}
                      {column.id === "client" &&
                        (invoice.client ? invoice.client.toUpperCase() : " - ")}
                      {column.id === "status" && (
                        <InvoiceStatusBadge status={invoice.status} />
                      )}
                      {column.id === "amount" &&
                        (invoice.amount
                          ? formatCurrency(invoice.amount)
                          : " - ")}
                    </TableCell>
                  ))}

                  <TableCell>
                    <div
                      className={cn(
                        "inline-flex items-center justify-center rounded-md font-medium transition-colors h-10 w-10",
                        invoice.id === downloadingId || restricted
                          ? "cursor-not-allowed opacity-70"
                          : "hover:bg-border/80 cursor-pointer",
                      )}
                      onClick={(event) => {
                        if (invoice.id === downloadingId || restricted) return;
                        onDownload(
                          invoice.id,
                          event as React.MouseEvent<HTMLDivElement>,
                        );
                      }}
                    >
                      {invoice.id === downloadingId ? (
                        <Icons.spinner className="h-5 w-5 animate-spin" />
                      ) : (
                        (isDarkTheme
                          ? Icons.downloadDark
                          : Icons.downloadLight)({})
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className={cn(restricted && "pointer-events-none")}>
                      <InvoiceActions
                        isInvoicePage={false}
                        invoiceId={invoice.id}
                        isMarkedAsPaid={invoice.status === "paid"}
                        isDrafted={invoice.status === "drafted"}
                        isPending={invoice.status === "pending"}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={visibleColumns.length}
                className="text-center h-24"
              >
                No Invoices
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
