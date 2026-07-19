import { Timestamp } from "firebase/firestore";

import {
  PurchaseBill,
  TransformedPurchaseBill,
} from "../../../types/purchaseBillTypes";
import {
  amountToWords,
  calculatePurchaseBillItemAmount,
  calculatePurchaseBillTotals,
  formatPurchaseBillDate,
  toPurchaseBillNumber,
} from "../purchaseBillUtils";

export const transformPurchaseBillData = (
  data: PurchaseBill,
): TransformedPurchaseBill => {
  const normalizedItems = (data.itemList || []).map((item) => ({
    ...item,
    qty2: toPurchaseBillNumber(item.qty2),
    quantity: toPurchaseBillNumber(item.quantity),
    taxRate: toPurchaseBillNumber(item.taxRate),
    rate: toPurchaseBillNumber(item.rate),
    gstPercentage: toPurchaseBillNumber(item.gstPercentage),
  }));
  const items = normalizedItems.map((item) => ({
    ...item,
    amount: calculatePurchaseBillItemAmount(item).toDecimalPlaces(2).toNumber(),
  }));
  const totals = calculatePurchaseBillTotals(normalizedItems);
  const dueDate =
    data.dueDate instanceof Timestamp ? data.dueDate : data.dueDate;

  return {
    supplier: {
      name: data.supplierName || "-",
      telephone: data.supplierTelephone || "-",
      email: data.supplierEmail || "-",
      address: data.supplierAddress || "-",
      city: data.supplierCity || "-",
      state: data.supplierState || "-",
      postCode: data.supplierPostCode || "-",
      country: data.supplierCountry || "-",
      gstNumber: data.supplierGSTNumber || "-",
      udyamNumber: data.supplierUdyamNumber || "-",
    },
    buyer: {
      name: data.buyerName || "-",
      telephone: data.buyerTelephone || "-",
      email: data.buyerEmail || "-",
      address: data.buyerAddress || "-",
      city: data.buyerCity || "-",
      state: data.buyerState || "-",
      postCode: data.buyerPostCode || "-",
      country: data.buyerCountry || "-",
      gstNumber: data.buyerGSTNumber || "-",
    },
    bill: {
      id: data.id || "-",
      number: data.purchaseBillNumber || "-",
      date: formatPurchaseBillDate(data.purchaseBillDate),
      paymentTerms: data.paymentTerms || "-",
      dueDate: formatPurchaseBillDate(dueDate),
      vehicleNumber: data.vehicleNumber || "-",
      placeOfSupply: data.placeOfSupply || "-",
      memoType: data.memoType || "Debit Memo",
      copyType: data.copyType || "Original",
    },
    items,
    totals,
    bankDetails: {
      bankName: data.bankName || "-",
      bankAccountNumber: data.bankAccountNumber || "-",
      bankBranchName: data.bankBranchName || "-",
      bankIfscCode: data.bankIfscCode || "-",
    },
    totalGstInWords: `${amountToWords(totals.totalGstAmount)} Only`,
    billAmountInWords: `${amountToWords(totals.roundedAmount)} Only`,
    termsAndConditions: [
      "Goods once sold will not be taken back.",
      "\"Subject to 'SURAT' Jurisdiction only. E.&.O.E\"",
      "Interest @18% p.a. will be charged if payment is not made within due date.",
      "Our risk and responsibility ceases as soon as the goods leave our premises.",
    ],
  };
};
