import { FirebaseError } from "firebase/app";
import { doc, updateDoc } from "firebase/firestore";

import { db } from "../../../lib/firebase";
import { ChallanInputs } from "../challanValidator";

export async function updateChallan(
  values: ChallanInputs & {
    totalPieces: number;
    amount: number;
  },
  challanId: string,
) {
  try {
    const challanRef = doc(db, "challans", challanId);
    await updateDoc(challanRef, values);
  } catch (error) {
    error instanceof FirebaseError
      ? console.error(error.message)
      : console.error(error);

    throw new Error("Unable to update challan");
  }
}
