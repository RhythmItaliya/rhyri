import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import { Card, CardContent } from "../../components/ui/Card";
import { InvoiceStatusBadge } from "../../components/InvoiceStatusBadge";
import { InvoiceActions } from "../../components/action/InvoiceActions";

import { useAuth } from "../../contexts/AuthContext";
import { Navigate, useParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import { fetchInvoice } from "./fetchInvoice";
import { catchError, formatFirestoreTimestamp } from "../../lib/utils";

import Decimal from "decimal.js";
import { UserSkeleton } from "../../components/UserSkeleton";

export function InvoicePage() {
  const { id } = useParams();
  const { currentUser } = useAuth();

  if (!currentUser || !id) return null;

  const {
    data: invoice,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["invoice", currentUser.uid, id],
    queryFn: () => fetchInvoice(id, currentUser.uid),
  });

  if (error) {
    catchError(error);
  }

  const transformedItems = invoice?.itemList || [];
  const amount = new Decimal(invoice?.amount || 0);
  const discountPercentage = new Decimal(invoice?.discountPercentage || "0");
  const discountAmount = new Decimal(invoice?.discountAmount || 0);
  const gst = new Decimal(invoice?.gst || "0");
  const sgst = new Decimal(invoice?.sgst || "0");
  const otherTaxPercentage = new Decimal(invoice?.otherTaxPercentage || "0");
  const otherTaxAmount = new Decimal(invoice?.otherTaxAmount || "0");
  const discountType = invoice?.discountType
    ? String(invoice.discountType).toLowerCase()
    : "percentage";
  const otherTaxType = invoice?.otherTaxType
    ? String(invoice.otherTaxType).toLowerCase()
    : "percentage";
  const discountApplied =
    discountType === "percentage"
      ? amount.times(discountPercentage).div(100)
      : discountAmount;
  const totalAfterDiscount = amount.minus(discountApplied);
  const gstAmount = totalAfterDiscount.times(gst).div(100);
  const sgstAmount = totalAfterDiscount.times(sgst).div(100);
  const otherTaxFinal =
    otherTaxType === "percentage"
      ? totalAfterDiscount.times(otherTaxPercentage).div(100)
      : otherTaxAmount;
  const finalAmount = totalAfterDiscount
    .plus(gstAmount)
    .plus(sgstAmount)
    .plus(otherTaxFinal);
  const roundedAmount = finalAmount.toDecimalPlaces(0, Decimal.ROUND_HALF_UP);

  return (
    <>
      {isLoading ? (
        <UserSkeleton />
      ) : invoice ? (
        <div className="space-y-4 w-full max-w-5xl mx-auto">
          <Card>
            <CardContent className="flex-between pt-4">
              <InvoiceStatusBadge status={invoice.invoiceStatus} />
              <InvoiceActions
                isInvoicePage={true}
                invoiceId={invoice.id}
                isMarkedAsPaid={invoice.invoiceStatus === "paid"}
                isDrafted={invoice.invoiceStatus === "drafted"}
                isPending={invoice.invoiceStatus === "pending"}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-8 p-8">
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
                <div className="space-y-1">
                  <p className="font-semibold">Invoice ID:</p>
                  <p className="text-sm">{invoice.id || " - "}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">Invoice Number:</p>
                  <p className="text-sm">
                    {invoice.invoiceCustomNumber || " - "}
                  </p>
                </div>
              </div>

              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
                <div className="space-y-1">
                  <p className="font-semibold">Invoice Date:</p>
                  <p className="text-sm">
                    {invoice.invoiceDate
                      ? formatFirestoreTimestamp(invoice.invoiceDate)
                      : " - "}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">Due Date:</p>
                  <p className="text-sm">
                    {invoice.dueDate
                      ? formatFirestoreTimestamp(invoice.dueDate)
                      : " - "}
                  </p>
                </div>
              </div>

              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
                <div className="space-y-1">
                  <p className="font-semibold">Company Details:</p>
                  <p className="text-sm">
                    {invoice.companyName?.toUpperCase() || " - "}
                  </p>
                  <p className="text-sm">
                    {invoice.companyTelephone?.toUpperCase() || " - "}
                  </p>
                  <p className="text-sm">
                    {invoice.companyEmail?.toLowerCase() || " - "}
                  </p>
                  <p className="text-sm">
                    {invoice.companyCity?.toUpperCase() || " - "}
                  </p>
                  <p className="text-sm">
                    {invoice.companyPostCode?.toUpperCase() || " - "}
                  </p>
                  <p className="text-sm">
                    {invoice.companyState?.toUpperCase() || " - "}
                  </p>
                  <p className="text-sm">
                    {invoice.companyCountry?.toUpperCase() || " - "}
                  </p>
                  <p className="text-sm">
                    {invoice.companyAddress?.toUpperCase() || " - "}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="font-semibold">Client Details:</p>
                  <p className="text-sm">
                    {invoice.clientName?.toUpperCase() || " - "}
                  </p>
                  <p className="text-sm">
                    {invoice.clientEmail?.toLowerCase() || " - "}
                  </p>
                  <p className="text-sm">
                    {invoice.clientCity?.toUpperCase() || " - "}
                  </p>
                  <p className="text-sm">
                    {invoice.clientPostCode?.toUpperCase() || " - "}
                  </p>
                  <p className="text-sm">
                    {invoice.clientCountry?.toUpperCase() || " - "}
                  </p>
                  <p className="text-sm">
                    {invoice.clientAddress?.toUpperCase() || " - "}
                  </p>
                  <p className="text-sm">
                    {invoice.clientGSTNumber?.toUpperCase() || " - "}
                  </p>
                </div>
              </div>

              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
                <div className="space-y-1">
                  <p className="font-semibold">Bank Details:</p>
                  <p className="text-sm">
                    Bank Name:{" "}
                    <span className="uppercase">
                      {invoice.bankName?.toUpperCase() || " - "}
                    </span>
                  </p>
                  <p className="text-sm">
                    Account Number:{" "}
                    <span className="uppercase">
                      {invoice.bankAccountNumber?.toUpperCase() || " - "}
                    </span>
                  </p>
                  <p className="text-sm">
                    Branch Name:{" "}
                    <span className="uppercase">
                      {invoice.bankBranchName?.toUpperCase() || " - "}
                    </span>
                  </p>
                  <p className="text-sm">
                    IFSC Code:{" "}
                    <span className="uppercase">
                      {invoice.bankIfscCode?.toUpperCase() || " - "}
                    </span>
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="mb-5">
                    <p className="font-semibold">Company GST:</p>
                    <p className="text-sm uppercase">
                      {invoice.companyGSTNumber?.toUpperCase() || " - "}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Client GST:</p>
                    <p className="text-sm uppercase">
                      {invoice.clientGSTNumber?.toUpperCase() || " - "}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border rounded-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Challan No.</TableHead>
                      <TableHead>Qty.</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Tax</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transformedItems.map(
                      ({ item, quantity, price, challanNumber }) => {
                        const itemDiscount =
                          discountType === "percentage"
                            ? new Decimal(price)
                                .times(discountPercentage)
                                .div(100)
                            : discountAmount;
                        const itemTax = gst.plus(sgst).div(2);
                        const itemTotal = new Decimal(price)
                          .times(quantity)
                          .minus(itemDiscount)
                          .plus(itemTax);

                        return (
                          <TableRow key={item}>
                            <TableCell>{item}</TableCell>
                            <TableCell>{challanNumber || "-"}</TableCell>
                            <TableCell>{quantity}</TableCell>
                            <TableCell>₹{price.toString()}</TableCell>
                            <TableCell>
                              ₹{itemDiscount.toString()}{" "}
                              {discountType === "percentage"
                                ? `(${discountPercentage.toString()}%)`
                                : ""}
                            </TableCell>
                            <TableCell>₹{itemTax.toString()}</TableCell>
                            <TableCell>₹{itemTotal.toString()}</TableCell>
                          </TableRow>
                        );
                      },
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={6} className="text-sm font-semibold">
                        TOTAL
                      </TableCell>
                      <TableCell className="text-left text-sm font-medium">
                        ₹{amount.toString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={5} className="text-sm font-semibold">
                        DISCOUNT (
                        {discountType === "percentage"
                          ? discountPercentage.toString() + "%"
                          : "₹"}
                        ):
                      </TableCell>
                      <TableCell className="text-left text-sm font-medium">
                        ₹{discountApplied.toString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={5} className="text-sm font-semibold">
                        TOTAL BEFORE DISCOUNT:
                      </TableCell>
                      <TableCell className="text-left text-sm font-medium">
                        ₹{totalAfterDiscount.toString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={5} className="text-sm font-semibold">
                        GST ({gst.toString()}%):
                      </TableCell>
                      <TableCell className="text-left text-sm font-medium">
                        ₹{gstAmount.toString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={5} className="text-sm font-semibold">
                        SGST ({sgst.toString()}%):
                      </TableCell>
                      <TableCell className="text-left text-sm font-medium">
                        ₹{sgstAmount.toString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={5} className="text-sm font-semibold">
                        OTHER TAX (
                        {otherTaxType === "percentage"
                          ? otherTaxPercentage.toString() + "%"
                          : "₹"}
                        ):
                      </TableCell>
                      <TableCell className="text-left text-sm font-medium">
                        ₹{otherTaxFinal.toString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={5} className="text-sm font-semibold">
                        TOTAL:
                      </TableCell>
                      <TableCell className="text-left text-sm font-medium">
                        ₹{finalAmount.toString()}
                      </TableCell>
                    </TableRow>
                    {roundedAmount && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-sm font-semibold"
                        >
                          Rounded Amount:
                        </TableCell>
                        <TableCell className="text-left text-sm font-medium">
                          ₹{roundedAmount.toString()}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableFooter>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Navigate to="/invoices" />
      )}
    </>
  );
}
