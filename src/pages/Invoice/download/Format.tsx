import React from "react";
import { FormatTestProps } from "../../../types/invoiceTypes";
import { formatCurrency } from "../../../lib/utils";

const FormatTest: React.FC<FormatTestProps> = ({ data, fieldNames }) => {
  const {
    company,
    invoice,
    customer,
    items,
    totals,
    bankDetails,
    totalInWords,
    termsAndConditions,
  } = data;

  return (
    <div className="invoice-content border border-black">
      {/* Title */}
      <h1 className="text-4xl p-2 font-extrabold uppercase text-black border-b border-black text-center">
        {company.companyName}
      </h1>

      {/* Sub Title */}
      <h2 className="text-1xl p-2 font-bold uppercase text-gray-800 border-b border-black text-center">
        {company.companyTagline}
      </h2>

      <div className="flex">
        {/* Address Section */}
        <div className="address w-1/2 flex text-start pl-2 border-r border-black p-1">
          <p className="text-xs font-semibold uppercase leading-tight">
            <span className="block mb-1">{company.companyAddress}</span>
            <span className="block mb-1">
              {company.companyCity}, {company.companyPostCode}
            </span>
            <span className="block">
              {company.companyState}, {company.companyCountry}
            </span>
          </p>
        </div>

        {/* Contact Info Section */}
        <div className="contact-info w-1/2 flex justify-end text-end pr-2 p-1 text-xs uppercase">
          <div className="flex flex-col w-full">
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">{fieldNames.contactName}</span>
              <span className="font-semibold">{company.companyPersonName}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">{fieldNames.contactTel}</span>
              <span className="font-semibold">{company.companyTelephone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{fieldNames.contactEmail}</span>
              <span className="font-semibold lowercase">
                {company.companyEmail}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* GST Section */}
      <div className="border-t border-black">
        <div className="flex border-b border-black">
          <div className="flex-1 border-r border-black p-2">
            <p className="text-sm text-gray-600 uppercase flex justify-between px-2">
              <span className="text-left">{fieldNames.gstin}</span>
              <span className="font-semibold text-black text-right">
                {company.companyGSTNumber}
              </span>
            </p>
          </div>
          <div className="flex-1 border-r border-black p-2">
            <p className="text-sm font-bold text-blue-600 uppercase text-center">
              {fieldNames.invoiceTax}
            </p>
          </div>
          <div className="flex-1 p-2">
            <p className="text-sm font-semibold text-black uppercase text-right">
              {fieldNames.originalForReceipt}
            </p>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Customer Details Section */}
        <div className="w-1/2 border-b border-black">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th
                  colSpan={2}
                  className="text-md text-center border-b text-gray-600 py-2 border-black"
                >
                  {fieldNames.customerDetails}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-gray-600 p-1 text-left pl-2 uppercase">
                  {fieldNames.customerName}
                </td>
                <td className="uppercase font-semibold text-right pr-2">
                  {customer.clientName}
                </td>
              </tr>
              <tr>
                <td className="text-gray-600 pr-4 p-1 text-left pl-2 uppercase">
                  {fieldNames.gstin}
                </td>
                <td className="uppercase font-semibold text-right pr-2">
                  {customer.clientGSTNumber}
                </td>
              </tr>
              <tr>
                <td className="text-gray-600 pr-4 p-1 text-left pl-2 uppercase">
                  {fieldNames.customerTel}
                </td>
                <td className="uppercase font-semibold text-right pr-2">
                  {customer.clientTelephone}
                </td>
              </tr>
              <tr>
                <td className="text-gray-600 pr-4 p-1 text-left pl-2 uppercase">
                  {fieldNames.customerEmail}
                </td>
                <td className="lowercase font-semibold text-right pr-2">
                  {customer.clientEmail}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Invoice Details Section */}
        <div className="w-1/2 border-b border-l border-black">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th
                  colSpan={2}
                  className="text-md text-center border-b text-gray-600 py-2 border-black"
                >
                  {fieldNames.invoiceDetails}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-gray-600 p-1 uppercase text-left pl-2">
                  {fieldNames.invoiceNo}
                </td>
                <td className="uppercase font-semibold text-right pr-2">
                  {invoice.invoiceCustomNumber}
                </td>
              </tr>
              <tr>
                <td className="text-gray-600 p-1 uppercase text-left pl-2">
                  {fieldNames.invoiceCreateDate}
                </td>
                <td className="uppercase font-semibold text-right pr-2">
                  {invoice.creationDate}
                </td>
              </tr>
              <tr>
                <td className="text-gray-600 p-1 uppercase text-left pl-2">
                  {fieldNames.dueDate}
                </td>
                <td className="uppercase font-semibold text-right pr-2">
                  {invoice.dueDate}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="text-center text-xs w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-md text-center border-b text-gray-600 border-black py-2">
                {fieldNames.productDetails}
              </th>
            </tr>
          </thead>
        </table>
      </div>

      {/* Data Section */}
      <div className="border-b border-black">
        <div
          style={{ position: "relative", overflow: "auto", height: "400px" }}
        >
          <table
            style={{
              width: "100%",
              fontSize: "12px",
              color: "black",
              position: "relative",
            }}
          >
            <thead>
              <tr className="border-b border-black">
                <th style={{ textAlign: "center", padding: 0, width: "50px" }}>
                  {fieldNames.srNo}
                </th>
                <th
                  style={{
                    textAlign: "center",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    padding: 0,
                    position: "relative",
                    width: "400px",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      height: "400px",
                      borderLeft: "1px solid black",
                    }}
                  ></div>
                  {fieldNames.productName}
                </th>
                <th
                  style={{
                    textAlign: "center",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    padding: 0,
                    position: "relative",
                    width: "100px",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      height: "400px",
                      borderLeft: "1px solid black",
                    }}
                  ></div>
                  {fieldNames.challanNo}
                </th>
                <th
                  style={{
                    textAlign: "center",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    padding: 0,
                    position: "relative",
                    width: "120px",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      height: "400px",
                      borderLeft: "1px solid black",
                    }}
                  ></div>
                  {fieldNames.qty}
                </th>
                <th
                  style={{
                    textAlign: "center",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    padding: 0,
                    position: "relative",
                    width: "120px",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      height: "400px",
                      borderLeft: "1px solid black",
                    }}
                  ></div>
                  {fieldNames.rate}
                </th>
                <th
                  style={{
                    textAlign: "center",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    padding: 0,
                    position: "relative",
                    width: "120px",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      height: "400px",
                      borderLeft: "1px solid black",
                    }}
                  ></div>
                  {fieldNames.total}
                </th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td
                    style={{
                      padding: "4px",
                      textAlign: "center",
                      fontSize: "14px",
                    }}
                  >
                    {index + 1}
                  </td>
                  <td
                    style={{
                      padding: "4px",
                      textAlign: "center",
                      fontSize: "14px",
                    }}
                  >
                    {item.name || ""}
                  </td>
                  <td
                    style={{
                      padding: "4px",
                      textAlign: "center",
                      fontSize: "14px",
                    }}
                  >
                    {item.challanNumber || "-"}
                  </td>
                  <td
                    style={{
                      padding: "4px",
                      textAlign: "center",
                      fontSize: "14px",
                    }}
                  >
                    {item.qty}
                  </td>
                  <td
                    style={{
                      padding: "4px",
                      textAlign: "center",
                      fontSize: "14px",
                    }}
                  >
                    {formatCurrency(item.rate)}
                  </td>
                  <td
                    style={{
                      padding: "4px",
                      textAlign: "center",
                      fontSize: "14px",
                    }}
                  >
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Total Section */}
      <div className="border-b border-black">
        <table
          style={{
            width: "100%",
            fontSize: "12px",
            color: "black",
            position: "relative",
          }}
        >
          <thead>
            <tr>
              <th style={{ padding: 0, width: "50px" }}></th>
              <th
                style={{ padding: 0, position: "relative", width: "400px" }}
              ></th>
              <th
                style={{ padding: 0, position: "relative", width: "100px" }}
              ></th>
              <th
                style={{ padding: 0, position: "relative", width: "120px" }}
              ></th>
              <th
                style={{ padding: 0, position: "relative", width: "120px" }}
              ></th>
              <th
                style={{ padding: 0, position: "relative", width: "120px" }}
              ></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                style={{
                  padding: "8px",
                  textAlign: "center",
                  fontWeight: "600",
                }}
                colSpan={2}
              >
                {fieldNames.total}
              </td>
              <td
                style={{
                  padding: "8px",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              ></td>
              <td
                style={{
                  padding: "8px",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              ></td>
              <td
                style={{
                  padding: "8px",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                {formatCurrency(totals.totalAmount)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* End Details Section */}
      <div className="flex">
        <div className="flex-1">
          <div className="border-b border-black">
            <p className="text-xs text-gray-600 mb-1 text-center border-b border-black">
              {fieldNames.totalInWords}
            </p>
            <p className="text-xs font-semibold text-gray-800 min-h-[5rem] p-1 uppercase text-start">
              {totalInWords}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-600 text-center border-b border-black">
              {fieldNames.bankDetails}
            </p>
            <div className="flex flex-col p-2 text-xs text-gray-800 uppercase">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600 uppercase">
                  {fieldNames.bankName}
                </span>
                <span className="font-semibold">{bankDetails.bankName}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600 uppercase">
                  {fieldNames.accountNumber}
                </span>
                <span className="font-semibold">
                  {bankDetails.bankAccountNumber}
                </span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600 uppercase">
                  {fieldNames.ifscCode}
                </span>
                <span className="font-semibold">
                  {bankDetails.bankIfscCode}
                </span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600 uppercase">
                  {fieldNames.branchName}
                </span>
                <span className="font-semibold">
                  {bankDetails.bankBranchName}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 border-t border-black w-full">
            <div className="border-b border-black">
              <p className="text-xs text-gray-600 text-center">
                {fieldNames.termsAndConditions}
              </p>
            </div>
            <ul className="list-disc list-inside text-xs text-gray-800 p-2 space-y-1">
              {termsAndConditions.map((term, index) => (
                <li key={index}>{term}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Count Section */}
        <div className="flex-1 border-l border-black">
          <table className="w-full border-collapse">
            <tbody>
              <tr className="text-xs">
                <td className="py-1 px-4 border-r border-black font-semibold text-left uppercase">
                  {fieldNames.discount} ({totals.discountPercent}
                  {totals.discountType === "percentage" ? "%" : "₹"})
                </td>
                <td className="py-1 px-4 font-bold text-right">
                  {formatCurrency(totals.discountApplied)}
                </td>
              </tr>
              <tr className="text-xs">
                <td className="py-1 px-4 border-r border-black font-semibold text-left uppercase">
                  {fieldNames.totalBeforeTax}
                </td>
                <td className="py-1 px-4 font-bold text-right">
                  {formatCurrency(totals.totalBeforeTax)}
                </td>
              </tr>
              <tr className="text-xs">
                <td className="py-1 px-4 border-r border-black font-semibold text-left uppercase">
                  {fieldNames.gst} ({totals.gstPercent}%)
                </td>
                <td className="py-1 px-4 font-bold text-right">
                  {totals.gstAmount}
                </td>
              </tr>
              <tr className="text-xs">
                <td className="py-1 px-4 border-r border-black font-semibold text-left uppercase">
                  {fieldNames.sgst} ({totals.sgstPercent}%)
                </td>
                <td className="py-1 px-4 font-bold text-right">
                  {totals.sgstAmount}
                </td>
              </tr>
              <tr className="text-xs">
                <td className="py-1 px-4 border-r border-black font-semibold text-left uppercase">
                  {fieldNames.otherTax} ({totals.otherTaxPercent}
                  {totals.otherTaxType === "percentage" ? "%" : "₹"})
                </td>
                <td className="py-1 px-4 font-bold text-right">
                  {formatCurrency(totals.otherTaxAmount)}
                </td>
              </tr>
              <tr className="text-xs">
                <td className="px-4 border-r border-black font-semibold text-left uppercase"></td>
                <td className="px-4 border-t border-black font-bold text-right">
                  {formatCurrency(totals.finalAmount)}
                </td>
              </tr>
              <tr className="text-lg border-t border-black">
                <td className="py-1 px-4 border-r border-black font-bold text-center uppercase text-blue-600">
                  {fieldNames.total}
                </td>
                <td className="py-1 px-4 font-bold text-right">
                  {formatCurrency(totals.roundedAmount)}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="border-t border-black">
            <div className="flex flex-col items-center">
              <p className="text-xs text-gray-600 p-1">
                {fieldNames.candidateStatement}
              </p>
              <p className="text-xl font-bold text-gray-800 uppercase">
                {company.companyName}
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="border-t border-black w-full"></div>
              <p className="text-xs text-gray-600 mt-10">
                {fieldNames.authorisedSignature}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormatTest;
