import { FirebaseError } from "firebase/app";
import { doc, updateDoc } from "firebase/firestore";

import { db } from "../../../lib/firebase";
import { PurchaseBillInputs } from "../purchaseBillValidator";

export async function updatePurchaseBill(
  values: PurchaseBillInputs & {
    amount: number;
  },
  purchaseBillId: string,
) {
  try {
    const purchaseBillRef = doc(db, "purchaseBills", purchaseBillId);
    await updateDoc(purchaseBillRef, values);
  } catch (error) {
    error instanceof FirebaseError
      ? console.error(error.message)
      : console.error(error);

    throw new Error("Unable to update purchase bill");
  }
}
