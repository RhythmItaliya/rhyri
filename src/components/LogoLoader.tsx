import { Icons } from "./Icons";
import { cn } from "../lib/utils";

interface LogoLoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const loaderSizes = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

export function LogoLoader({ className, size = "md" }: LogoLoaderProps) {
  return (
    <div
      className={cn("flex-center flex-col gap-2", className)}
      role="status"
      aria-label="Loading"
    >
      <Icons.logo className={loaderSizes[size]} aria-hidden="true" />
      <p className="text-sm text-muted">loading ...</p>
    </div>
  );
}
