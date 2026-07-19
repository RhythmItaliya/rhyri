import { Timestamp } from "firebase/firestore";

export type PurchaseBillStatus = "pending" | "paid" | "drafted";

export interface PurchaseBillItem {
  productName: string;
  hsnSac: string;
  qty2?: number;
  quantity: number;
  taxRate: number;
  rate: number;
  gstPercentage: number;
}

export interface PurchaseBill {
  id: string;
  uid: string;
  purchaseBillStatus: PurchaseBillStatus;

  supplierName: string;
  supplierTelephone?: string;
  supplierEmail?: string;
  supplierAddress: string;
  supplierCity?: string;
  supplierState?: string;
  supplierPostCode?: string;
  supplierCountry?: string;
  supplierGSTNumber?: string;
  supplierUdyamNumber?: string;

  buyerName: string;
  buyerTelephone?: string;
  buyerEmail?: string;
  buyerAddress?: string;
  buyerCity?: string;
  buyerState?: string;
  buyerPostCode?: string;
  buyerCountry?: string;
  buyerGSTNumber?: string;

  purchaseBillNumber: string;
  purchaseBillDate: Timestamp;
  paymentTerms: string;
  dueDate: Timestamp;
  vehicleNumber?: string;
  placeOfSupply: string;
  memoType?: string;
  copyType?: string;

  itemList: PurchaseBillItem[];

  bankName?: string;
  bankAccountNumber?: string;
  bankBranchName?: string;
  bankIfscCode?: string;

  amount: number;
}

export interface PurchaseBillHsnSummary {
  hsnSac: string;
  gstPercentage: number;
  taxableValue: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
}

export interface PurchaseBillTotals {
  subtotal: number;
  taxableAmount: number;
  cgstRate: number;
  sgstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  totalGstAmount: number;
  finalAmount: number;
  roundedAmount: number;
  roundOff: number;
  hsnSummary: PurchaseBillHsnSummary[];
}

export interface TransformedPurchaseBillItem extends PurchaseBillItem {
  amount: number;
}

export interface TransformedPurchaseBill {
  supplier: {
    name: string;
    telephone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    postCode: string;
    country: string;
    gstNumber: string;
    udyamNumber: string;
  };
  buyer: {
    name: string;
    telephone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    postCode: string;
    country: string;
    gstNumber: string;
  };
  bill: {
    id: string;
    number: string;
    date: string;
    paymentTerms: string;
    dueDate: string;
    vehicleNumber: string;
    placeOfSupply: string;
    memoType: string;
    copyType: string;
  };
  items: TransformedPurchaseBillItem[];
  totals: PurchaseBillTotals;
  bankDetails: {
    bankName: string;
    bankAccountNumber: string;
    bankBranchName: string;
    bankIfscCode: string;
  };
  totalGstInWords: string;
  billAmountInWords: string;
  termsAndConditions: string[];
}
