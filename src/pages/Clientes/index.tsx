import * as React from "react";
import { Link } from "react-router-dom";
import { PageHeader, PageHeaderHeading } from "../../components/PageHeader";
import { ClientsTable } from "./ClientsTable";
import { ClientsTablePagination } from "./ClientsTablePagination";
import { ClientsTableFilter } from "./ClientsTableFilter";
import { buttonVariants } from "../../components/ui/Button";
import { ClientsTableViewOptions } from "./ClientsTableViewOptions";

import { cn } from "../../lib/utils";
import { useAuth } from "../../contexts/AuthContext";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchUserClients } from "./fetchUserClients";
import { ColumnDef, PaginationState } from "./schema";
import { ClientCategory } from "../../types";

export function ClientsPage() {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
    pageAction: null,
    firstIndex: null,
    lastIndex: null,
    categoryFilterValue: undefined,
    startAfterDoc: null,
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
      id: "category",
      header: <div className="w-[150px]">Category</div>,
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
    queryKey: ["clients", currentUser.uid, pagination],
    queryFn: () => fetchUserClients(currentUser.uid, pagination),
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

  const handleCategoryFiltering = (category: ClientCategory) => {
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
          : { ...column },
      ),
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex-between px-4 md:px-0">
        <PageHeader>
          <PageHeaderHeading>Clients</PageHeaderHeading>
        </PageHeader>

        <Link
          to="/client/new"
          className={cn(buttonVariants({ variant: "accent", sizes: "sm" }))}
        >
          New Client
        </Link>
      </div>

      <div className="space-y-6">
        <div className="flex-between px-4 md:px-0">
          <ClientsTableFilter
            categoryFilterValue={pagination.categoryFilterValue || ""}
            handleCategoryFiltering={handleCategoryFiltering}
          />
          <ClientsTableViewOptions
            columns={columns}
            toggleColumnVisibility={toggleColumnVisibility}
          />
        </div>

        <ClientsTable
          isPending={isPending}
          clients={data?.userClients}
          columns={columns}
        />

        <ClientsTablePagination
          handleGetPrevPage={handleGetPrevPage}
          handleGetNextPage={handleGetNextPage}
          hasPrevPage={hasPrevPage}
          hasNextPage={data?.hasNextPage || false}
        />
      </div>
    </div>
  );
}
