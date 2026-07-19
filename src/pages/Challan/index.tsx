import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";

import { ChallanActions } from "../../components/action/ChallanActions";
import { InvoiceStatusBadge } from "../../components/InvoiceStatusBadge";
import { UserSkeleton } from "../../components/UserSkeleton";
import { Card, CardContent } from "../../components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import { useAuth } from "../../contexts/AuthContext";
import {
  catchError,
  formatCurrency,
  formatFirestoreTimestamp,
} from "../../lib/utils";
import { fetchChallan } from "./fetchChallan";
import { calculateChallanItemAmount, getChallanTotals } from "./challanUtils";

export function ChallanPage() {
  const { id } = useParams();
  const { currentUser } = useAuth();

  if (!currentUser || !id) return null;

  const {
    data: challan,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["challan", currentUser.uid, id],
    queryFn: () => fetchChallan(id, currentUser.uid),
  });

  if (error) {
    catchError(error);
  }

  if (isLoading) {
    return <UserSkeleton />;
  }

  if (!challan) {
    return <Navigate to="/challans" />;
  }

  const itemList = challan.itemList || [];
  const challanStatus = challan.challanStatus || "pending";
  const totals = getChallanTotals(itemList);

  return (
    <div className="space-y-4 w-full max-w-5xl mx-auto">
      <Card>
        <CardContent className="flex-between pt-4">
          <InvoiceStatusBadge status={challanStatus} />
          <ChallanActions
            isChallanPage={true}
            challanId={challan.id}
            isMarkedAsPaid={challanStatus === "paid"}
            isDrafted={challanStatus === "drafted"}
            isPending={challanStatus === "pending"}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-8 p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="font-semibold">Challan ID:</p>
              <p className="text-sm">{challan.id}</p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold">Challan Number:</p>
              <p className="text-sm uppercase">
                {challan.challanNumber || " - "}
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold">Challan Date:</p>
              <p className="text-sm">
                {challan.challanDate
                  ? formatFirestoreTimestamp(challan.challanDate)
                  : " - "}
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold">P.O. Number:</p>
              <p className="text-sm uppercase">{challan.poNumber || " - "}</p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="font-semibold">Company Details:</p>
              <p className="text-sm uppercase">{challan.companyName}</p>
              <p className="text-sm uppercase">
                {challan.companyAddress || " - "}
              </p>
              <p className="text-sm uppercase">
                {challan.companyCity || " - "}
              </p>
              <p className="text-sm uppercase">
                GST: {challan.companyGSTNumber || " - "}
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold">Client Details:</p>
              <p className="text-sm uppercase">{challan.clientName}</p>
              <p className="text-sm uppercase">
                {challan.clientAddress || " - "}
              </p>
              <p className="text-sm uppercase">{challan.clientCity || " - "}</p>
              <p className="text-sm uppercase">
                GST: {challan.clientGSTNumber || " - "}
              </p>
            </div>
          </div>

          <div className="border rounded-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Design No.</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Pieces</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itemList.map((item, index) => (
                  <TableRow key={`${item.description}-${index}`}>
                    <TableCell className="uppercase">
                      {item.designNumber || " - "}
                    </TableCell>
                    <TableCell className="uppercase">
                      {item.description}
                    </TableCell>
                    <TableCell className="uppercase">
                      {item.size || " - "}
                    </TableCell>
                    <TableCell>{item.pieces || 0}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatCurrency(item.rate)}</TableCell>
                    <TableCell>
                      {formatCurrency(
                        calculateChallanItemAmount(item).toNumber(),
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell>{totals.totalPieces}</TableCell>
                  <TableCell>{totals.totalQuantity}</TableCell>
                  <TableCell></TableCell>
                  <TableCell>{formatCurrency(totals.amount)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
