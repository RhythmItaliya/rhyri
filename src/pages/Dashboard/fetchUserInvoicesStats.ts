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

export const fetchUserInvoicesStats = async (
  uid: string,
  restrictionDate?: Date | null,
  restrictionType?: "disable" | "hide",
) => {
  try {
    const invoicesRef = collection(db, "invoices");

    let userInvoicesQuery = query(invoicesRef, where("uid", "==", uid));

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

    const querySnapshot = await getDocs(userInvoicesQuery);

    const totalInvoiceCount = querySnapshot.size;

    let totalInvoicesAmount = 0;
    let pendingInvoicesCount = 0;
    let draftedInvoicesCount = 0;
    let paidInvoicesCount = 0;

    querySnapshot.docs.forEach((doc) => {
      const invoice = doc.data() as Invoice;

      totalInvoicesAmount += invoice.amount;

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

    const averageInvoiceAmount = totalInvoicesAmount
      ? totalInvoicesAmount / totalInvoiceCount
      : 0;

    return {
      totalInvoiceCount,
      totalInvoicesAmount,
      averageInvoiceAmount,
      pendingInvoicesCount,
      draftedInvoicesCount,
      paidInvoicesCount,
    };
  } catch (error) {
    error instanceof FirebaseError
      ? console.error(error.message)
      : console.error(error);

    throw new Error("Unable to fetch user invoice stats");
  }
};
