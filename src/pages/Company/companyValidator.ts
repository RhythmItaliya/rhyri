import { z } from "zod";

export const companyValidator = z.object({
  companyName: z.string().min(1, { message: "Company name is required" }),
  companyEmail: z.string().email({ message: "Invalid email address" }),
  companyTelephone: z.string()
  .regex(/^\d+$/, { message: "Only numbers are allowed" })
  .min(1, { message: "Telephone number is required" }),
  companyAddress: z.string().min(1, { message: "Address is required" }),
  companyTagline: z.string().min(1, { message: "Tagline is required" }),
  companyState: z.string().min(1, { message: "State is required" }),
  companyCity: z.string().min(1, { message: "City is required" }),
  companyPostCode: z.string()
  .regex(/^\d+$/, { message: "Only numbers are allowed" })
  .min(1, { message: "required" }),
  companyCountry: z.string().min(1, { message: "Country is required" }),
  companyGSTNumber: z.string().min(1, { message: "GST number is required" }),
  companyPersonName: z.string().min(1, { message: "Person name is required" }),
  CompanyCategory: z.string().optional(),
});

export type CompanyInputs = z.infer<typeof companyValidator>;
