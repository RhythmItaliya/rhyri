import { useChallan } from "../hooks/useChallan";
import { useInvoice } from "../hooks/useInvoice";
import { usePurchaseBill } from "../hooks/usePurchaseBill";
import { useAppStore, DownloadDocumentType } from "../store/appStore";
import { appToast } from "./utils";

function getDownloadErrorMessage(error: unknown) {
  return error instanceof Error && error.message
    ? error.message
    : "Download failed. Please try again.";
}

export function useDownloadInvoice() {
  const { downloadInvoiceMutation } = useInvoice();
  const { id: downloadingId, progress } = useAppStore(
    (state) => state.downloads.invoice,
  );
  const setDownload = useAppStore((state) => state.setDownload);
  const downloadType: DownloadDocumentType = "invoice";

  const downloadInvoice = async (invoiceId: string, uid: string | null) => {
    if (uid === null) {
      console.error("UID is not available");
      appToast.error("Please sign in again before downloading.");
      return;
    }

    setDownload(downloadType, { id: invoiceId, progress: "Fetching data..." });
    try {
      await downloadInvoiceMutation.mutateAsync({
        invoiceId,
        uid,
        onProgress: (progress: string) =>
          setDownload(downloadType, { progress }),
      });
      appToast.success("Invoice downloaded");
      setTimeout(() => setDownload(downloadType, { progress: null }), 1000);
    } catch (error) {
      appToast.error(getDownloadErrorMessage(error));
      setDownload(downloadType, { progress: "Error occurred" });
      setTimeout(() => setDownload(downloadType, { progress: null }), 3000);
    } finally {
      setTimeout(() => setDownload(downloadType, { id: null }), 1000);
    }
  };

  return { downloadInvoice, progress, downloadingId };
}

export function useDownloadPurchaseBill() {
  const { downloadPurchaseBillMutation } = usePurchaseBill();
  const { id: downloadingId, progress } = useAppStore(
    (state) => state.downloads.purchaseBill,
  );
  const setDownload = useAppStore((state) => state.setDownload);
  const downloadType: DownloadDocumentType = "purchaseBill";

  const downloadPurchaseBill = async (
    purchaseBillId: string,
    uid: string | null,
  ) => {
    if (uid === null) {
      console.error("UID is not available");
      appToast.error("Please sign in again before downloading.");
      return;
    }

    setDownload(downloadType, {
      id: purchaseBillId,
      progress: "Fetching data...",
    });
    try {
      await downloadPurchaseBillMutation.mutateAsync({
        purchaseBillId,
        uid,
        onProgress: (progress: string) =>
          setDownload(downloadType, { progress }),
      });
      appToast.success("Purchase bill downloaded");
      setTimeout(() => setDownload(downloadType, { progress: null }), 1000);
    } catch (error) {
      appToast.error(getDownloadErrorMessage(error));
      setDownload(downloadType, { progress: "Error occurred" });
      setTimeout(() => setDownload(downloadType, { progress: null }), 3000);
    } finally {
      setTimeout(() => setDownload(downloadType, { id: null }), 1000);
    }
  };

  return { downloadPurchaseBill, progress, downloadingId };
}

export function useDownloadChallan() {
  const { downloadChallanMutation } = useChallan();
  const { id: downloadingId, progress } = useAppStore(
    (state) => state.downloads.challan,
  );
  const setDownload = useAppStore((state) => state.setDownload);
  const downloadType: DownloadDocumentType = "challan";

  const downloadChallan = async (challanId: string, uid: string | null) => {
    if (uid === null) {
      console.error("UID is not available");
      appToast.error("Please sign in again before downloading.");
      return;
    }

    setDownload(downloadType, { id: challanId, progress: "Fetching data..." });
    try {
      await downloadChallanMutation.mutateAsync({
        challanId,
        uid,
        onProgress: (progress: string) =>
          setDownload(downloadType, { progress }),
      });
      appToast.success("Challan downloaded");
      setTimeout(() => setDownload(downloadType, { progress: null }), 1000);
    } catch (error) {
      appToast.error(getDownloadErrorMessage(error));
      setDownload(downloadType, { progress: "Error occurred" });
      setTimeout(() => setDownload(downloadType, { progress: null }), 3000);
    } finally {
      setTimeout(() => setDownload(downloadType, { id: null }), 1000);
    }
  };

  return { downloadChallan, progress, downloadingId };
}
