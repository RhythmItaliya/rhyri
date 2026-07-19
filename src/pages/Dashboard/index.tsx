import { PageHeader, PageHeaderHeading } from "../../components/PageHeader";
import { Skeleton } from "../../components/Skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { RecentInvoices } from "./RecentInvoices";
import { InvoiceChart } from "./InvoiceChart";
import { Icons } from "../../components/Icons";

import { useAuth } from "../../contexts/AuthContext";
import { catchError, formatCurrency } from "../../lib/utils";

import { fetchUserInvoicesStats } from "./fetchUserInvoicesStats";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "../../contexts/ThemeContext";

interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  value: string | number;
  isLoading: boolean;
}

function StatCard({ title, icon, value, isLoading }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-muted font-medium text-sm">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <h2 className="font-bold text-xl">{value}</h2>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { currentUser, restrictionDate, restrictionType } = useAuth();

  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";

  if (!currentUser) return null;

  const {
    data: invoiceStats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboard", currentUser.uid, restrictionDate, restrictionType],
    queryFn: () =>
      fetchUserInvoicesStats(currentUser.uid, restrictionDate, restrictionType),
  });

  if (error) {
    catchError(error);
  }

  return (
    <>
      <PageHeader>
        <PageHeaderHeading className="px-4 md:px-0">
          Dashboard
        </PageHeaderHeading>
      </PageHeader>

      <div className="grid gap-4 py-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Invoices"
            icon={<Icons.invoices className="h-5 w-5" aria-hidden="true" />}
            value={invoiceStats?.totalInvoiceCount ?? 0}
            isLoading={isLoading}
          />

          <StatCard
            title="Invoice Amount"
            icon={
              isDarkTheme ? (
                <Icons.amountDark className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Icons.amountLight className="h-4 w-4" aria-hidden="true" />
              )
            }
            value={formatCurrency(invoiceStats?.totalInvoicesAmount ?? 0)}
            isLoading={isLoading}
          />

          <StatCard
            title="Average Invoice"
            icon={
              isDarkTheme ? (
                <Icons.amountDark className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Icons.amountLight className="h-4 w-4" aria-hidden="true" />
              )
            }
            value={formatCurrency(invoiceStats?.averageInvoiceAmount ?? 0)}
            isLoading={isLoading}
          />

          <StatCard
            title="Purchase Bills"
            icon={<Icons.table className="h-5 w-5" aria-hidden="true" />}
            value={invoiceStats?.totalPurchaseBillCount ?? 0}
            isLoading={isLoading}
          />

          <StatCard
            title="Purchase Bill Amount"
            icon={
              isDarkTheme ? (
                <Icons.amountDark className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Icons.amountLight className="h-4 w-4" aria-hidden="true" />
              )
            }
            value={formatCurrency(invoiceStats?.totalPurchaseBillsAmount ?? 0)}
            isLoading={isLoading}
          />

          <StatCard
            title="Challans"
            icon={<Icons.table className="h-5 w-5" aria-hidden="true" />}
            value={invoiceStats?.totalChallanCount ?? 0}
            isLoading={isLoading}
          />

          <StatCard
            title="Challan Amount"
            icon={
              isDarkTheme ? (
                <Icons.amountDark className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Icons.amountLight className="h-4 w-4" aria-hidden="true" />
              )
            }
            value={formatCurrency(invoiceStats?.totalChallansAmount ?? 0)}
            isLoading={isLoading}
          />

          <StatCard
            title="Total Billing Amount"
            icon={
              isDarkTheme ? (
                <Icons.amountDark className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Icons.amountLight className="h-4 w-4" aria-hidden="true" />
              )
            }
            value={formatCurrency(invoiceStats?.totalBusinessAmount ?? 0)}
            isLoading={isLoading}
          />
        </div>

        <div className="grid lg:grid-cols-7 gap-4">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              {isLoading ? (
                <Skeleton className="h-[350px] w-full" />
              ) : (
                <InvoiceChart
                  pendingInvoicesCount={invoiceStats?.pendingInvoicesCount || 0}
                  paidInvoicesCount={invoiceStats?.paidInvoicesCount || 0}
                  draftedInvoicesCount={invoiceStats?.draftedInvoicesCount || 0}
                  pendingPurchaseBillsCount={
                    invoiceStats?.pendingPurchaseBillsCount || 0
                  }
                  paidPurchaseBillsCount={
                    invoiceStats?.paidPurchaseBillsCount || 0
                  }
                  draftedPurchaseBillsCount={
                    invoiceStats?.draftedPurchaseBillsCount || 0
                  }
                  pendingChallansCount={invoiceStats?.pendingChallansCount || 0}
                  paidChallansCount={invoiceStats?.paidChallansCount || 0}
                  draftedChallansCount={invoiceStats?.draftedChallansCount || 0}
                />
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentInvoices />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
