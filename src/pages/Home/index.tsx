import { AuthNav } from "./AuthNav";
// import { Icons } from "../../components/Icons"
import { buttonVariants } from "../../components/ui/Button";
import { Link } from "react-router-dom";
// import { cn } from "../../lib/utils"
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
            Create Professional Invoices Effortlessly
          </h1>
          <p className="hero-subtitle">
            Generate high-quality, professional grade invoices for your business
            in seconds. The most efficient way to handle your billing with
            Rhyri.
          </p>
        </section>

        <div className="flex items-center justify-center gap-4">
          <Link to="/sign-in" className={buttonVariants({ variant: "accent" })}>
            Get started
          </Link>
        </div>

        <img
          src={isDarkTheme ? "dashDark.png" : "dashLight.png"}
          alt="Rhyri dashboard page"
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
