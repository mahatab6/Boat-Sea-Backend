import { z } from "zod";
import { updateProfileZodSchema } from "./user.validation";

export type IUserUpdate = z.infer<
  typeof updateProfileZodSchema
>;