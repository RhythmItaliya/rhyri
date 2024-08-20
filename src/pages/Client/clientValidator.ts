import { z } from "zod";

export const clientValidator = z.object({
  clientName: z.string().min(1, { message: "Client name is required" }),
  clientEmail: z.string().email({ message: "Invalid email address" }).optional(),
  clientTelephone: z.string().optional(),
  clientAddress: z.string().optional(),
  clientCategory: z.string().optional(),
  clientState: z.string().optional(),
  clientCity: z.string().optional(),
  clientPostCode: z.string().optional(),
  clientCountry: z.string().optional(),
  clientGSTNumber: z.string().optional(),
});

export type ClientInputs = z.infer<typeof clientValidator>;
