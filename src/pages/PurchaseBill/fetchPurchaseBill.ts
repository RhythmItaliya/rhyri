import { FirebaseError } from "firebase/app";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../../lib/firebase";
import { PurchaseBill } from "../../types/purchaseBillTypes";

export const fetchPurchaseBill = async (
  purchaseBillId: string,
  uid: string,
): Promise<PurchaseBill | undefined> => {
  try {
    const purchaseBillRef = doc(db, "purchaseBills", purchaseBillId);
    const purchaseBillSnapshot = await getDoc(purchaseBillRef);

    if (!purchaseBillSnapshot.exists()) {
      throw new Error("Document doesn't exist");
    }

    const purchaseBill = {
      ...purchaseBillSnapshot.data(),
      id: purchaseBillSnapshot.id,
    } as PurchaseBill;

    if (purchaseBill.uid !== uid) {
      throw new Error("Not authorized");
    }

    return purchaseBill;
  } catch (error) {
    error instanceof FirebaseError
      ? console.error(error.message)
      : console.error(error);

    throw new Error("Unable to fetch purchase bill");
  }
};
