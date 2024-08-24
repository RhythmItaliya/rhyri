import { z } from "zod";

export const clientValidator = z.object({
  clientName: z.string().min(1, { message: "Client name is required" }),
  clientAddress: z.string().min(1, { message: "Client address is required" }),
  clientCity: z.string().min(1, { message: "Client city is required" }),
  clientCountry: z.string().min(1, { message: "Client country is required" }),
  clientState: z.string().min(1, { message: "Client state is required" }),
  clientEmail: z.string().optional(),
  clientPostCode: z.string().optional(),
  clientTelephone: z.string().optional(),
  clientCategory: z.string().optional(),
  clientGSTNumber: z.string().optional(),
});

export type ClientInputs = z.infer<typeof clientValidator>;
