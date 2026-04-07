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
              Generate high quality, professional invoices tailored for your
              business in seconds.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-8">
            <Icons.dashboard
              className="h-10 w-10 text-foreground"
              aria-hidden="true"
            />
            <h3 className="text-lg font-semibold">Financial Insights</h3>
            <p className="text-muted">
              Monitor your business growth and billing performance with a
              powerful, streamlined dashboard.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-8">
            <Icons.interface
              className="h-10 w-10 text-foreground"
              aria-hidden="true"
            />
            <h3 className="text-lg font-semibold">Sleek User Interface</h3>
            <p className="text-muted">
              Focus on what matters—your billing—with a distraction-free,
              professional workspace.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-8">
            <Icons.table
              className="h-10 w-10 text-foreground"
              aria-hidden="true"
            />
            <h3 className="text-lg font-semibold">
              Enterprise-Ready Management
            </h3>
            <p className="text-muted">
              Efficiently handle your entire invoice history with
              industrial-grade filtering and data scaling.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
