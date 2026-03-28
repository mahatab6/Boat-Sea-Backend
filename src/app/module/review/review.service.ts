import { prisma } from "../../lib/prisma";
import { IReview, IUpdateReview } from "./review.interface";


const createReview = async (
  userId: string,
  payload: IReview
) => {
  const result = await prisma.review.create({
    data: {
        userId,
      ...payload,
    },
  });

  return result;
};

const getAllReviews = async () => {
  return await prisma.review.findMany({
    include: {
      boat: true,
    },
  });
};

const getSingleReview = async (id: string) => {
  return await prisma.review.findUniqueOrThrow({
    where: { id },
  });
};

const updateReview = async (
  id: string,
  payload: IUpdateReview
) => {
  return await prisma.review.update({
    where: { id },
    data: payload,
  });
};

const deleteReview = async (id: string) => {
  return await prisma.review.delete({
    where: { id },
  });
};

export const ReviewService = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};