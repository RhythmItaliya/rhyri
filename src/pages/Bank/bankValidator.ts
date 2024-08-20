import { z } from "zod";

export const bankValidator = z.object({
    bankName: z.string().min(1, { message: "Bank name is required" }),
    bankAccountNumber: z.string().min(1, { message: "Account number is required" }),
    bankBranchName: z.string().min(1, { message: "Branch name is required" }),
    bankIfscCode: z.string().min(1, { message: "IFSC code is required" }),
    bankAddress: z.string().optional(),
    bankCity: z.string().optional(),
    bankState: z.string().optional(),
    bankPostCode: z.string().optional(),
    bankCountry: z.string().optional(),
    bankCategory: z.string().optional(),
});

export type BankInputs = z.infer<typeof bankValidator>;
