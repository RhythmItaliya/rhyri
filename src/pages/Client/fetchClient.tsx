import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Client } from "../../types";
import { FirebaseError } from "firebase/app";

export const fetchClient = async (
  clientId: string,
  uid: string
): Promise<Client | undefined> => {
  try {
    const clientRef = doc(db, "clients", clientId);

    const clientQuerySnapshot = await getDoc(clientRef);

    if (clientQuerySnapshot.exists()) {
      const client = {
        ...clientQuerySnapshot.data(),
        id: clientQuerySnapshot.id,
      } as Client;
      if (client.uid === uid) {
        return client;
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

    throw new Error("Unable to fetch client");
  }
};
