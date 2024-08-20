import { collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { FirebaseError } from "firebase/app";
import { Client } from "../../types";
import { PaginationState } from "./schema";

export const fetchUserClients = async (
  uid: string,
  pagination: PaginationState
) => {
  try {
    const {
      pageSize,
      lastIndex,
      firstIndex,
      pageIndex,
      pageAction,
      categoryFilterValue,
    } = pagination;
    const isFirstPage = pageIndex === 0;

    const clientsRef = collection(db, "clients");

    const increasedPageSize = pageSize + 1;

    let baseQuery = query(
      clientsRef,
      where("uid", "==", uid),
      orderBy("clientName", "asc"),
      limit(increasedPageSize)
    );

    if (categoryFilterValue) {
      baseQuery = query(
        baseQuery,
        where("clientCategory", "==", categoryFilterValue)
      );
    }

    let userClientsQuery = query(baseQuery);

    if (pageAction === "NEXT") {
      userClientsQuery = query(baseQuery, startAfter(lastIndex));
    } else if (!isFirstPage && pageAction === "PREV") {
      userClientsQuery = query(baseQuery, startAfter(firstIndex));
    }

    const userClientsQuerySnapshot = await getDocs(userClientsQuery);

    const allClients = userClientsQuerySnapshot.docs.map((doc) => {
      const data = doc.data() as Client;

      return {
        id: doc.id,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientTelephone: data.clientTelephone,
        clientCategory: data.clientCategory,
        uid: data.uid,
      };
    });

    const hasNextPage = allClients.length === increasedPageSize;

    const userClients = hasNextPage ? allClients.slice(0, -1) : allClients;

    return {
      userClients,
      hasNextPage,
      lastIndex:
        userClients.length > 0
          ? userClients[userClients.length - 1].clientName
          : null,
      firstIndex: userClients.length > 0 ? userClients[0].clientName : null,
    };
  } catch (error) {
    error instanceof FirebaseError
      ? console.error(error.message)
      : console.error(error);
    throw new Error("Unable to fetch clients");
  }
};
