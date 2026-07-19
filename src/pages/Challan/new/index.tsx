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
import { invalidateRootQueries } from "../../../lib/queryInvalidation";
import { appToast, catchError, toDate } from "../../../lib/utils";
import { getChallanTotals, incrementChallanNumber } from "../challanUtils";
import { ChallanForm } from "../ChallanForm";
import { ChallanInputs } from "../challanValidator";
import { generateChallanId } from "./generateChallanId";

export function CreateChallanPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [defaultCustomNumber, setDefaultCustomNumber] = useState("");

  if (!currentUser) return null;

  useEffect(() => {
    const fetchLastChallanNumber = async () => {
      try {
        const challansRef = collection(db, "challans");
        const challansQuery = query(
          challansRef,
          where("uid", "==", currentUser.uid),
        );
        const querySnapshot = await getDocs(challansQuery);

        if (!querySnapshot.empty) {
          const lastChallan = querySnapshot.docs
            .map((doc) => doc.data())
            .sort((a, b) => {
              const firstDate = toDate(a.challanDate)?.getTime() || 0;
              const secondDate = toDate(b.challanDate)?.getTime() || 0;
              return secondDate - firstDate;
            })[0];

          setDefaultCustomNumber(
            incrementChallanNumber(lastChallan.challanNumber || ""),
          );
          return;
        }

        setDefaultCustomNumber("CH-1001");
      } catch (error) {
        console.error("Error fetching last challan number:", error);
        setDefaultCustomNumber("CH-1001");
      }
    };

    fetchLastChallanNumber();
  }, [currentUser.uid]);

  const { mutate: createChallan, isPending } = useMutation({
    mutationFn: async (values: ChallanInputs) => {
      const challansRef = collection(db, "challans");
      const duplicateQuery = query(
        challansRef,
        where("uid", "==", currentUser.uid),
        where("challanNumber", "==", values.challanNumber),
      );
      const querySnapshot = await getDocs(duplicateQuery);

      if (!querySnapshot.empty) {
        throw new Error(
          `Challan number "${values.challanNumber}" already exists. Please choose a unique number.`,
        );
      }

      const challanId = generateChallanId();
      const totals = getChallanTotals(values.itemList);

      await setDoc(doc(db, "challans", challanId), {
        ...values,
        challanStatus: "pending",
        uid: currentUser.uid,
        totalPieces: totals.totalPieces,
        amount: totals.amount,
      });
    },
    onSuccess() {
      appToast.success("Challan created successfully");
      invalidateRootQueries(queryClient, ["challans", "dashboard"]);
      navigate("/challans");
    },
    onError(error: any) {
      appToast.error(error.message);
      catchError(error);
    },
  });

  return (
    <ChallanForm
      onSubmit={createChallan}
      isPending={isPending}
      defaultCustomNumber={defaultCustomNumber}
    />
  );
}
