import { FirebaseError } from "firebase/app";
import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "../../lib/firebase";
import { toDate } from "../../lib/utils";
import { PurchaseBill } from "../../types/purchaseBillTypes";
import { PaginationState } from "./schema";

export const fetchUserPurchaseBills = async (
  uid: string,
  pagination: PaginationState,
) => {
  try {
    const { pageSize, pageIndex } = pagination;
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;

    const purchaseBillsRef = collection(db, "purchaseBills");
    const userPurchaseBillsQuery = query(
      purchaseBillsRef,
      where("uid", "==", uid),
    );

    const querySnapshot = await getDocs(userPurchaseBillsQuery);
    const allPurchaseBills = querySnapshot.docs
      .map((doc) => {
        const data = doc.data() as PurchaseBill;

        return {
          id: doc.id,
          date: data.purchaseBillDate,
          supplier: data.supplierName,
          status: data.purchaseBillStatus || "pending",
          purchaseBillNumber: data.purchaseBillNumber,
          amount: Number(data.amount) || 0,
        };
      })
      .sort((a, b) => {
        const firstDate = toDate(a.date)?.getTime() || 0;
        const secondDate = toDate(b.date)?.getTime() || 0;
        return secondDate - firstDate;
      });

    const userPurchaseBills = allPurchaseBills.slice(startIndex, endIndex);
    const hasNextPage = allPurchaseBills.length > endIndex;

    return {
      userPurchaseBills,
      hasNextPage,
      lastIndex:
        userPurchaseBills.length > 0
          ? userPurchaseBills[userPurchaseBills.length - 1].date
          : null,
      firstIndex:
        userPurchaseBills.length > 0 ? userPurchaseBills[0].date : null,
    };
  } catch (error) {
    error instanceof FirebaseError
      ? console.error(error.message)
      : console.error(error);
    throw new Error("Unable to fetch purchase bills");
  }
};
