import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../contexts/AuthContext";
import { db } from "../../../lib/firebase";
import { appToast, catchError, toDate } from "../../../lib/utils";
import { calculatePurchaseBillTotals } from "../purchaseBillUtils";
import { PurchaseBillForm } from "../PurchaseBillForm";
import { PurchaseBillInputs } from "../purchaseBillValidator";
import { generatePurchaseBillId } from "./generatePurchaseBillId";

export function CreatePurchaseBillPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [defaultCustomNumber, setDefaultCustomNumber] = useState("");

  if (!currentUser) return null;

  const incrementPurchaseBillNumber = (lastNumber: string) => {
    const match = lastNumber.match(/(\d+)$/);
    if (!match) return `${lastNumber}-1`;

    const num = Number(match[0]);
    const nextNum = String(num + 1).padStart(match[0].length, "0");
    return lastNumber.substring(0, match.index ?? 0) + nextNum;
  };

  useEffect(() => {
    const fetchLastPurchaseBillNumber = async () => {
      try {
        const purchaseBillsRef = collection(db, "purchaseBills");
        const purchaseBillsQuery = query(
          purchaseBillsRef,
          where("uid", "==", currentUser.uid),
        );
        const querySnapshot = await getDocs(purchaseBillsQuery);

        if (!querySnapshot.empty) {
          const lastPurchaseBill = querySnapshot.docs
            .map((doc) => doc.data())
            .sort((a, b) => {
              const firstDate = toDate(a.purchaseBillDate)?.getTime() || 0;
              const secondDate = toDate(b.purchaseBillDate)?.getTime() || 0;
              return secondDate - firstDate;
            })[0];
          setDefaultCustomNumber(
            incrementPurchaseBillNumber(
              lastPurchaseBill.purchaseBillNumber || "",
            ),
          );
          return;
        }

        setDefaultCustomNumber("PB-1001");
      } catch (error) {
        console.error("Error fetching last purchase bill number:", error);
        setDefaultCustomNumber("PB-1001");
      }
    };

    fetchLastPurchaseBillNumber();
  }, [currentUser.uid]);

  const { mutate: createPurchaseBill, isPending } = useMutation({
    mutationFn: async (values: PurchaseBillInputs) => {
      const purchaseBillsRef = collection(db, "purchaseBills");
      const duplicateQuery = query(
        purchaseBillsRef,
        where("uid", "==", currentUser.uid),
        where("purchaseBillNumber", "==", values.purchaseBillNumber),
      );
      const querySnapshot = await getDocs(duplicateQuery);

      if (!querySnapshot.empty) {
        throw new Error(
          `Purchase bill number "${values.purchaseBillNumber}" already exists. Please choose a unique number.`,
        );
      }

      const purchaseBillId = generatePurchaseBillId();
      const totals = calculatePurchaseBillTotals(values.itemList);

      await setDoc(doc(db, "purchaseBills", purchaseBillId), {
        ...values,
        purchaseBillStatus: "pending",
        uid: currentUser.uid,
        amount: totals.roundedAmount,
      });
    },
    onSuccess() {
      appToast.success("Purchase bill created successfully");
      queryClient.invalidateQueries({ queryKey: ["purchaseBills"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      navigate("/purchase-bills");
    },
    onError(error: any) {
      appToast.error(error.message);
      catchError(error);
    },
  });

  return (
    <PurchaseBillForm
      onSubmit={createPurchaseBill}
      isPending={isPending}
      defaultCustomNumber={defaultCustomNumber}
    />
  );
}
