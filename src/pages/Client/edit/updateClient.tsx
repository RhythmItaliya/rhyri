import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { FirebaseError } from "firebase/app";
import { ClientInputs } from "../clientValidator";

export async function updateClient(
  values: ClientInputs,
  clientId: string
) {
  try {
    const clientRef = doc(db, "clients", clientId);

    await updateDoc(clientRef, values);
  } catch (error) {
    error instanceof FirebaseError
      ? console.error(error.message)
      : console.error(error);

    throw new Error("Unable to update client");
  }
}
