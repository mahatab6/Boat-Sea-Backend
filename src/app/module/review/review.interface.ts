import { z } from "zod";
import { createReviewZodSchema, updateReviewZodSchema } from "./review.validation";


export type IReview = z.infer<typeof createReviewZodSchema>
export type IUpdateReview = z.infer<typeof updateReviewZodSchema>