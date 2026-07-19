import * as React from "react";
import { Outlet } from "react-router-dom";

import { MainNav } from "./MainNav";

import { ProtectedRoute } from "./ProtectedRoute";
import { LogoLoader } from "./LogoLoader";

export function RootLayout() {
  return (
    <ProtectedRoute>
      <div className="space-y-4 sm:space-y-8">
        <MainNav />
        <main className="sm:px-8 lg:px-16 xl:px-24">
          <React.Suspense
            fallback={
              <div className="flex-center py-12">
                <LogoLoader />
              </div>
            }
          >
            <Outlet />
          </React.Suspense>
        </main>
      </div>
    </ProtectedRoute>
  );
}
