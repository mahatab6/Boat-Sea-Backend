import { z } from "zod";
import { UserRole } from "../../../generated/prisma/enums";

export const updateProfileZodSchema = z.object({
  name: z.string().optional(),
  image: z.string().optional(),
});


export const updateRoleValidationSchema = z.object({

    id: z.string(),
    role: z.nativeEnum(UserRole),

});