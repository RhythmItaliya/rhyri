import { AuthNav } from "./AuthNav";
// import { Icons } from "../../components/Icons"
import { buttonVariants } from "../../components/ui/Button";
import { Link } from "react-router-dom";
// import { cn } from "../../lib/utils"
import { UnderTheHood } from "./UnderTheHood";
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
            A powerful tool for managing and creating invoices efficiently
          </h1>
          <p className="hero-subtitle">
            Simplify your invoicing and billing with Your Invoice App. Manage
            your finances with ease.
          </p>
        </section>

        <div className="flex items-center justify-center gap-4">
          <Link to="/sign-in" className={buttonVariants({ variant: "accent" })}>
            Get started
          </Link>
          {/* <Link
              to="https://github.com/RhythmItaliya"
              target="_blank"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <Icons.github className="h-4 w-4 mr-2" aria-hidden="true" />
              Github
            </Link> */}
        </div>

        <img
          src={isDarkTheme ? "dashDark.png" : "dashLight.png"}
          alt="Rhyri dashboard page"
        />

        <WhyRhyri />

        <UnderTheHood />

        <footer>
          <p className="text-center">
            Built by{" "}
            <Link to="https://github.com/RhythmItaliya" className="underline">
              Rhythm Italiya
            </Link>
          </p>
        </footer>
      </main>
    </>
  );
}
