import { z } from "zod";

export const clientValidator = z.object({
  clientName: z.string().min(1, { message: "required" }),
  clientEmail: z.string().email({ message: "Invalid email address" }).optional(),
  clientTelephone: z.string()
    .regex(/^\d*$/, { message: "Only numbers are allowed" })
    .optional(),
  clientPostCode: z.string()
    .regex(/^\d*$/, { message: "Only numbers are allowed" })
    .optional(),
  clientAddress: z.string().optional(),
  clientCategory: z.string().optional(),
  clientState: z.string().optional(),
  clientCity: z.string().optional(),
  clientCountry: z.string().optional(),
  clientGSTNumber: z.string().optional(),
});

export type ClientInputs = z.infer<typeof clientValidator>;
