import { nanoid } from "nanoid";

export const generateChallanId = () => {
  const currentYear = new Date().getFullYear();
  const randomChars = nanoid(4);
  return `CH${currentYear}-${randomChars}`;
};
