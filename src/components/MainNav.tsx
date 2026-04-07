import * as React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { ThemeToggler } from "./ThemeToggler";
import { Icons } from "./Icons";
import { cn } from "../lib/utils";
import { Skeleton } from "./Skeleton";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

const UserMenu = React.lazy(() =>
  import("./UserMenu").then((module) => ({ default: module.UserMenu })),
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
  const { isAdmin } = useAuth();

  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavLinkClick = (href: string) => {
    navigate(href);
    setIsMenuOpen(false);
  };

  return (
    <header className="site-header relative">
      <nav className="max-width flex-between">
        <div className="flex items-center gap-4">
          <Icons.logo
            className="w-8 h-8 cursor-pointer"
            aria-hidden="true"
            onClick={handleLogoClick}
          />

          <div
            className="sm:hidden text-gray-600 focus:outline-none cursor-pointer transition-transform duration-300"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              isDarkTheme ? (
                <Icons.closeDark className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Icons.closeLight className="w-6 h-6" aria-hidden="true" />
              )
            ) : isDarkTheme ? (
              <Icons.burgerDark className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Icons.burgerLight className="w-6 h-6" aria-hidden="true" />
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
                    },
                  )
                }
              >
                {item.title}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  cn(
                    "font-medium text-muted text-sm sm:text-base hover:text-foreground",
                    {
                      "text-foreground": isActive,
                    },
                  )
                }
              >
                Admin
              </NavLink>
            )}
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

      <div
        className={`fixed top-0 left-0 w-64 h-full white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } sm:hidden z-50`}
        style={{
          backgroundColor:
            theme === "dark" ? "hsl(var(--card))" : "hsl(var(--background))",
          color:
            theme === "dark"
              ? "hsl(var(--card-foreground))"
              : "hsl(var(--foreground))",
        }}
      >
        <div className="flex flex-col p-4">
          <Icons.logo
            className="w-8 h-8 cursor-pointer absolute top-5 left-5"
            aria-hidden="true"
            onClick={handleLogoClick}
          />

          <button
            className="absolute top-5 right-5 p-2 text-gray-600"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            {isDarkTheme ? (
              <Icons.closeDark className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Icons.closeLight className="w-6 h-6" aria-hidden="true" />
            )}
          </button>

          <div className="mt-12"></div>

          {mainNavItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.href}
              onClick={() => handleNavLinkClick(item.href)}
              className={({ isActive }) =>
                cn(
                  "font-medium text-muted text-sm sm:text-base hover:text-foreground py-2 px-2",
                  {
                    "text-foreground": isActive,
                  },
                )
              }
            >
              {item.title}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={() => handleNavLinkClick("/admin")}
              className={({ isActive }) =>
                cn(
                  "font-medium text-muted text-sm sm:text-base hover:text-foreground py-2 px-2",
                  {
                    "text-foreground": isActive,
                  },
                )
              }
            >
              Admin
            </NavLink>
          )}
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } sm:hidden z-40`}
        onClick={() => setIsMenuOpen(false)}
      />
    </header>
  );
}
