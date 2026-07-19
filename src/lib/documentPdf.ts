import axios from "axios";

import { pdfGenerate } from "../pages/Invoice/download/PdfGenerate";

const invalidFilenameCharacters = /[<>:"/\\|?*]+/g;

const documentTypeSuffix = {
  invoice: "INVOICE",
  challan: "CHALLAN",
  purchaseBill: "PURCHASE_BILL",
} as const;

type DocumentFilenameType = keyof typeof documentTypeSuffix;

export function sanitizeFilenamePart(
  value: string | null | undefined,
  fallback: string,
) {
  const sanitized = (value || "").replace(invalidFilenameCharacters, "").trim();
  return sanitized || fallback;
}

export function buildDocumentFilename({
  name,
  number,
  type,
  fallback,
}: {
  name: string | null | undefined;
  number?: string | null;
  type: DocumentFilenameType;
  fallback: string;
}) {
  const filenameParts = [
    sanitizeFilenamePart(name, fallback),
    number ? sanitizeFilenamePart(number, "") : "",
    documentTypeSuffix[type],
  ]
    .filter(Boolean)
    .map((part) => part.toUpperCase());

  return `${filenameParts.join("_")}.pdf`;
}

function downloadBlob(blobData: BlobPart, filename: string) {
  const blob = new Blob([blobData], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export async function generateAndDownloadPdf({
  html,
  filename,
}: {
  html: string;
  filename: string;
}) {
  const pdfUrl = await pdfGenerate(html);
  if (!pdfUrl) throw new Error("PDF URL was not generated");

  const response = await axios.get(pdfUrl, {
    responseType: "blob",
  });

  downloadBlob(response.data, filename);
}
