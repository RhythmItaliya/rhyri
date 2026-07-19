import { nanoid } from "nanoid";

export const generatePurchaseBillId = () => {
  const currentYear = new Date().getFullYear();
  const randomChars = nanoid(4);
  return `PB${currentYear}-${randomChars}`;
};
