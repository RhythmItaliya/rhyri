import * as React from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { PageHeader, PageHeaderHeading } from "../../components/PageHeader";
import { buttonVariants } from "../../components/ui/Button";
import { useAuth } from "../../contexts/AuthContext";
import { useDownloadPurchaseBill } from "../../lib/invoiceUtils";
import { cn } from "../../lib/utils";
import { InvoicesTablePagination } from "../Invoices/InvoicesTablePagination";
import { fetchUserPurchaseBills } from "./fetchUserPurchaseBills";
import { PurchaseBillsTable } from "./PurchaseBillsTable";
import { ColumnDef, PaginationState } from "./schema";

export function PurchaseBillsPage() {
  const { currentUser } = useAuth();
  const { downloadPurchaseBill, downloadingId } = useDownloadPurchaseBill();

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
      id: "purchaseBill",
      header: "Purchase Bill id",
      isVisible: true,
      canHide: true,
    },
    {
      id: "purchaseBillNumber",
      header: "Bill No",
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
      id: "supplier",
      header: "Supplier",
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
    queryKey: ["purchaseBills", currentUser.uid, pagination],
    queryFn: () => fetchUserPurchaseBills(currentUser.uid, pagination),
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

  const handleDownload = (purchaseBillId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    downloadPurchaseBill(purchaseBillId, currentUser.uid);
  };

  return (
    <div className="space-y-8">
      <div className="flex-between px-4 md:px-0">
        <PageHeader>
          <PageHeaderHeading>Purchase Bills</PageHeaderHeading>
        </PageHeader>

        <Link
          to="/purchase-bill/new"
          className={cn(buttonVariants({ variant: "accent", sizes: "sm" }))}
        >
          New purchase bill
        </Link>
      </div>

      <div className="space-y-6">
        <PurchaseBillsTable
          isPending={isPending}
          purchaseBills={data?.userPurchaseBills}
          columns={columns}
          onDownload={handleDownload}
          downloadingId={downloadingId}
        />

        <InvoicesTablePagination
          handleGetPrevPage={handleGetPrevPage}
          handleGetNextPage={handleGetNextPage}
          hasPrevPage={!data?.userPurchaseBills || !hasPrevPage}
          hasNextPage={!data?.userPurchaseBills || !data?.hasNextPage}
        />
      </div>
    </div>
  );
}
