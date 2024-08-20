import { z } from "zod"

export const invoiceValidator = z.object({
  companyName: z.string().min(1, { message: "required" }),
  companyEmail: z.string().email({ message: "Invalid email address" }),
  companyTelephone: z.string().min(1, { message: "required" }),
  companyAddress: z.string().min(1, { message: "required" }),
  companyState: z.string().min(1, { message: "required" }),
  companyCity: z.string().min(1, { message: "required" }),
  companyPostCode: z.string().min(1, { message: "required" }),
  companyCountry: z.string().min(1, { message: "required" }),
  companyTagline: z.string().optional(),
  companyGSTNumber: z.string().min(1, { message: "required" }),
  companyPersonName: z.string().min(1, { message: "required" }),

  clientName: z.string().min(1, { message: "Client name is required" }),
  clientEmail: z.string().email({ message: "Invalid email address" }).optional(),
  clientAddress: z.string().optional(),
  clientCity: z.string().optional(),
  clientGSTNumber: z.string().optional(),
  clientTelephone: z.string().optional(),
  clientPostCode: z.string().optional(),
  clientCountry: z.string().optional(),

  invoiceDate: z.date({ required_error: "An invoice date is required" }),

  paymentTerms: z.string().min(1, { message: "required" }),

  serviceDescription: z.string().min(1, { message: "required" }),

  itemList: z
    .array(
      z.object({
        item: z.string().min(1, { message: "required" }),
        quantity: z.coerce.number().min(1, { message: "invalid" }),
        price: z.coerce.number().min(1, { message: "invalid" }),
      })
    )
    .min(1, {
      message: "At least one item is required.",
    }),

  invoiceCustomNumber: z.string().min(1, { message: "required" }),
  rateTotal: z.coerce.number().min(0, { message: "Invalid Rate Total" }).default(0),
  qtyTotal: z.coerce.number().min(0, { message: "Invalid Qty tax" }).default(0),
  challanNumber: z.string().min(1, { message: "required" }),

  dueDate: z.date({ required_error: "An due date is required" }),

  discountType: z.enum(["percentage", "fixed"]),
  discountPercentage: z.coerce.number().min(0, { message: "Invalid discount percentage" }).default(0),
  discountAmount: z.coerce.number().min(0, { message: "Invalid discount amount" }).default(0),
  gst: z.coerce.number().min(0, { message: "Invalid GST" }).default(0),
  sgst: z.coerce.number().min(0, { message: "Invalid SGST" }).default(0),
  otherTaxType: z.enum(["percentage", "fixed"]),
  otherTaxPercentage: z.coerce.number().min(0, { message: "Invalid discount percentage" }).default(0),
  otherTaxAmount: z.coerce.number().min(0, { message: "Invalid other tax" }).default(0),

})

export type InvoiceInputs = z.infer<typeof invoiceValidator>