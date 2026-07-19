import Decimal from "decimal.js";
import { Timestamp } from "firebase/firestore";
import { toWords } from "number-to-words";

import {
  PurchaseBillItem,
  PurchaseBillTotals,
} from "../../types/purchaseBillTypes";

export function toPurchaseBillNumber(value: number | string | undefined) {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

export function calculatePurchaseBillItemAmount(item: PurchaseBillItem) {
  return new Decimal(toPurchaseBillNumber(item.quantity)).times(
    toPurchaseBillNumber(item.rate),
  );
}

export function calculatePurchaseBillTotals(
  itemList: PurchaseBillItem[] = [],
): PurchaseBillTotals {
  const subtotal = itemList.reduce(
    (total, item) => total.plus(calculatePurchaseBillItemAmount(item)),
    new Decimal(0),
  );

  const totalGstAmount = itemList.reduce((total, item) => {
    const itemAmount = calculatePurchaseBillItemAmount(item);
    return total.plus(
      itemAmount.times(toPurchaseBillNumber(item.gstPercentage)).div(100),
    );
  }, new Decimal(0));

  const firstGstPercentage = new Decimal(
    toPurchaseBillNumber(itemList[0]?.gstPercentage),
  );
  const cgstRate = firstGstPercentage.div(2);
  const sgstRate = firstGstPercentage.div(2);
  const cgstAmount = totalGstAmount.div(2);
  const sgstAmount = totalGstAmount.div(2);
  const finalAmount = subtotal.plus(totalGstAmount);
  const roundedAmount = finalAmount.toDecimalPlaces(0, Decimal.ROUND_HALF_UP);
  const roundOff = roundedAmount.minus(finalAmount);

  const summaryByKey = new Map<
    string,
    {
      hsnSac: string;
      gstPercentage: Decimal;
      taxableValue: Decimal;
    }
  >();

  itemList.forEach((item) => {
    const gstPercentage = toPurchaseBillNumber(item.gstPercentage);
    const key = `${item.hsnSac || "-"}-${gstPercentage}`;
    const existing = summaryByKey.get(key);
    const taxableValue = calculatePurchaseBillItemAmount(item);

    if (existing) {
      existing.taxableValue = existing.taxableValue.plus(taxableValue);
      return;
    }

    summaryByKey.set(key, {
      hsnSac: item.hsnSac || "-",
      gstPercentage: new Decimal(gstPercentage),
      taxableValue,
    });
  });

  const hsnSummary = Array.from(summaryByKey.values()).map((summary) => {
    const cgstSummaryRate = summary.gstPercentage.div(2);
    const sgstSummaryRate = summary.gstPercentage.div(2);
    const gstAmount = summary.taxableValue
      .times(summary.gstPercentage)
      .div(100);

    return {
      hsnSac: summary.hsnSac,
      gstPercentage: summary.gstPercentage.toNumber(),
      taxableValue: summary.taxableValue.toDecimalPlaces(2).toNumber(),
      cgstRate: cgstSummaryRate.toNumber(),
      cgstAmount: gstAmount.div(2).toDecimalPlaces(2).toNumber(),
      sgstRate: sgstSummaryRate.toNumber(),
      sgstAmount: gstAmount.div(2).toDecimalPlaces(2).toNumber(),
    };
  });

  return {
    subtotal: subtotal.toDecimalPlaces(2).toNumber(),
    taxableAmount: subtotal.toDecimalPlaces(2).toNumber(),
    cgstRate: cgstRate.toNumber(),
    sgstRate: sgstRate.toNumber(),
    cgstAmount: cgstAmount.toDecimalPlaces(2).toNumber(),
    sgstAmount: sgstAmount.toDecimalPlaces(2).toNumber(),
    totalGstAmount: totalGstAmount.toDecimalPlaces(2).toNumber(),
    finalAmount: finalAmount.toDecimalPlaces(2).toNumber(),
    roundedAmount: roundedAmount.toNumber(),
    roundOff: roundOff.toDecimalPlaces(2).toNumber(),
    hsnSummary,
  };
}

export function formatPurchaseBillDate(
  date: string | Date | Timestamp | undefined,
) {
  if (!date) return "-";

  const parsedDate =
    date instanceof Timestamp
      ? date.toDate()
      : date instanceof Date
        ? date
        : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "-";

  const day = String(parsedDate.getDate()).padStart(2, "0");
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const year = parsedDate.getFullYear();

  return `${day}/${month}/${year}`;
}

export function amountToWords(amount: number) {
  return toWords(Math.abs(amount))
    .replace(/,/g, "")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
