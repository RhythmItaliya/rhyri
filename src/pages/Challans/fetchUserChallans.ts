import { FirebaseError } from "firebase/app";
import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "../../lib/firebase";
import { toDate } from "../../lib/utils";
import { Challan } from "../../types/challanTypes";
import { PaginationState } from "./schema";

export const fetchUserChallans = async (
  uid: string,
  pagination: PaginationState,
) => {
  try {
    const { pageSize, pageIndex } = pagination;
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;

    const challansRef = collection(db, "challans");
    const userChallansQuery = query(challansRef, where("uid", "==", uid));

    const querySnapshot = await getDocs(userChallansQuery);
    const allChallans = querySnapshot.docs
      .map((doc) => {
        const data = doc.data() as Challan;

        return {
          id: doc.id,
          date: data.challanDate,
          client: data.clientName,
          status: data.challanStatus || "pending",
          challanNumber: data.challanNumber,
          totalPieces: Number(data.totalPieces) || 0,
          amount: Number(data.amount) || 0,
        };
      })
      .sort((a, b) => {
        const firstDate = toDate(a.date)?.getTime() || 0;
        const secondDate = toDate(b.date)?.getTime() || 0;
        return secondDate - firstDate;
      });

    const userChallans = allChallans.slice(startIndex, endIndex);
    const hasNextPage = allChallans.length > endIndex;

    return {
      userChallans,
      hasNextPage,
      lastIndex:
        userChallans.length > 0
          ? userChallans[userChallans.length - 1].date
          : null,
      firstIndex: userChallans.length > 0 ? userChallans[0].date : null,
    };
  } catch (error) {
    error instanceof FirebaseError
      ? console.error(error.message)
      : console.error(error);
    throw new Error("Unable to fetch challans");
  }
};
