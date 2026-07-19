import { AuthNav } from "./AuthNav";
import { buttonVariants } from "../../components/ui/Button";
import { Link } from "react-router-dom";
import { WhyRhyri } from "./WhyRhyri";
import { useTheme } from "../../contexts/ThemeContext";

export function HomePage() {
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";

  return (
    <>
      <AuthNav />
      <main className="max-width y-paddings space-y-10">
        <section className="hero">
          <h1 className="hero-heading">
            Simple Billing for Invoices, Challans, and Purchase Bills
          </h1>
          <p className="hero-subtitle">
            Rhyri helps you create professional invoices, delivery challans,
            purchase bills, client records, company details, bank details, and
            PDF documents from one clean workspace.
          </p>
        </section>

        <div className="flex items-center justify-center gap-4">
          <Link to="/sign-in" className={buttonVariants({ variant: "accent" })}>
            Start billing
          </Link>
        </div>

        <img
          src={isDarkTheme ? "dashDark.png" : "dashLight.png"}
          alt="Rhyri invoice, challan, and purchase bill dashboard"
        />

        <WhyRhyri />

        <footer>
          <p className="text-center">
            Made by{" "}
            <Link
              to="https://rhythmitaliya.com/"
              target="_blank"
              className="underline"
            >
              Rhythm Italiya
            </Link>
          </p>
        </footer>
      </main>
    </>
  );
}
