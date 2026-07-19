import { FirebaseError } from "firebase/app";
import { toast } from "sonner";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { Timestamp } from "firebase/firestore";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ToastVariant = "success" | "error" | "info" | "warning";

function notify(variant: ToastVariant, message: string, toastId = message) {
  toast.dismiss(toastId);
  return toast[variant](message, {
    id: toastId,
  });
}

export const appToast = {
  success: (message: string, toastId?: string) =>
    notify("success", message, toastId),
  error: (message: string, toastId?: string) =>
    notify("error", message, toastId),
  info: (message: string, toastId?: string) => notify("info", message, toastId),
  warning: (message: string, toastId?: string) =>
    notify("warning", message, toastId),
  clear: (toastId?: string | number) => toast.dismiss(toastId),
};

export const catchError = (error: any) => {
  if (error instanceof FirebaseError) {
    console.error(error.message);
  } else {
    console.error(error);
  }
};

export function toDate(value: Timestamp | Date | string | any): Date | null {
  if (!value) return null;

  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  }
  if (typeof value.toDate === "function") return value.toDate();
  if (typeof value.seconds === "number") {
    return new Date(value.seconds * 1000);
  }

  return null;
}

export function formatFirestoreTimestamp(timestamp: Timestamp | Date | string) {
  const date = toDate(timestamp);

  if (!date) return " - ";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}
