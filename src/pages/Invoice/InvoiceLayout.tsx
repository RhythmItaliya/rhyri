import * as React from "react";
import { Outlet } from "react-router-dom";

import { GoBack } from "../../components/GoBack";

import { ProtectedRoute } from "../../components/ProtectedRoute";
import { LogoLoader } from "../../components/LogoLoader";

export function InvoiceLayout() {
  return (
    <ProtectedRoute>
      <div className="max-width py-4">
        <GoBack />
        <main className="w-full py-4">
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
