import { useQuery } from "@tanstack/react-query";
import { fetchRecentInvoices } from "./fetchRecentInvoices";

import { Link } from "react-router-dom";
import { Skeleton } from "../../components/Skeleton";

import { useAuth } from "../../contexts/AuthContext";
import { cn, formatCurrency, formatFirestoreTimestamp } from "../../lib/utils";

import { Timestamp } from "firebase/firestore";
import { startOfDay } from "date-fns";

export function RecentInvoices() {
  const { currentUser, restrictionDate } = useAuth();

  const isDateRestricted = (date: any, restrictionDate: Date | null) => {
    if (!restrictionDate) return false;
    const d = date instanceof Timestamp ? date.toDate() : new Date(date);
    return startOfDay(d) <= startOfDay(restrictionDate);
  };

  if (!currentUser) return null;

  const {
    data: invoices,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["recent-invoices", currentUser.uid],
    queryFn: () => fetchRecentInvoices(currentUser.uid),
  });

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <p className="flex-center text-destructive font-medium">
          Oops! Something went wrong
        </p>
      ) : invoices?.length === 0 ? (
        <p className="flex-center text-muted font-medium">No recent invoices</p>
      ) : (
        <div className="grid gap-4">
          {invoices?.map((invoice) => {
            const restricted = isDateRestricted(
              invoice.invoiceDate,
              restrictionDate,
            );
            return (
              <Link
                to={`/invoice/${invoice.id}`}
                key={invoice.id}
                className={cn(
                  "flex-between",
                  restricted && "opacity-50 grayscale pointer-events-none",
                )}
              >
                <div className="grid gap-1">
                  <p className="font-medium">{invoice.id}</p>
                  <p className="text-muted">
                    {formatFirestoreTimestamp(invoice.invoiceDate)}
                  </p>
                </div>
                <p className="font-medium text-lg">
                  {formatCurrency(invoice.amount)}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

const Loading = () => {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="flex-between">
          <div className="grid gap-1">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-28" />
          </div>
          <Skeleton className="h-7 w-28" />
        </div>
      ))}
    </div>
  );
};
