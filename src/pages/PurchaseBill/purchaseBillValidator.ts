import { z } from "zod";

export const purchaseBillValidator = z.object({
  supplierName: z.string().min(1, { message: "Supplier name is required" }),
  supplierTelephone: z.string().optional(),
  supplierEmail: z.string().optional(),
  supplierAddress: z
    .string()
    .min(1, { message: "Supplier address is required" }),
  supplierCity: z.string().optional(),
  supplierState: z.string().optional(),
  supplierPostCode: z.string().optional(),
  supplierCountry: z.string().optional(),
  supplierGSTNumber: z.string().optional(),
  supplierUdyamNumber: z.string().optional(),

  buyerName: z.string().min(1, { message: "Buyer name is required" }),
  buyerTelephone: z.string().optional(),
  buyerEmail: z.string().optional(),
  buyerAddress: z.string().optional(),
  buyerCity: z.string().optional(),
  buyerState: z.string().optional(),
  buyerPostCode: z.string().optional(),
  buyerCountry: z.string().optional(),
  buyerGSTNumber: z.string().optional(),

  purchaseBillNumber: z
    .string()
    .min(1, { message: "Purchase bill number is required" }),
  purchaseBillDate: z.date({ message: "Purchase bill date is required" }),
  paymentTerms: z.string().min(1, { message: "Payment terms are required" }),
  dueDate: z.date({ message: "Due date is required" }),
  vehicleNumber: z.string().optional(),
  placeOfSupply: z.string().min(1, { message: "Place of supply is required" }),
  memoType: z.string().optional(),
  copyType: z.string().optional(),

  itemList: z
    .array(
      z.object({
        productName: z.string().min(1, { message: "Product name is required" }),
        hsnSac: z.string().min(1, { message: "HSN/SAC is required" }),
        qty2: z.coerce.number().min(0).optional(),
        quantity: z.coerce.number().min(0.001, { message: "Invalid quantity" }),
        taxRate: z.coerce.number().min(0, { message: "Invalid tax rate" }),
        rate: z.coerce.number().min(0, { message: "Invalid rate" }),
        gstPercentage: z.coerce
          .number()
          .min(0, { message: "Invalid GST" })
          .max(100, { message: "Invalid GST" }),
      }),
    )
    .min(1, { message: "At least one item is required" }),

  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankBranchName: z.string().optional(),
  bankIfscCode: z.string().optional(),
});

export type PurchaseBillInputs = z.infer<typeof purchaseBillValidator>;
