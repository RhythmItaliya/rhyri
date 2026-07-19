import Decimal from "decimal.js";
import { Timestamp } from "firebase/firestore";

import { ChallanItem } from "../../types/challanTypes";

export function toChallanNumber(value: number | string | undefined) {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

export function calculateChallanItemAmount(item: ChallanItem) {
  return new Decimal(toChallanNumber(item.quantity)).times(
    toChallanNumber(item.rate),
  );
}

export function calculateChallanTotals(itemList: ChallanItem[] = []) {
  return itemList.reduce(
    (totals, item) => {
      const pieces = toChallanNumber(item.pieces);
      const quantity = toChallanNumber(item.quantity);
      const amount = calculateChallanItemAmount(item);

      return {
        totalPieces: totals.totalPieces.plus(pieces),
        totalQuantity: totals.totalQuantity.plus(quantity),
        amount: totals.amount.plus(amount),
      };
    },
    {
      totalPieces: new Decimal(0),
      totalQuantity: new Decimal(0),
      amount: new Decimal(0),
    },
  );
}

export function getChallanTotals(itemList: ChallanItem[] = []) {
  const totals = calculateChallanTotals(itemList);

  return {
    totalPieces: totals.totalPieces.toDecimalPlaces(2).toNumber(),
    totalQuantity: totals.totalQuantity.toDecimalPlaces(3).toNumber(),
    amount: totals.amount.toDecimalPlaces(2).toNumber(),
  };
}

export function formatChallanDate(date: string | Date | Timestamp | undefined) {
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

export function incrementChallanNumber(lastNumber: string) {
  const match = lastNumber.match(/(\d+)$/);
  if (!match) return `${lastNumber}-1`;

  const num = Number(match[0]);
  const nextNum = String(num + 1).padStart(match[0].length, "0");
  return lastNumber.substring(0, match.index ?? 0) + nextNum;
}
