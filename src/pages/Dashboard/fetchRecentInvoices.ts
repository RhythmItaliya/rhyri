import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { startOfDay } from "date-fns";

import { db } from "../../lib/firebase";
import { Invoice } from "../../types";
import { FirebaseError } from "firebase/app";

export const fetchRecentInvoices = async (
  uid: string,
  restrictionDate?: Date | null,
  restrictionType?: "disable" | "hide",
) => {
  try {
    const invoicesRef = collection(db, "invoices");

    let userInvoicesQuery = query(
      invoicesRef,
      where("uid", "==", uid),
      orderBy("invoiceDate", "desc"),
      limit(10),
    );

    if (restrictionType === "hide" && restrictionDate) {
      userInvoicesQuery = query(
        userInvoicesQuery,
        where(
          "invoiceDate",
          ">",
          Timestamp.fromDate(startOfDay(restrictionDate)),
        ),
      );
    }
    const querySnapshot = await getDocs(userInvoicesQuery);

    return querySnapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id }) as Invoice,
    );
  } catch (error) {
    error instanceof FirebaseError
      ? console.error(error.message)
      : console.error(error);

    throw new Error("Unable to fetch recent invoices");
  }
};
