import { z } from "zod";

export const challanValidator = z.object({
  companyName: z.string().min(1, { message: "Company name is required" }),
  companyTelephone: z.string().optional(),
  companyEmail: z.string().optional(),
  companyAddress: z.string().min(1, { message: "Company address is required" }),
  companyCity: z.string().optional(),
  companyState: z.string().optional(),
  companyPostCode: z.string().optional(),
  companyCountry: z.string().optional(),
  companyGSTNumber: z.string().optional(),

  clientName: z.string().min(1, { message: "Client name is required" }),
  clientTelephone: z.string().optional(),
  clientEmail: z.string().optional(),
  clientAddress: z.string().optional(),
  clientCity: z.string().optional(),
  clientState: z.string().optional(),
  clientPostCode: z.string().optional(),
  clientCountry: z.string().optional(),
  clientGSTNumber: z.string().optional(),

  challanNumber: z.string().min(1, { message: "Challan number is required" }),
  challanDate: z.date({ message: "Challan date is required" }),
  orderDate: z.date().optional(),
  poNumber: z.string().optional(),

  itemList: z
    .array(
      z.object({
        description: z.string().min(1, { message: "Description is required" }),
        size: z.string().optional(),
        designNumber: z.string().optional(),
        pieces: z.coerce.number().min(0, { message: "Invalid pieces" }),
        quantity: z.coerce.number().min(0.001, { message: "Invalid quantity" }),
        rate: z.coerce.number().min(0, { message: "Invalid rate" }),
      }),
    )
    .min(1, { message: "At least one item is required" }),
});

export type ChallanInputs = z.infer<typeof challanValidator>;
