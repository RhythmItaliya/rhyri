import { Timestamp } from "firebase/firestore"

interface ItemList {
  item: string
  quantity: number
  price: number
}

export type InvoiceStatus = "pending" | "paid" | "drafted"

export interface Invoice {
  id: string
  uid: string
  invoiceDate: Timestamp
  paymentTerms: string
  invoiceStatus: InvoiceStatus

  companyName: string;
  companyEmail: string;
  companyTelephone: string;
  companyAddress: string;
  companyState: string;
  companyCity: string;
  companyPostCode: string;
  companyCountry: string;
  companyTagline: string;
  companyGSTNumber: string;
  companyPersonName: string;

  clientName: string
  clientEmail: string
  clientAddress: string
  clientCity: string
  clientPostCode: string
  clientCountry: string
  clientGSTNumber?: string;
  clientTelephone?: string;

  invoiceCustomNumber: string;
  challanNumber: string;
  dueDate: Timestamp;
  rateTotal: number;
  qtyTotal: number;

  serviceDescription: string
  itemList: ItemList[]

  amount: number;

  discountType: DiscountType;
  discountPercentage?: number;
  discountAmount?: number;
  gst: number;
  sgst: number;

  otherTaxType: DiscountType;
  otherTaxPercentage?: number;
  otherTaxAmount: number;

  bankAccountNumber?: string;
  bankName?: string;
  bankBranchName?: string;
  bankIfscCode?: string;

}

export type ClientCategory = "regular" | "premium" | "vip"

export interface Client {
  id: string;
  clientName: string;
  clientEmail: string;
  clientTelephone?: string;
  clientStreetAddress?: string;
  clientCity?: string;
  clientPostCode?: string;
  clientCountry?: string;
  uid: string;
  clientCategory?: ClientCategory;
  clientState?: string;
  clientAddress?: string;
  clientGSTNumber?: string;
}

export type CompanyCategory = "startup" | "enterprise" | "smallBusiness"

export interface Company {
  id: string;
  companyName: string;
  companyEmail: string;
  companyTelephone?: string;
  companyCity?: string;
  companyPostCode?: string;
  companyCountry?: string;
  uid: string;
  companyTagline?: string;
  companyState?: string;
  companyAddress?: string;
  companyGSTNumber?: string;
  companyPersonName?: string;
  companyCategory?: CompanyCategory;
}

export interface DownloadInvoiceParams {
  invoiceId: string;
  uid: string;
  onProgress: (progress: string) => void;
  signal: AbortSignal | null;
}


export type BankCategory = "Savings" | "Current" | "Fixed";

export interface Bank {
  id: string;
  bankName: string;
  bankAccountNumber?: string;
  bankBranchName?: string;
  bankIfscCode?: string;
  bankAddress?: string;
  bankCity?: string;
  bankPostCode?: string;
  bankCountry?: string;
  bankState?: string;
  uid: string;
  bankCategory?: BankCategory;
}
