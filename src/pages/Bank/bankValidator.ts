import { z } from "zod";

export const bankValidator = z.object({
    bankName: z.string().min(1, { message: "Bank name is required" }),
    bankAccountNumber: z.string().min(1, { message: "Bank account number is required" }),
    bankBranchName: z.string().min(1, { message: "Bank branch name is required" }),
    bankIfscCode: z.string().min(1, { message: "Bank IFSC code is required" }),
    bankCity: z.string().optional(),
    bankState: z.string().optional(),
    bankCountry: z.string().optional(),
    bankAddress: z.string().optional(),
    bankPostCode: z.string().optional(),
    bankCategory: z.string().optional(),
});

export type BankInputs = z.infer<typeof bankValidator>;
