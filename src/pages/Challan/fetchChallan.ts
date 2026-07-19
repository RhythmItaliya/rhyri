import { FirebaseError } from "firebase/app";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../../lib/firebase";
import { Challan } from "../../types/challanTypes";

export const fetchChallan = async (
  challanId: string,
  uid: string,
): Promise<Challan | undefined> => {
  try {
    const challanRef = doc(db, "challans", challanId);
    const challanSnapshot = await getDoc(challanRef);

    if (!challanSnapshot.exists()) {
      throw new Error("Document doesn't exist");
    }

    const challan = {
      ...challanSnapshot.data(),
      id: challanSnapshot.id,
    } as Challan;

    if (challan.uid !== uid) {
      throw new Error("Not authorized");
    }

    return challan;
  } catch (error) {
    error instanceof FirebaseError
      ? console.error(error.message)
      : console.error(error);

    throw new Error("Unable to fetch challan");
  }
};
