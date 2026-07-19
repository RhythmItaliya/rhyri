import { ReactElement } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

import { db } from "../lib/firebase";
import {
  buildDocumentFilename,
  generateAndDownloadPdf,
} from "../lib/documentPdf";
import { renderDocumentToHtml } from "../lib/renderToHtml";
import { appToast, catchError } from "../lib/utils";
import ChallanFormat from "../pages/Challan/download/Format";
import { transformChallanData } from "../pages/Challan/download/TransformChallanData";
import { fetchChallan } from "../pages/Challan/fetchChallan";

export const useChallan = () => {
  const queryClient = useQueryClient();

  const invalidateChallans = () => {
    queryClient.invalidateQueries({
      predicate: (query) =>
        query.queryKey[0] === "challan" ||
        query.queryKey[0] === "challans" ||
        query.queryKey[0] === "dashboard",
    });
  };

  const markChallanAsPaidMutation = useMutation({
    mutationFn: async (challanId: string) => {
      await updateDoc(doc(db, "challans", challanId), {
        challanStatus: "paid",
      });
    },
    onSettled: invalidateChallans,
    onSuccess() {
      appToast.success("Challan marked as complete");
    },
    onError(error) {
      catchError(error);
    },
  });

  const addChallanToDraftMutation = useMutation({
    mutationFn: async (challanId: string) => {
      await updateDoc(doc(db, "challans", challanId), {
        challanStatus: "drafted",
      });
    },
    onSettled: invalidateChallans,
    onSuccess() {
      appToast.success("Challan moved to draft");
    },
    onError(error) {
      catchError(error);
    },
  });

  const addChallanToPendingMutation = useMutation({
    mutationFn: async (challanId: string) => {
      await updateDoc(doc(db, "challans", challanId), {
        challanStatus: "pending",
      });
    },
    onSettled: invalidateChallans,
    onSuccess() {
      appToast.success("Challan marked as pending");
    },
    onError(error) {
      catchError(error);
    },
  });

  const deleteChallanMutation = useMutation({
    mutationFn: async (challanId: string) => {
      await deleteDoc(doc(db, "challans", challanId));
    },
    onSettled: invalidateChallans,
    onSuccess() {
      appToast.success("Challan deleted");
    },
    onError(error) {
      catchError(error);
    },
  });

  const downloadChallanMutation = useMutation({
    mutationFn: async ({
      challanId,
      uid,
      onProgress,
    }: {
      challanId: string;
      uid: string;
      onProgress: (progress: string) => void;
    }) => {
      try {
        if (!uid || !challanId) {
          throw new Error("Invalid UID or challan ID");
        }

        onProgress("Fetching challan data...");
        const challan = await fetchChallan(challanId, uid);
        if (!challan) {
          throw new Error("No data fetched for the provided challan ID");
        }

        onProgress("Preparing data...");
        const transformedData = transformChallanData(challan);

        onProgress("Rendering HTML...");
        const challanDocument: ReactElement = (
          <ChallanFormat data={transformedData} />
        );
        const html = renderDocumentToHtml(challanDocument);
        if (!html) throw new Error("Invalid HTML content");

        onProgress("Generating PDF...");
        const filename = buildDocumentFilename({
          name: transformedData.client.name,
          number: transformedData.challan.number,
          type: "challan",
          fallback: "challan",
        });

        onProgress("Downloading PDF...");
        await generateAndDownloadPdf({
          html,
          filename,
        });

        onProgress("Download complete");
      } catch (error) {
        console.error("Error during challan PDF download:", error);
        onProgress("Error occurred");
        throw error;
      }
    },
    onError(error) {
      catchError(error);
    },
  });

  return {
    markChallanAsPaidMutation,
    addChallanToDraftMutation,
    addChallanToPendingMutation,
    deleteChallanMutation,
    downloadChallanMutation,
  };
};
