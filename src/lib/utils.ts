import { FirebaseError } from "firebase/app"

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { Timestamp } from "firebase/firestore"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const catchError = (error: any) => {
  if (error instanceof FirebaseError) {
    console.error(error.message)
  } else {
    console.error(error)
  }
}

export function formatFirestoreTimestamp(timestamp: Timestamp) {
  const date = timestamp.toDate()

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount)
}
