import { z } from "zod";

export const verifyPaymentSchema =
  z.object({
    transactionId: z.string(),
  });