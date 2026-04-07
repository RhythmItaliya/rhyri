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
      <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
      <style>
        @page {
          size: A4;
          margin: 7mm;
        }
        body {
          margin: 0;
          padding: 0;
          font-family: 'Inter', sans-serif;
          -webkit-print-color-adjust: exact;
        }
        * {
          box-sizing: border-box;
        }
        .invoice-wrapper {
          width: 196mm;
          height: 283mm;
          display: flex;
          flex-direction: column;
          background: white;
        }
      </style>
    </head>
    <body>
      <div class="invoice-wrapper">
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
    throw new Error("Failed to generate PDF. Please try again later.");
  }
}
