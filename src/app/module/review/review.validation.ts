import { z } from "zod";

export const createReviewZodSchema = z.object({

    boatId: z.string(),
    rating: z.number().min(1).max(5),

    comment: z.string().optional(),

    images: z.array(z.string()).optional(),

});

export const updateReviewZodSchema = z.object({

    rating: z.number().min(1).max(5).optional(),

    comment: z.string().optional(),

    images: z.array(z.string()).optional(),

    isVerified: z.boolean().optional(),
 
});