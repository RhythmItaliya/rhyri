import { Icons } from "../../components/Icons";
import { Card, CardContent } from "../../components/ui/Card";

export function WhyRhyri() {
  return (
    <section className="flex-center flex-col gap-8">
      <h2 className="text-center text-2xl sm:text-3xl font-semibold">
        Why Rhyri?
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 max-w-4xl">
        <Card>
          <CardContent className="space-y-2 p-8">
            <Icons.invoices
              className="h-10 w-10 text-foreground"
              aria-hidden="true"
            />
            <h3 className="text-lg font-semibold">Professional Grade Design</h3>
            <p className="text-muted">
              Generate clean invoice, challan, and purchase bill PDFs with
              business details, GST values, totals, and ready-to-share
              formatting.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-8">
            <Icons.dashboard
              className="h-10 w-10 text-foreground"
              aria-hidden="true"
            />
            <h3 className="text-lg font-semibold">Purchase Bill Support</h3>
            <p className="text-muted">
              Create purchase bills with supplier details, HSN/SAC rows, GST
              summary, bank details, and PDF download.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-8">
            <Icons.interface
              className="h-10 w-10 text-foreground"
              aria-hidden="true"
            />
            <h3 className="text-lg font-semibold">Saved Business Records</h3>
            <p className="text-muted">
              Keep clients, companies, and bank details organized so new bills
              can be prepared faster.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-8">
            <Icons.table
              className="h-10 w-10 text-foreground"
              aria-hidden="true"
            />
            <h3 className="text-lg font-semibold">Billing Dashboard</h3>
            <p className="text-muted">
              Track recent invoices, totals, billing status, and business
              activity from a focused dashboard.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 max-w-4xl sm:grid-cols-3">
        <Card>
          <CardContent className="space-y-2 p-6">
            <h3 className="text-base font-semibold">What is Rhyri?</h3>
            <p className="text-sm text-muted">
              Rhyri is a professional business billing app by Rhythm Italiya for
              invoices, delivery challans, purchase bills, and PDF billing
              documents.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-6">
            <h3 className="text-base font-semibold">What can it generate?</h3>
            <p className="text-sm text-muted">
              Rhyri creates professional invoices, delivery challans, purchase
              bills, GST summaries, and downloadable PDF records.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-6">
            <h3 className="text-base font-semibold">Who is it for?</h3>
            <p className="text-sm text-muted">
              It is made for small businesses, traders, service providers, and
              teams that need organized billing records.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
