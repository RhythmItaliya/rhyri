import * as React from "react";
import { Link } from "react-router-dom";
import { PageHeader, PageHeaderHeading } from "../../components/PageHeader";
import { CompaniesTable } from "./CompaniesTable";
import { CompaniesTablePagination } from "./CompaniesTablePagination";
import { CompaniesTableFilter } from "./CompaniesTableFilter";
import { buttonVariants } from "../../components/ui/Button";
import { CompaniesTableViewOptions } from "./CompaniesTableViewOptions";

import { cn } from "../../lib/utils";
import { useAuth } from "../../contexts/AuthContext";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchUserCompanies } from "./fetchUserCompanies";
import { ColumnDef, PaginationState } from "./schema";
import { CompanyCategory } from "../../types";

export function CompaniesPage() {
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
      id: "name",
      header: <div className="w-[150px]">Name</div>,
      isVisible: true,
      canHide: true,
    },
    {
      id: "email",
      header: <div className="w-[200px]">Email</div>,
      isVisible: true,
      canHide: true,
    },
    {
      id: "telephone",
      header: <div className="w-[150px]">Phone</div>,
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
    queryKey: ["companies", currentUser.uid, pagination],
    queryFn: () => fetchUserCompanies(currentUser.uid, pagination),
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

  const handleCategoryFiltering = (category: CompanyCategory) => {
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
          <PageHeaderHeading>Companies</PageHeaderHeading>
        </PageHeader>

        <Link
          to="/company/new"
          className={cn(buttonVariants({ variant: "accent", sizes: "sm" }))}
        >
          New Company
        </Link>
      </div>

      <div className="space-y-6">
        <div className="flex-between">
          <CompaniesTableFilter
            categoryFilterValue={pagination.categoryFilterValue || ""}
            handleCategoryFiltering={handleCategoryFiltering}
          />
          <CompaniesTableViewOptions
            columns={columns}
            toggleColumnVisibility={toggleColumnVisibility}
          />
        </div>

        <CompaniesTable
          isPending={isPending}
          companies={data?.userCompanies}
          columns={columns}
        />

        <CompaniesTablePagination
          handleGetPrevPage={handleGetPrevPage}
          handleGetNextPage={handleGetNextPage}
          hasPrevPage={hasPrevPage}
          hasNextPage={data?.hasNextPage || false}
        />
      </div>
    </div>
  );
}
