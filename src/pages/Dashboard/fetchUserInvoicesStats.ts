import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { startOfDay } from "date-fns";
import { db } from "../../lib/firebase";

import { Invoice } from "../../types";
import { FirebaseError } from "firebase/app";
import { PurchaseBill } from "../../types/purchaseBillTypes";
import { Challan } from "../../types/challanTypes";
import { toDate } from "../../lib/utils";

const toAmount = (amount: number | undefined) => {
  const parsedAmount = Number(amount);
  return Number.isFinite(parsedAmount) ? parsedAmount : 0;
};

export const fetchUserInvoicesStats = async (
  uid: string,
  restrictionDate?: Date | null,
  restrictionType?: "disable" | "hide",
) => {
  try {
    const invoicesRef = collection(db, "invoices");
    const purchaseBillsRef = collection(db, "purchaseBills");
    const challansRef = collection(db, "challans");

    let userInvoicesQuery = query(invoicesRef, where("uid", "==", uid));
    const userPurchaseBillsQuery = query(
      purchaseBillsRef,
      where("uid", "==", uid),
    );
    const userChallansQuery = query(challansRef, where("uid", "==", uid));

    if (restrictionType === "hide" && restrictionDate) {
      userInvoicesQuery = query(
        userInvoicesQuery,
        where(
          "invoiceDate",
          ">",
          Timestamp.fromDate(startOfDay(restrictionDate)),
        ),
        orderBy("invoiceDate", "desc"),
      );
    }

    const [invoiceSnapshot, purchaseBillSnapshot, challanSnapshot] =
      await Promise.all([
        getDocs(userInvoicesQuery),
        getDocs(userPurchaseBillsQuery),
        getDocs(userChallansQuery),
      ]);

    const totalInvoiceCount = invoiceSnapshot.size;
    let totalPurchaseBillCount = 0;
    let totalChallanCount = 0;

    let totalInvoicesAmount = 0;
    let totalPurchaseBillsAmount = 0;
    let totalChallansAmount = 0;
    let pendingInvoicesCount = 0;
    let draftedInvoicesCount = 0;
    let paidInvoicesCount = 0;
    let pendingPurchaseBillsCount = 0;
    let draftedPurchaseBillsCount = 0;
    let paidPurchaseBillsCount = 0;
    let pendingChallansCount = 0;
    let draftedChallansCount = 0;
    let paidChallansCount = 0;

    invoiceSnapshot.docs.forEach((doc) => {
      const invoice = doc.data() as Invoice;

      totalInvoicesAmount += toAmount(invoice.amount);

      switch (invoice.invoiceStatus) {
        case "pending":
          pendingInvoicesCount++;
          break;
        case "paid":
          paidInvoicesCount++;
          break;
        default:
          draftedInvoicesCount++;
          break;
      }
    });

    purchaseBillSnapshot.docs.forEach((doc) => {
      const purchaseBill = doc.data() as PurchaseBill;
      const purchaseBillDate = toDate(purchaseBill.purchaseBillDate);

      if (
        restrictionType === "hide" &&
        restrictionDate &&
        purchaseBillDate &&
        startOfDay(purchaseBillDate) <= startOfDay(restrictionDate)
      ) {
        return;
      }

      totalPurchaseBillCount++;
      totalPurchaseBillsAmount += toAmount(purchaseBill.amount);

      switch (purchaseBill.purchaseBillStatus) {
        case "pending":
          pendingPurchaseBillsCount++;
          break;
        case "paid":
          paidPurchaseBillsCount++;
          break;
        default:
          draftedPurchaseBillsCount++;
          break;
      }
    });

    challanSnapshot.docs.forEach((doc) => {
      const challan = doc.data() as Challan;
      const challanDate = toDate(challan.challanDate);

      if (
        restrictionType === "hide" &&
        restrictionDate &&
        challanDate &&
        startOfDay(challanDate) <= startOfDay(restrictionDate)
      ) {
        return;
      }

      totalChallanCount++;
      totalChallansAmount += toAmount(challan.amount);

      switch (challan.challanStatus) {
        case "pending":
          pendingChallansCount++;
          break;
        case "paid":
          paidChallansCount++;
          break;
        default:
          draftedChallansCount++;
          break;
      }
    });

    const averageInvoiceAmount = totalInvoicesAmount
      ? totalInvoicesAmount / totalInvoiceCount
      : 0;
    const averagePurchaseBillAmount = totalPurchaseBillsAmount
      ? totalPurchaseBillsAmount / totalPurchaseBillCount
      : 0;

    return {
      totalInvoiceCount,
      totalPurchaseBillCount,
      totalChallanCount,
      totalInvoicesAmount,
      totalPurchaseBillsAmount,
      totalChallansAmount,
      totalBusinessAmount:
        totalInvoicesAmount + totalPurchaseBillsAmount + totalChallansAmount,
      averageInvoiceAmount,
      averagePurchaseBillAmount,
      pendingInvoicesCount,
      draftedInvoicesCount,
      paidInvoicesCount,
      pendingPurchaseBillsCount,
      draftedPurchaseBillsCount,
      paidPurchaseBillsCount,
      pendingChallansCount,
      draftedChallansCount,
      paidChallansCount,
    };
  } catch (error) {
    error instanceof FirebaseError
      ? console.error(error.message)
      : console.error(error);

    throw new Error("Unable to fetch user invoice stats");
  }
};
