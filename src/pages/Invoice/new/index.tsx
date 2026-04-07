import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useEffect, useState } from "react";

import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import { InvoiceInputs } from "../invoiceValidator";
import { InvoiceForm } from "../InvoiceForm";

import { catchError } from "../../../lib/utils";
import { generateInvoiceId } from "./generateInvoiceId";

export function CreateInvoicePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [defaultCustomNumber, setDefaultCustomNumber] = useState("");

  if (!currentUser) {
    console.error("No authenticated user found");
    return null;
  }

  const incrementInvoiceNumber = (lastNumber: string) => {
    const match = lastNumber.match(/(\d+)$/);
    if (match) {
      const num = parseInt(match[0], 10);
      const nextNum = (num + 1).toString().padStart(match[0].length, "0");
      return lastNumber.substring(0, match.index ?? 0) + nextNum;
    }
    return lastNumber + "-1";
  };

  useEffect(() => {
    const fetchLastInvoiceNumber = async () => {
      try {
        const invoicesRef = collection(db, "invoices");
        const q = query(
          invoicesRef,
          where("uid", "==", currentUser.uid),
          orderBy("invoiceDate", "desc"),
          limit(1),
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const lastInvoice = querySnapshot.docs[0].data();
          const lastNumber = lastInvoice.invoiceCustomNumber || "";
          setDefaultCustomNumber(incrementInvoiceNumber(lastNumber));
        } else {
          setDefaultCustomNumber("INV-1001");
        }
      } catch (error) {
        console.error("Error fetching last invoice number:", error);
        setDefaultCustomNumber("INV-1001");
      }
    };

    fetchLastInvoiceNumber();
  }, [currentUser.uid]);

  const { mutate: createInvoice, isPending } = useMutation({
    mutationFn: async (values: InvoiceInputs) => {
      // Check for duplicate invoiceNumber
      const invoicesRef = collection(db, "invoices");
      const q = query(
        invoicesRef,
        where("uid", "==", currentUser.uid),
        where("invoiceCustomNumber", "==", values.invoiceCustomNumber),
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        throw new Error(
          `Invoice number "${values.invoiceCustomNumber}" already exists. Please choose a unique number.`,
        );
      }

      const invoiceId = generateInvoiceId();
      const amount = values.itemList.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );

      await setDoc(doc(db, "invoices", invoiceId), {
        ...values,
        invoiceStatus: "pending",
        uid: currentUser.uid,
        amount,
      });
    },
    onSuccess() {
      toast.success("Invoice created successfully");
      navigate("/invoices");
    },
    onError(error: any) {
      toast.error(error.message);
      catchError(error);
    },
  });

  return (
    <InvoiceForm
      onSubmit={createInvoice}
      isPending={isPending}
      defaultCustomNumber={defaultCustomNumber}
    />
  );
}
