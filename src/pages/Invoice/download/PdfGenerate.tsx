import axios from "axios";

type OuterHTML = string;

const PDF_API_URL = import.meta.env.VITE_PDF_API_URL;

export async function pdfGenerate(
  data: OuterHTML,
): Promise<string | undefined> {
  if (typeof data !== "string" || data.trim().length === 0) {
    throw new Error("Invalid HTML data provided.");
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <style>
        @page {
          size: A4;
          margin: 14px;
        }
        body {
          font-family: "Poppins", sans-serif;
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
        }
        .invoice-content {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid black;
        }
      </style>
    </head>
    <body>
      <div class="invoice-content">
        ${data}
      </div>
    </body>
    </html>
  `;

  try {
    const response = await axios.post(
      PDF_API_URL,
      { html: html },
      {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "blob",
      },
    );

    if (response.status !== 200) {
      throw new Error(`Server returned status code ${response.status}`);
    }

    const blob = response.data;
    const url = window.URL.createObjectURL(blob);

    return url;
  } catch (error) {
    console.error("Error during PDF generation:", error);
    throw new Error("Failed to generate PDF. Please try again later.");
  }
}
