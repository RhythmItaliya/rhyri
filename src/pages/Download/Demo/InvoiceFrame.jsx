import React, { useRef, useState } from 'react';
import axios from 'axios';
import InvoiceContent from './InvoiceContent';
import fieldNames from './fieldNames.json';
import invoiceData from './invoiceData.json';

const InvoiceFrame = () => {
  const printRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [pdfUrl, setPdfUrl] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const generatePdf = async () => {
    const element = printRef.current;
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">

      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <style>
        body {
          font-family: "Poppins", sans-serif;
          margin: 14px;
          padding: 0;
          background-color: #ffffff;
        }
      </style>
    </head>
    <body>
      ${element.outerHTML}
    </body>
    </html>
    `;

    try {
      setProgress(10);
      const response = await axios.post('http://localhost:3001/generate-pdf', { html }, {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          const total = progressEvent.total;
          const current = progressEvent.loaded;
          const percentage = Math.floor((current / total) * 100);
          setProgress(percentage);
        }
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      setProgress(100);
      return url;
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handlePreviewClick = async () => {
    const url = await generatePdf();
    setPdfUrl(url);
    setShowPreview(true);
  };

  const handleDownloadClick = async () => {
    const url = await generatePdf();
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'invoice.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white p-5">
      <div className="flex flex-col items-center justify-center mb-4">
        <div className="w-full flex justify-between items-center">
          <div className="w-3/4 bg-gray-200 rounded">
            {progress > 0 && (
              <div
                className="bg-blue-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded"
                style={{ width: `${progress}%` }}
              >
                {progress}%
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handlePreviewClick}
              className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
            >
              Preview PDF
            </button>
            <button
              onClick={handleDownloadClick}
              className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-full">
        <div ref={printRef}>
          <InvoiceContent data={invoiceData} fieldNames={fieldNames} />
        </div>
      </div>
      {showPreview && pdfUrl && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center">
          <iframe
            src={pdfUrl}
            width="80%"
            height="80%"
            style={{ border: 'none' }}
            title="PDF Preview"
          />
          <button
            onClick={() => setShowPreview(false)}
            className="absolute top-5 right-5 px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
          >
            Close Preview
          </button>
        </div>
      )}
    </div>
  );
};

export default InvoiceFrame;
