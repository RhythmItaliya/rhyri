import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FirebaseError } from "firebase/app"
import { deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db } from "../lib/firebase"
import { catchError } from "../lib/utils"

import { fetchInvoice } from '../pages/Invoice/fetchInvoice';
import { transformInvoiceData } from '../pages/Invoice/download/TransformInvoiceData';
import { pdfGenerate } from '../pages/Invoice/download/PdfGenerate';
import { renderToHtml } from "../lib/renderToHtml"
import axios from 'axios';

export const useInvoice = () => {
  const queryClient = useQueryClient()

  const markInvoiceAsPaidMutation = useMutation({
    mutationFn: async (invoiceId: string) => {
      try {
        const invoiceRef = doc(db, "invoices", invoiceId)
        await updateDoc(invoiceRef, { invoiceStatus: "paid" })
      } catch (error) {
        error instanceof FirebaseError
          ? console.error(error.message)
          : console.error(error)
        throw new Error("Unable to mark invoice as paid")
      }
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "invoice" || query.queryKey[0] === "invoices",
      })
    },
    onError(error) {
      catchError(error)
    },
  })

  const addInvoiceToDraftMutation = useMutation({
    mutationFn: async (invoiceId: string) => {
      try {
        const invoiceRef = doc(db, "invoices", invoiceId)
        await updateDoc(invoiceRef, { invoiceStatus: "drafted" })
      } catch (error) {
        error instanceof FirebaseError
          ? console.error(error.message)
          : console.error(error)
        throw new Error("Unable to add invoice to draft")
      }
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "invoice" || query.queryKey[0] === "invoices",
      })
    },
    onError(error) {
      catchError(error)
    },
  })

  const addInvoiceToPendingMutation = useMutation({
    mutationFn: async (invoiceId: string) => {
      try {
        const invoiceRef = doc(db, "invoices", invoiceId)
        await updateDoc(invoiceRef, { invoiceStatus: "pending" })
      } catch (error) {
        error instanceof FirebaseError
          ? console.error(error.message)
          : console.error(error)
        throw new Error("Unable to mark invoice as pending")
      }
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "invoice" || query.queryKey[0] === "invoices",
      })
    },
    onError(error) {
      catchError(error)
    },
  })

  const deleteInvoiceMutation = useMutation({
    mutationFn: async (invoiceId: string) => {
      try {
        const invoiceRef = doc(db, "invoices", invoiceId)
        await deleteDoc(invoiceRef)
      } catch (error) {
        error instanceof FirebaseError
          ? console.error(error.message)
          : console.error(error)
        throw new Error("Unable to delete invoice")
      }
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "invoice" || query.queryKey[0] === "invoices",
      })
    },
    onError(error) {
      catchError(error)
    },
  })

  const downloadInvoiceMutation = useMutation({
    mutationFn: async ({ invoiceId, uid, onProgress }: { invoiceId: string; uid: string; onProgress: (progress: string) => void }) => {
      try {
        if (!uid || !invoiceId) {
          throw new Error('Invalid UID or invoice ID');
        }
        onProgress('Starting download process...');

        onProgress('Verifying details...');
        await new Promise(resolve => setTimeout(resolve, 500));

        onProgress('Fetching invoice data...');
        const fetchData = await fetchInvoice(invoiceId, uid);
        if (!fetchData) throw new Error('No data fetched for the provided invoice ID');

        onProgress('Preparing data...');
        const rawData = { ...fetchData };
        const transformedData = transformInvoiceData(rawData as any);

        if (!transformedData || typeof transformedData !== 'object') throw new Error('Invalid transformed data');

        onProgress('Rendering HTML...');
        const html = renderToHtml({ transformedData });
        if (!html || typeof html !== 'string') throw new Error('Invalid HTML content');

        onProgress('Generating PDF...');
        const pdfUrl = await pdfGenerate(html);
        if (!pdfUrl) throw new Error('PDF URL was not generated');

        onProgress('Fetching PDF...');
        const response = await axios.get(pdfUrl, {
          responseType: 'blob'
        });

        const filename = createFilename(transformedData);
        onProgress('Downloading PDF...');
        downloadBlob(response.data, filename);

        onProgress('Download complete');
      } catch (error) {
        console.error('Error during PDF generation or download:', error);
        onProgress('Error occurred');
        throw error;
      }
    },
    onError(error) {
      catchError(error);
    },
  });

  function createFilename(transformedData: any) {
    const clientName = transformedData.customer.clientName || 'invoice';
    const invoiceCustomNumber = transformedData.invoice.invoiceCustomNumber || '';
    const sanitizedClientName = clientName.replace(/[<>:"\/\\|?*]+/g, '').toUpperCase();
    const sanitizedInvoiceNumber = invoiceCustomNumber.replace(/[<>:"\/\\|?*]+/g, '');
    return sanitizedClientName + (sanitizedInvoiceNumber ? `_${sanitizedInvoiceNumber.toUpperCase()}` : '') + '.pdf';
  }

  function downloadBlob(blobData: any, filename: string) {
    const blob = new Blob([blobData], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return {
    markInvoiceAsPaidMutation,
    addInvoiceToDraftMutation,
    addInvoiceToPendingMutation,
    deleteInvoiceMutation,
    downloadInvoiceMutation
  }
}