import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { FirebaseError } from "firebase/app";
import { BankInputs } from "../bankValidator";

export async function updateBank(values: BankInputs, bankId: string) {
  try {
    const bankRef = doc(db, "banks", bankId);

    await updateDoc(bankRef, values);
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    throw new Error("Unable to update bank");
  }
}
