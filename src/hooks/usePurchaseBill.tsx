import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FirebaseError } from "firebase/app";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";

import { db } from "../lib/firebase";
import {
  buildDocumentFilename,
  generateAndDownloadPdf,
} from "../lib/documentPdf";
import { renderDocumentToHtml } from "../lib/renderToHtml";
import { appToast, catchError } from "../lib/utils";
import PurchaseBillFormat from "../pages/PurchaseBill/download/Format";
import { transformPurchaseBillData } from "../pages/PurchaseBill/download/TransformPurchaseBillData";
import { fetchPurchaseBill } from "../pages/PurchaseBill/fetchPurchaseBill";

export const usePurchaseBill = () => {
  const queryClient = useQueryClient();

  const invalidatePurchaseBills = async () =>
    queryClient.invalidateQueries({
      predicate: (query) =>
        query.queryKey[0] === "purchaseBill" ||
        query.queryKey[0] === "purchaseBills" ||
        query.queryKey[0] === "dashboard",
    });

  const updateStatus = async (
    purchaseBillId: string,
    purchaseBillStatus: "pending" | "paid" | "drafted",
  ) => {
    try {
      const purchaseBillRef = doc(db, "purchaseBills", purchaseBillId);
      await updateDoc(purchaseBillRef, { purchaseBillStatus });
    } catch (error) {
      error instanceof FirebaseError
        ? console.error(error.message)
        : console.error(error);
      throw new Error("Unable to update purchase bill status");
    }
  };

  const markPurchaseBillAsPaidMutation = useMutation({
    mutationFn: (purchaseBillId: string) =>
      updateStatus(purchaseBillId, "paid"),
    onSettled: invalidatePurchaseBills,
    onSuccess() {
      appToast.success("Purchase bill marked as paid");
    },
    onError(error) {
      catchError(error);
    },
  });

  const addPurchaseBillToDraftMutation = useMutation({
    mutationFn: (purchaseBillId: string) =>
      updateStatus(purchaseBillId, "drafted"),
    onSettled: invalidatePurchaseBills,
    onSuccess() {
      appToast.success("Purchase bill moved to draft");
    },
    onError(error) {
      catchError(error);
    },
  });

  const addPurchaseBillToPendingMutation = useMutation({
    mutationFn: (purchaseBillId: string) =>
      updateStatus(purchaseBillId, "pending"),
    onSettled: invalidatePurchaseBills,
    onSuccess() {
      appToast.success("Purchase bill marked as pending");
    },
    onError(error) {
      catchError(error);
    },
  });

  const deletePurchaseBillMutation = useMutation({
    mutationFn: async (purchaseBillId: string) => {
      try {
        const purchaseBillRef = doc(db, "purchaseBills", purchaseBillId);
        await deleteDoc(purchaseBillRef);
      } catch (error) {
        error instanceof FirebaseError
          ? console.error(error.message)
          : console.error(error);
        throw new Error("Unable to delete purchase bill");
      }
    },
    onSettled: invalidatePurchaseBills,
    onSuccess() {
      appToast.success("Purchase bill deleted");
    },
    onError(error) {
      catchError(error);
    },
  });

  const downloadPurchaseBillMutation = useMutation({
    mutationFn: async ({
      purchaseBillId,
      uid,
      onProgress,
    }: {
      purchaseBillId: string;
      uid: string;
      onProgress: (progress: string) => void;
    }) => {
      try {
        if (!uid || !purchaseBillId) {
          throw new Error("Invalid UID or purchase bill ID");
        }

        onProgress("Fetching purchase bill data...");
        const purchaseBill = await fetchPurchaseBill(purchaseBillId, uid);
        if (!purchaseBill) {
          throw new Error("No data fetched for the provided purchase bill ID");
        }

        onProgress("Preparing data...");
        const transformedData = transformPurchaseBillData(purchaseBill);

        onProgress("Rendering HTML...");
        const html = renderDocumentToHtml(
          <PurchaseBillFormat data={transformedData} />,
        );
        if (!html) throw new Error("Invalid HTML content");

        onProgress("Generating PDF...");
        const filename = buildDocumentFilename({
          name: transformedData.buyer.name,
          number: transformedData.bill.number,
          type: "purchaseBill",
          fallback: "purchase-bill",
        });

        onProgress("Downloading PDF...");
        await generateAndDownloadPdf({
          html,
          filename,
        });

        onProgress("Download complete");
      } catch (error) {
        console.error("Error during purchase bill PDF download:", error);
        onProgress("Error occurred");
        throw error;
      }
    },
    onError(error) {
      catchError(error);
    },
  });

  return {
    markPurchaseBillAsPaidMutation,
    addPurchaseBillToDraftMutation,
    addPurchaseBillToPendingMutation,
    deletePurchaseBillMutation,
    downloadPurchaseBillMutation,
  };
};
