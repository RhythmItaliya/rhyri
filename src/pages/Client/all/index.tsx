import * as React from "react"
import { Link, useParams } from "react-router-dom"

import { PageHeader, PageHeaderHeading } from "../../../components/PageHeader"
import { InvoicesTable } from "../../Invoices/InvoicesTable"
import { InvoicesTablePagination } from "../../Invoices/InvoicesTablePagination"
import { InvoicesTableFilter } from "../../Invoices/InvoicesTableFilter"
import { buttonVariants } from "../../../components/ui/Button"
import { InvoicesTableViewOptions } from "../../Invoices/InvoicesTableViewOptions"

import { cn } from "../../../lib/utils"

import { useAuth } from "../../../contexts/AuthContext"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { fetchAllClientInvoices } from "./fetchAllClientInvoices"

import { InvoiceStatus } from "../../../types"
import { ColumnDef, PaginationState } from "../../Invoices/schema"
import { useDownloadInvoice } from "../../../lib/invoiceUtils"
import ProgressPopup from "../../../components/popup/ProgressPopup"

export function ClientAllInvoice() {
    const { currentUser } = useAuth()
    const { id } = useParams<{ id: string }>();
    const { downloadInvoice, progress } = useDownloadInvoice();

    if (!currentUser || !id) return null;

    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 15,
        pageAction: null,
        firstIndex: null,
        lastIndex: null,
    })

    const [columns, setColumns] = React.useState<ColumnDef[]>([
        {
            id: "invoice",
            header: <div className="w-[100px]">Invoice</div>,
            isVisible: true,
            canHide: true,
        },
        {
            id: "date",
            header: <div className="w-[120px]">Date</div>,
            isVisible: true,
            canHide: true,
        },
        {
            id: "client",
            header: <div className="w-[130px]">Client</div>,
            isVisible: true,
            canHide: true,
        },
        {
            id: "status",
            header: "Status",
            isVisible: true,
            canHide: true,
        },
        {
            id: "amount",
            header: "Amount",
            isVisible: true,
            canHide: true,
        },
        {
            id: "row actions",
            header: "",
            canHide: false,
        },
    ])

    const hasPrevPage = pagination.pageIndex !== 0

    const { data, isPending } = useQuery({
        queryKey: ["invoices", id, pagination],
        queryFn: () => fetchAllClientInvoices(id, pagination),
        placeholderData: keepPreviousData,
    })

    const handleGetPrevPage = () => {
        setPagination((prevState) => ({
            ...prevState,
            pageIndex: prevState.pageIndex - 1,
            pageAction: "PREV",
            firstIndex: data?.firstIndex || null,
        }))
    }

    const handleGetNextPage = () => {
        setPagination((prevState) => ({
            ...prevState,
            pageIndex: prevState.pageIndex + 1,
            pageAction: "NEXT",
            lastIndex: data?.lastIndex || null,
        }))
    }

    const handleStatusFiltering = (status: InvoiceStatus) => {
        setPagination((prevState) => ({
            ...prevState,
            statusFilterValue:
                prevState.statusFilterValue === status ? undefined : status,
        }))
    }

    const toggleColumnVisibility = (columnId: string) => {
        setColumns((prevState) =>
            prevState.map((column) =>
                column.id === columnId && column.canHide
                    ? {
                        ...column,
                        isVisible: !column.isVisible,
                    }
                    : { ...column }
            )
        )
    }

    const handleDownload = (invoiceId: string, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        downloadInvoice(invoiceId, currentUser.uid);
    };

    return (
        <>
            <div className="space-y-8">
                <div className="flex-between">
                    <PageHeader>
                        <PageHeaderHeading>Invoices</PageHeaderHeading>
                    </PageHeader>

                    <Link
                        to="/invoice/new"
                        className={cn(buttonVariants({ variant: "accent", sizes: "sm" }))}
                    >
                        New invoice
                    </Link>
                </div>

                <div className="space-y-6">
                    <div className="flex-between">
                        <InvoicesTableFilter
                            statusFilterValue={pagination.statusFilterValue || ""}
                            handleStatusFiltering={handleStatusFiltering}
                        />
                        <InvoicesTableViewOptions
                            columns={columns}
                            toggleColumnVisibility={toggleColumnVisibility}
                        />
                    </div>

                    <InvoicesTable
                        isPending={isPending}
                        invoices={data?.clientInvoices}
                        columns={columns}
                        onDownload={handleDownload}
                    />

                    <InvoicesTablePagination
                        handleGetPrevPage={handleGetPrevPage}
                        handleGetNextPage={handleGetNextPage}
                        hasPrevPage={!data?.clientInvoices || !hasPrevPage}
                        hasNextPage={!data?.clientInvoices || !data?.hasNextPage}
                    />
                </div>
            </div>
            <ProgressPopup progress={progress} />
        </>
    )
}
