import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";

import { PurchaseBillActions } from "../../components/action/PurchaseBillActions";
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
import { fetchPurchaseBill } from "./fetchPurchaseBill";
import {
  calculatePurchaseBillItemAmount,
  calculatePurchaseBillTotals,
} from "./purchaseBillUtils";

export function PurchaseBillPage() {
  const { id } = useParams();
  const { currentUser } = useAuth();

  if (!currentUser || !id) return null;

  const {
    data: purchaseBill,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["purchaseBill", currentUser.uid, id],
    queryFn: () => fetchPurchaseBill(id, currentUser.uid),
  });

  if (error) {
    catchError(error);
  }

  if (isLoading) {
    return <UserSkeleton />;
  }

  if (!purchaseBill) {
    return <Navigate to="/purchase-bills" />;
  }

  const itemList = purchaseBill.itemList || [];
  const purchaseBillStatus = purchaseBill.purchaseBillStatus || "pending";
  const totals = calculatePurchaseBillTotals(itemList);

  return (
    <div className="space-y-4 w-full max-w-5xl mx-auto">
      <Card>
        <CardContent className="flex-between pt-4">
          <InvoiceStatusBadge status={purchaseBillStatus} />
          <PurchaseBillActions
            isPurchaseBillPage={true}
            purchaseBillId={purchaseBill.id}
            isMarkedAsPaid={purchaseBillStatus === "paid"}
            isDrafted={purchaseBillStatus === "drafted"}
            isPending={purchaseBillStatus === "pending"}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-8 p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="font-semibold">Purchase Bill ID:</p>
              <p className="text-sm">{purchaseBill.id}</p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold">Bill Number:</p>
              <p className="text-sm uppercase">
                {purchaseBill.purchaseBillNumber || " - "}
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold">Bill Date:</p>
              <p className="text-sm">
                {purchaseBill.purchaseBillDate
                  ? formatFirestoreTimestamp(purchaseBill.purchaseBillDate)
                  : " - "}
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold">Due Date:</p>
              <p className="text-sm">
                {purchaseBill.dueDate
                  ? formatFirestoreTimestamp(purchaseBill.dueDate)
                  : " - "}
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="font-semibold">Supplier Details:</p>
              <p className="text-sm uppercase">{purchaseBill.supplierName}</p>
              <p className="text-sm uppercase">
                {purchaseBill.supplierAddress || " - "}
              </p>
              <p className="text-sm uppercase">
                {purchaseBill.supplierCity || " - "}
              </p>
              <p className="text-sm uppercase">
                GST: {purchaseBill.supplierGSTNumber || " - "}
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold">Buyer Details:</p>
              <p className="text-sm uppercase">{purchaseBill.buyerName}</p>
              <p className="text-sm uppercase">
                {purchaseBill.buyerAddress || " - "}
              </p>
              <p className="text-sm uppercase">
                {purchaseBill.buyerCity || " - "}
              </p>
              <p className="text-sm uppercase">
                GST: {purchaseBill.buyerGSTNumber || " - "}
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="font-semibold">Supply Details:</p>
              <p className="text-sm uppercase">
                Place of Supply: {purchaseBill.placeOfSupply || " - "}
              </p>
              <p className="text-sm uppercase">
                Vehicle No: {purchaseBill.vehicleNumber || " - "}
              </p>
              <p className="text-sm uppercase">
                Pay Due: {purchaseBill.paymentTerms || " - "}
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold">Bank Details:</p>
              <p className="text-sm uppercase">
                Bank Name: {purchaseBill.bankName || " - "}
              </p>
              <p className="text-sm uppercase">
                Account Number: {purchaseBill.bankAccountNumber || " - "}
              </p>
              <p className="text-sm uppercase">
                Branch Name: {purchaseBill.bankBranchName || " - "}
              </p>
              <p className="text-sm uppercase">
                IFSC Code: {purchaseBill.bankIfscCode || " - "}
              </p>
            </div>
          </div>

          <div className="border rounded-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>HSN/SAC</TableHead>
                  <TableHead>Qty2</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Tax Rate</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>GST %</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itemList.map((item, index) => (
                  <TableRow key={`${item.productName}-${index}`}>
                    <TableCell className="uppercase">
                      {item.productName}
                    </TableCell>
                    <TableCell>{item.hsnSac}</TableCell>
                    <TableCell>{item.qty2 || "-"}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatCurrency(item.taxRate)}</TableCell>
                    <TableCell>{formatCurrency(item.rate)}</TableCell>
                    <TableCell>{item.gstPercentage}%</TableCell>
                    <TableCell>
                      {formatCurrency(
                        calculatePurchaseBillItemAmount(item).toNumber(),
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={7}>Sub Total</TableCell>
                  <TableCell>{formatCurrency(totals.subtotal)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={7}>CGST</TableCell>
                  <TableCell>{formatCurrency(totals.cgstAmount)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={7}>SGST</TableCell>
                  <TableCell>{formatCurrency(totals.sgstAmount)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={7}>Grand Total</TableCell>
                  <TableCell>{formatCurrency(totals.roundedAmount)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
