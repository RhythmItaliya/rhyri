import * as React from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { PageHeader, PageHeaderHeading } from "../../components/PageHeader";
import { buttonVariants } from "../../components/ui/Button";
import { useAuth } from "../../contexts/AuthContext";
import { useDownloadChallan } from "../../lib/invoiceUtils";
import { cn } from "../../lib/utils";
import { InvoicesTablePagination } from "../Invoices/InvoicesTablePagination";
import { ChallansTable } from "./ChallansTable";
import { fetchUserChallans } from "./fetchUserChallans";
import { ColumnDef, PaginationState } from "./schema";

export function ChallansPage() {
  const { currentUser } = useAuth();
  const { downloadChallan, downloadingId } = useDownloadChallan();

  if (!currentUser) return null;

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
    pageAction: null,
    firstIndex: null,
    lastIndex: null,
  });

  const [columns] = React.useState<ColumnDef[]>([
    {
      id: "srNo",
      header: "Sr. No.",
      isVisible: true,
      canHide: true,
    },
    {
      id: "challan",
      header: "Challan id",
      isVisible: true,
      canHide: true,
    },
    {
      id: "challanNumber",
      header: "Challan No",
      isVisible: true,
      canHide: true,
    },
    {
      id: "date",
      header: "Date",
      isVisible: true,
      canHide: true,
    },
    {
      id: "client",
      header: "Client",
      isVisible: true,
      canHide: true,
    },
    {
      id: "pieces",
      header: "Pieces",
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
  ]);

  const hasPrevPage = pagination.pageIndex !== 0;

  const { data, isPending } = useQuery({
    queryKey: ["challans", currentUser.uid, pagination],
    queryFn: () => fetchUserChallans(currentUser.uid, pagination),
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

  const handleDownload = (challanId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    downloadChallan(challanId, currentUser.uid);
  };

  return (
    <div className="space-y-8">
      <div className="flex-between px-4 md:px-0">
        <PageHeader>
          <PageHeaderHeading>Challans</PageHeaderHeading>
        </PageHeader>

        <Link
          to="/challan/new"
          className={cn(buttonVariants({ variant: "accent", sizes: "sm" }))}
        >
          New challan
        </Link>
      </div>

      <div className="space-y-6">
        <ChallansTable
          isPending={isPending}
          challans={data?.userChallans}
          columns={columns}
          onDownload={handleDownload}
          downloadingId={downloadingId}
        />

        <InvoicesTablePagination
          handleGetPrevPage={handleGetPrevPage}
          handleGetNextPage={handleGetNextPage}
          hasPrevPage={!data?.userChallans || !hasPrevPage}
          hasNextPage={!data?.userChallans || !data?.hasNextPage}
        />
      </div>
    </div>
  );
}
