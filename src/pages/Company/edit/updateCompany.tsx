import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { FirebaseError } from "firebase/app";
import { CompanyInputs } from "../companyValidator";

export async function updateCompany(values: CompanyInputs, companyId: string) {
  try {
    const companyRef = doc(db, "companies", companyId);

    await updateDoc(companyRef, values);
  } catch (error) {
    error instanceof FirebaseError
      ? console.error(error.message)
      : console.error(error);

    throw new Error("Unable to update company");
  }
}
