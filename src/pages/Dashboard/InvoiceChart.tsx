import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar } from "recharts";

interface InvoiceChartProps {
  paidInvoicesCount: number;
  pendingInvoicesCount: number;
  draftedInvoicesCount: number;
  paidPurchaseBillsCount: number;
  pendingPurchaseBillsCount: number;
  draftedPurchaseBillsCount: number;
  paidChallansCount: number;
  pendingChallansCount: number;
  draftedChallansCount: number;
}

export function InvoiceChart({
  pendingInvoicesCount,
  draftedInvoicesCount,
  paidInvoicesCount,
  pendingPurchaseBillsCount,
  draftedPurchaseBillsCount,
  paidPurchaseBillsCount,
  pendingChallansCount,
  draftedChallansCount,
  paidChallansCount,
}: InvoiceChartProps) {
  const data = [
    { label: "Invoice Pending", value: pendingInvoicesCount },
    { label: "Invoice Paid", value: paidInvoicesCount },
    { label: "Invoice Draft", value: draftedInvoicesCount },
    { label: "Bill Pending", value: pendingPurchaseBillsCount },
    { label: "Bill Paid", value: paidPurchaseBillsCount },
    { label: "Bill Draft", value: draftedPurchaseBillsCount },
    { label: "Challan Pending", value: pendingChallansCount },
    { label: "Challan Done", value: paidChallansCount },
    { label: "Challan Draft", value: draftedChallansCount },
  ];

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="label"
          stroke="hsl(var(--muted))"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          interval={0}
          angle={-18}
          textAnchor="end"
          height={70}
        />
        <YAxis
          stroke="hsl(var(--muted))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Bar dataKey="value" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
