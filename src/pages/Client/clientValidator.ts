import { z } from "zod";

export const clientValidator = z.object({
  clientName: z.string().min(1, { message: "Client name is required" }),
  clientAddress: z.string().optional(),
  clientCity: z.string().optional(),
  clientCountry: z.string().optional(),
  clientState: z.string().optional(),
  clientEmail: z.string().optional(),
  clientPostCode: z.string().optional(),
  clientTelephone: z.string().optional(),
  clientCategory: z.string().optional(),
  clientGSTNumber: z.string().optional(),
});

export type ClientInputs = z.infer<typeof clientValidator>;
