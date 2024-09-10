import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table"
import { Skeleton } from "../../components/Skeleton"

import { formatCurrency, formatFirestoreTimestamp } from "../../lib/utils"

import type { Timestamp } from "firebase/firestore"
import { InvoiceStatus } from "../../types"
import { ColumnDef } from "./schema"

import { useNavigate } from "react-router-dom"
import { InvoiceStatusBadge } from "../../components/InvoiceStatusBadge"
import { InvoiceActions } from "../../components/action/InvoiceActions"
import { Icons } from "../../components/Icons"
import { useTheme } from "../../contexts/ThemeContext"

interface InvoicesTableProps {
  invoices?: {
    id: string
    date: Timestamp
    client: string
    status: InvoiceStatus
    amount: number
    invoiceCustomNumber: string
  }[]
  isPending: boolean
  columns: ColumnDef[]
  onDownload: (invoiceId: string, event: React.MouseEvent<HTMLDivElement>) => void;
}

export function InvoicesTable({
  isPending,
  invoices,
  columns,
  onDownload,
}: InvoicesTableProps) {
  const navigate = useNavigate()
  const visibleColumns = columns.filter((column) => column.isVisible)

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
          ) : invoices?.length ? (
            invoices.map((invoice) => (
              <TableRow
                key={invoice.id}
                className="cursor-pointer"
                onClick={() => navigate(`/invoice/${invoice.id}`)}
              >
                {visibleColumns.map((column) => (
                  <TableCell key={column.id} className="uppercase">
                    {column.id === "invoice" && (invoice.id || " - ")}
                    {column.id === "invoiceCustomNumber" && (invoice.invoiceCustomNumber || " - ")}
                    {column.id === "date" && (invoice.date ? formatFirestoreTimestamp(invoice.date) : " - ")}
                    {column.id === "client" && (invoice.client ? invoice.client.toUpperCase() : " - ")}
                    {column.id === "status" && <InvoiceStatusBadge status={invoice.status} />}
                    {column.id === "amount" && (invoice.amount ? formatCurrency(invoice.amount) : " - ")}
                  </TableCell>
                ))}

                <TableCell>
                  <div
                    className="inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-sm hover:bg-border/80 h-10 w-10 cursor-pointer"
                    onClick={(event) => onDownload(invoice.id, event as React.MouseEvent<HTMLDivElement>)}
                  >
                    {(isDarkTheme ? Icons.downloadDark : Icons.downloadLight)({})}
                  </div>
                </TableCell>

                <TableCell>
                  <InvoiceActions
                    isInvoicePage={false}
                    invoiceId={invoice.id}
                    isMarkedAsPaid={invoice.status === "paid"}
                    isDrafted={invoice.status === "drafted"}
                    isPending={invoice.status === "pending"}
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
                No Invoices
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
