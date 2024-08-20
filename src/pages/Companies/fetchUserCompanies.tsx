import { collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { FirebaseError } from "firebase/app";
import { Company } from "../../types";
import { PaginationState } from "./schema";

export const fetchUserCompanies = async (
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

        const companiesRef = collection(db, "companies");

        const increasedPageSize = pageSize + 1;

        let baseQuery = query(
            companiesRef,
            where("uid", "==", uid),
            orderBy("companyName", "asc"),
            limit(increasedPageSize)
        );

        if (categoryFilterValue) {
            baseQuery = query(
                baseQuery,
                where("companyCategory", "==", categoryFilterValue)
            );
        }

        let userCompaniesQuery = query(baseQuery);

        if (pageAction === "NEXT") {
            userCompaniesQuery = query(baseQuery, startAfter(lastIndex));
        } else if (!isFirstPage && pageAction === "PREV") {
            userCompaniesQuery = query(baseQuery, startAfter(firstIndex));
        }

        const userCompaniesQuerySnapshot = await getDocs(userCompaniesQuery);

        const allCompanies = userCompaniesQuerySnapshot.docs.map((doc) => {
            const data = doc.data() as Company;

            return {
                id: doc.id,
                companyName: data.companyName,
                companyEmail: data.companyEmail,
                companyTelephone: data.companyTelephone,
                companyCategory: data.companyCategory,
                uid: data.uid,
            };
        });

        const hasNextPage = allCompanies.length === increasedPageSize;

        const userCompanies = hasNextPage ? allCompanies.slice(0, -1) : allCompanies;

        return {
            userCompanies,
            hasNextPage,
            lastIndex:
                userCompanies.length > 0
                    ? userCompanies[userCompanies.length - 1].companyName
                    : null,
            firstIndex: userCompanies.length > 0 ? userCompanies[0].companyName : null,
        };
    } catch (error) {
        error instanceof FirebaseError
            ? console.error(error.message)
            : console.error(error);
        throw new Error("Unable to fetch companies");
    }
};
