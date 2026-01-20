import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Bank } from "../../types";
import { FirebaseError } from "firebase/app";

export const fetchBank = async (
  bankId: string,
  uid: string,
): Promise<Bank | undefined> => {
  try {
    const bankRef = doc(db, "banks", bankId);

    const bankQuerySnapshot = await getDoc(bankRef);

    if (bankQuerySnapshot.exists()) {
      const bank = {
        ...bankQuerySnapshot.data(),
        id: bankQuerySnapshot.id,
      } as Bank;
      if (bank.uid === uid) {
        return bank;
      } else {
        throw new Error("Not authorized");
      }
    } else {
      throw new Error("Document doesn't exist");
    }
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    throw new Error("Unable to fetch bank");
  }
};
