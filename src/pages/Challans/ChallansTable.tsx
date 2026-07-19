import { Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { ChallanActions } from "../../components/action/ChallanActions";
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
import { ChallanStatus } from "../../types/challanTypes";
import { ColumnDef } from "./schema";

interface ChallansTableProps {
  challans?: {
    id: string;
    date: Timestamp;
    client: string;
    status: ChallanStatus;
    amount: number;
    totalPieces: number;
    challanNumber: string;
  }[];
  isPending: boolean;
  columns: ColumnDef[];
  onDownload: (
    challanId: string,
    event: React.MouseEvent<HTMLDivElement>,
  ) => void;
  downloadingId?: string | null;
}

export function ChallansTable({
  isPending,
  challans,
  columns,
  onDownload,
  downloadingId,
}: ChallansTableProps) {
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
          ) : challans?.length ? (
            challans.map((challan, index) => (
              <TableRow
                key={challan.id}
                className="cursor-pointer"
                onClick={() => navigate(`/challan/${challan.id}`)}
              >
                {visibleColumns.map((column) => (
                  <TableCell key={column.id} className="uppercase">
                    {column.id === "srNo" && index + 1}
                    {column.id === "challan" && (challan.id || " - ")}
                    {column.id === "challanNumber" &&
                      (challan.challanNumber || " - ")}
                    {column.id === "date" &&
                      (challan.date
                        ? formatFirestoreTimestamp(challan.date)
                        : " - ")}
                    {column.id === "client" &&
                      (challan.client ? challan.client.toUpperCase() : " - ")}
                    {column.id === "status" && (
                      <InvoiceStatusBadge status={challan.status} />
                    )}
                    {column.id === "pieces" && challan.totalPieces}
                    {column.id === "amount" &&
                      formatCurrency(challan.amount || 0)}
                  </TableCell>
                ))}

                <TableCell>
                  <div
                    className={cn(
                      "inline-flex items-center justify-center rounded-md font-medium transition-colors h-10 w-10",
                      challan.id === downloadingId
                        ? "cursor-not-allowed opacity-70"
                        : "hover:bg-border/80 cursor-pointer",
                    )}
                    onClick={(event) => {
                      if (challan.id === downloadingId) return;
                      onDownload(
                        challan.id,
                        event as React.MouseEvent<HTMLDivElement>,
                      );
                    }}
                  >
                    {challan.id === downloadingId ? (
                      <Icons.spinner className="h-5 w-5 animate-spin" />
                    ) : (
                      (isDarkTheme ? Icons.downloadDark : Icons.downloadLight)(
                        {},
                      )
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <ChallanActions
                    isChallanPage={false}
                    challanId={challan.id}
                    isMarkedAsPaid={challan.status === "paid"}
                    isDrafted={challan.status === "drafted"}
                    isPending={challan.status === "pending"}
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
                No Challans
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
