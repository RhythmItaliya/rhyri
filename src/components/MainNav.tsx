import * as React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { ThemeToggler } from "./ThemeToggler";
import { Icons } from "./Icons";
import { cn } from "../lib/utils";
import { Skeleton } from "./Skeleton";
import { useTheme } from "../contexts/ThemeContext";

const UserMenu = React.lazy(() =>
  import("./UserMenu").then((module) => ({ default: module.UserMenu }))
);

const mainNavItems = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Invoices", href: "/invoices" },
  { title: "Clients", href: "/clients" },
  { title: "Companies", href: "/companies" },
  { title: "Banks", href: "/banks" },
];

export function MainNav() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavLinkClick = (href: string) => {
    navigate(href);
    setIsMenuOpen(false);
  };

  return (
    <header className="site-header">
      <nav className="max-width flex-between">
        <div className="flex items-center gap-4">
          <Icons.logo className="w-8 h-8 cursor-pointer" aria-hidden="true" onClick={handleLogoClick} />

          <div
            className="sm:hidden text-gray-600 focus:outline-none cursor-pointer transition-transform duration-300"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              isDarkTheme ? <Icons.closeDark className="w-6 h-6" aria-hidden="true" /> : <Icons.closeLight className="w-6 h-6" aria-hidden="true" />
            ) : (
              isDarkTheme ? <Icons.burgerDark className="w-6 h-6" aria-hidden="true" /> : <Icons.burgerLight className="w-6 h-6" aria-hidden="true" />
            )}
          </div>

          <div className="hidden sm:flex sm:items-center sm:gap-4">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "font-medium text-muted text-sm sm:text-base hover:text-foreground",
                    {
                      "text-foreground": isActive,
                    }
                  )
                }
              >
                {item.title}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggler />
          <React.Suspense
            fallback={<Skeleton className="h-8 w-8 rounded-full" />}
          >
            <UserMenu />
          </React.Suspense>
        </div>
      </nav>

      <div className={`sm:hidden flex flex-col items-start w-full mt-4 duration-300 ease-in-out ${isMenuOpen ? 'block translate-y-0 opacity-100' : 'hidden translate-y-4 opacity-0'}`}>
        {mainNavItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.href}
            onClick={() => handleNavLinkClick(item.href)}
            className={({ isActive }) =>
              cn(
                "font-medium text-muted text-sm sm:text-base hover:text-foreground py-2 px-4",
                {
                  "text-foreground": isActive,
                }
              )
            }
          >
            {item.title}
          </NavLink>
        ))}
      </div>
    </header>
  );
}
