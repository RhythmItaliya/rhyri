import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { FirebaseError } from "firebase/app";
import { startOfDay } from "date-fns";
import { Invoice } from "../../types";
import { PaginationState } from "./schema";

export const fetchUserInvoices = async (
  uid: string,
  pagination: PaginationState,
  restrictionDate?: Date | null,
  restrictionType?: "disable" | "hide",
) => {
  try {
    const {
      pageSize,
      lastIndex,
      firstIndex,
      pageIndex,
      pageAction,
      statusFilterValue,
    } = pagination;
    const isFirstPage = pageIndex === 0;

    const invoicesRef = collection(db, "invoices");

    // Increase the limit by 1 to check for the next page
    const increasedPageSize = pageSize + 1;

    let baseQuery = query(
      invoicesRef,
      where("uid", "==", uid),
      orderBy("invoiceDate", "desc"),
      limit(increasedPageSize),
    );

    if (restrictionType === "hide" && restrictionDate) {
      baseQuery = query(
        baseQuery,
        where(
          "invoiceDate",
          ">",
          Timestamp.fromDate(startOfDay(restrictionDate)),
        ),
      );
    }

    if (statusFilterValue) {
      baseQuery = query(
        baseQuery,
        where("invoiceStatus", "==", statusFilterValue),
      );
    }

    let userInvoicesQuery = query(baseQuery);

    if (pageAction === "NEXT") {
      userInvoicesQuery = query(baseQuery, startAfter(lastIndex));
    } else if (!isFirstPage && pageAction === "PREV") {
      userInvoicesQuery = query(baseQuery, startAfter(firstIndex));
    }

    const userInvoicesQuerySnapshot = await getDocs(userInvoicesQuery);
    const allInvoices = userInvoicesQuerySnapshot.docs.map((doc) => {
      const data = doc.data() as Invoice;

      return {
        id: doc.id,
        date: data.invoiceDate,
        client: data.clientName,
        status: data.invoiceStatus,
        invoiceCustomNumber: data.invoiceCustomNumber,
        amount: data.amount,
      };
    });

    // Check if there's a next page
    const hasNextPage = allInvoices.length === increasedPageSize;

    // If there's a next page, remove the extra invoice
    const userInvoices = hasNextPage ? allInvoices.slice(0, -1) : allInvoices;

    return {
      userInvoices,
      hasNextPage,
      lastIndex:
        userInvoices.length > 0
          ? userInvoices[userInvoices.length - 1].date
          : null,
      firstIndex: userInvoices.length > 0 ? userInvoices[0].date : null,
    };
  } catch (error) {
    error instanceof FirebaseError
      ? console.error(error.message)
      : console.error(error);
    throw new Error("Unable to fetch invoices");
  }
};
