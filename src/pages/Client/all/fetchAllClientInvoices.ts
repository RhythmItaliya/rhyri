import {
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
    where,
} from "firebase/firestore"
import { db } from "../../../lib/firebase"
import { FirebaseError } from "firebase/app"

import { Invoice } from "../../../types"
import { PaginationState } from "../../Invoices/schema"

export const fetchAllClientInvoices = async (
    clientUid: string,
    pagination: PaginationState
) => {

    try {
        const {
            pageSize,
            lastIndex,
            firstIndex,
            pageIndex,
            pageAction,
            statusFilterValue,
        } = pagination
        const isFirstPage = pageIndex === 0

        const invoicesRef = collection(db, "invoices")

        const increasedPageSize = pageSize + 1

        let baseQuery = query(
            invoicesRef,
            where("clientUid", "==", clientUid),
            orderBy("invoiceDate", "desc"),
            limit(increasedPageSize)
        )

        if (statusFilterValue) {
            baseQuery = query(
                baseQuery,
                where("invoiceStatus", "==", statusFilterValue)
            )
        }

        let clientInvoicesQuery = query(baseQuery)

        if (pageAction === "NEXT") {
            clientInvoicesQuery = query(baseQuery, startAfter(lastIndex))
        } else if (!isFirstPage && pageAction === "PREV") {
            clientInvoicesQuery = query(baseQuery, startAfter(firstIndex))
        }

        const clientInvoicesQuerySnapshot = await getDocs(clientInvoicesQuery)
        const allInvoices = clientInvoicesQuerySnapshot.docs.map((doc) => {
            const data = doc.data() as Invoice

            return {
                id: doc.id,
                date: data.invoiceDate,
                client: data.clientName,
                status: data.invoiceStatus,
                amount: data.amount,
            }
        })

        const hasNextPage = allInvoices.length === increasedPageSize

        const clientInvoices = hasNextPage ? allInvoices.slice(0, -1) : allInvoices

        return {
            clientInvoices,
            hasNextPage,
            lastIndex:
                clientInvoices.length > 0
                    ? clientInvoices[clientInvoices.length - 1].date
                    : null,
            firstIndex: clientInvoices.length > 0 ? clientInvoices[0].date : null,
        }
    } catch (error) {
        error instanceof FirebaseError
            ? console.error(error.message)
            : console.error(error)
        throw new Error("Unable to fetch invoices")
    }
}
