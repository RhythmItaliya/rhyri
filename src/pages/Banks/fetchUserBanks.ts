import { collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { FirebaseError } from "firebase/app";
import { Bank } from "../../types";
import { PaginationState } from "./schema";

export const fetchUserBanks = async (
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

        const banksRef = collection(db, "banks");

        const increasedPageSize = pageSize + 1;

        let baseQuery = query(
            banksRef,
            where("uid", "==", uid),
            orderBy("bankName", "asc"),
            limit(increasedPageSize)
        );

        if (categoryFilterValue) {
            baseQuery = query(
                baseQuery,
                where("bankCategory", "==", categoryFilterValue)
            );
        }

        let userBanksQuery = query(baseQuery);

        if (pageAction === "NEXT") {
            userBanksQuery = query(baseQuery, startAfter(lastIndex));
        } else if (!isFirstPage && pageAction === "PREV") {
            userBanksQuery = query(baseQuery, startAfter(firstIndex));
        }

        const userBanksQuerySnapshot = await getDocs(userBanksQuery);

        const allBanks = userBanksQuerySnapshot.docs.map((doc) => {
            const data = doc.data() as Bank;

            return {
                id: doc.id,
                bankName: data.bankName,
                bankAccountNumber: data.bankAccountNumber,
                bankBranchName: data.bankBranchName,
                bankIfscCode: data.bankIfscCode,
                bankAddress: data.bankAddress,
                bankCity: data.bankCity,
                bankPostCode: data.bankPostCode,
                bankCountry: data.bankCountry,
                bankState: data.bankState,
                uid: data.uid,
                bankCategory: data.bankCategory,
            };
        });

        const hasNextPage = allBanks.length === increasedPageSize;

        const userBanks = hasNextPage ? allBanks.slice(0, -1) : allBanks;

        return {
            userBanks,
            hasNextPage,
            lastIndex:
                userBanks.length > 0
                    ? userBanks[userBanks.length - 1].bankName
                    : null,
            firstIndex: userBanks.length > 0 ? userBanks[0].bankName : null,
        };
    } catch (error) {
        error instanceof FirebaseError
            ? console.error(error.message)
            : console.error(error);
        throw new Error("Unable to fetch banks");
    }
};
