import { useState } from "react";
import { useInvoice } from "../hooks/useInvoice";

export function useDownloadInvoice() {
  const { downloadInvoiceMutation } = useInvoice();
  const [progress, setProgress] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const downloadInvoice = async (invoiceId: string, uid: string | null) => {
    if (uid === null) {
      console.error("UID is not available");
      return;
    }

    setDownloadingId(invoiceId);
    setProgress("Fetching data...");
    try {
      await downloadInvoiceMutation.mutateAsync({
        invoiceId,
        uid,
        onProgress: (progress: string) => setProgress(progress),
      });
      setTimeout(() => setProgress(null), 1000);
    } catch (error) {
      setProgress("Error occurred");
      setTimeout(() => setProgress(null), 3000);
    } finally {
      setTimeout(() => setDownloadingId(null), 1000);
    }
  };

  return { downloadInvoice, progress, downloadingId };
}
