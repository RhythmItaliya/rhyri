import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Company } from "../../types";
import { FirebaseError } from "firebase/app";

export const fetchCompany = async (
  companyId: string,
  uid: string
): Promise<Company | undefined> => {
  try {
    const companyRef = doc(db, "companies", companyId);

    const companyQuerySnapshot = await getDoc(companyRef);

    if (companyQuerySnapshot.exists()) {
      const company = {
        ...companyQuerySnapshot.data(),
        id: companyQuerySnapshot.id,
      } as Company;
      if (company.uid === uid) {
        return company;
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

    throw new Error("Unable to fetch company");
  }
};
