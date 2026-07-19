import { Toaster } from "sonner";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface ProvidersProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

function AppToaster() {
  const { theme } = useTheme();

  return (
    <Toaster
      position="top-center"
      richColors
      closeButton
      expand
      duration={3000}
      visibleToasts={4}
      theme={theme}
      toastOptions={{
        className: "font-inter",
      }}
    />
  );
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AppToaster />
          {children}
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
