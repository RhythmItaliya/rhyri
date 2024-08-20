import * as React from "react";
import { Link } from "react-router-dom";
import { PageHeader, PageHeaderHeading } from "../../components/PageHeader";
import { BanksTable } from "./BanksTable";
import { BanksTablePagination } from "./BanksTablePagination";
import { BanksTableFilter } from "./BanksTableFilter";
import { buttonVariants } from "../../components/ui/Button";
import { BanksTableViewOptions } from "./BanksTableViewOptions";

import { cn } from "../../lib/utils";
import { useAuth } from "../../contexts/AuthContext";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchUserBanks } from "./fetchUserBanks";
import { ColumnDef, PaginationState } from "./schema";
import { BankCategory } from "../../types";

export function BanksPage() {
    const { currentUser } = useAuth();

    if (!currentUser) return null;

    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 5,
        pageAction: null,
        firstIndex: null,
        lastIndex: null,
        categoryFilterValue: undefined,
        startAfterDoc: null
    });

    const [columns, setColumns] = React.useState<ColumnDef[]>([
        {
            id: "bankName",
            header: <div className="w-[150px]">Name</div>,
            isVisible: true,
            canHide: true,
        },
        {
            id: "bankAccountNumber",
            header: <div className="w-[150px]">Account Number</div>,
            isVisible: true,
            canHide: true,
        },
        {
            id: "bankIfscCode",
            header: <div className="w-[150px]">IFSC Number</div>,
            isVisible: true,
            canHide: true,
        },
        {
            id: "row actions",
            header: "",
            canHide: false,
        },
    ]);

    const hasPrevPage = pagination.pageIndex !== 0;

    const { data, isPending } = useQuery({
        queryKey: ["banks", currentUser.uid, pagination],
        queryFn: () => fetchUserBanks(currentUser.uid, pagination),
        placeholderData: keepPreviousData,
    });

    const handleGetPrevPage = () => {
        setPagination((prevState) => ({
            ...prevState,
            pageIndex: prevState.pageIndex - 1,
            pageAction: "PREV",
            firstIndex: data?.firstIndex || null,
        }));
    };

    const handleGetNextPage = () => {
        setPagination((prevState) => ({
            ...prevState,
            pageIndex: prevState.pageIndex + 1,
            pageAction: "NEXT",
            lastIndex: data?.lastIndex || null,
        }));
    };

    const handleCategoryFiltering = (category: BankCategory) => {
        setPagination((prevState) => ({
            ...prevState,
            categoryFilterValue:
                prevState.categoryFilterValue === category ? undefined : category,
        }));
    };

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
        );
    };

    return (
        <div className="space-y-8">
            <div className="flex-between">
                <PageHeader>
                    <PageHeaderHeading>Banks</PageHeaderHeading>
                </PageHeader>

                <Link
                    to="/bank/new"
                    className={cn(buttonVariants({ variant: "accent", sizes: "sm" }))}
                >
                    New Bank
                </Link>
            </div>

            <div className="space-y-6">
                <div className="flex-between">
                    <BanksTableFilter
                        categoryFilterValue={pagination.categoryFilterValue || ""}
                        handleCategoryFiltering={handleCategoryFiltering}
                    />
                    <BanksTableViewOptions
                        columns={columns}
                        toggleColumnVisibility={toggleColumnVisibility}
                    />
                </div>

                <BanksTable
                    isPending={isPending}
                    banks={data?.userBanks}
                    columns={columns}
                />

                <BanksTablePagination
                    handleGetPrevPage={handleGetPrevPage}
                    handleGetNextPage={handleGetNextPage}
                    hasPrevPage={hasPrevPage}
                    hasNextPage={data?.hasNextPage || false}
                />
            </div>
        </div>
    );
}
