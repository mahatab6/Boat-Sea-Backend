import { prisma } from "../../lib/prisma";
import { IReview, IUpdateReview } from "./review.interface";

const createReview = async (
  userId: string,
  payload: {
    boatId: string;
    rating: number;
    comment: string;
    images?: string[];
  },
) => {
  return await prisma.$transaction(async (tx) => {
    const newReview = await tx.review.create({
      data: {
        userId,
        ...payload,
      },
    });

    const aggregate = await tx.review.aggregate({
      where: { boatId: payload.boatId },
      _avg: { rating: true },
      _count: { id: true },
    });

    const newAvgRating = aggregate._avg.rating || 0;
    const newTotalReviews = aggregate._count.id || 0;

    await tx.boat.update({
      where: { id: payload.boatId },
      data: {
        rating: newAvgRating,
        totalReviews: newTotalReviews,
      },
    });

    return newReview;
  });
};

const getAllReviews = async () => {
  const reviews = await prisma.review.findMany({
    where:{
      isVerified: true
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6
  });

  return reviews.map((review) => ({
    id: review.id,

    reviewerName: review.user?.name ?? "Anonymous",

    reviewerImage: review.user?.image ?? null,

    boatId: review.boatId,

    rating: review.rating,

    comment: review.comment ?? "No comment provided",

    images: review.images ?? [],

    isVerified: review.isVerified,

    createdAt: review.createdAt,
  }));
};

const getSingleReview = async (id: string) => {
  const results = await prisma.review.findMany({
    where: {
      boatId: id,
      isVerified: true
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

   return results.map((result) => ({
    id: result.id,

    reviewerName: result.user?.name ?? "Anonymous",

    reviewerImage: result.user?.image ?? null,

    boatId: result.boatId,

    rating: result.rating,

    comment: result.comment ?? "No comment provided",

    images: result.images ?? [],

    isVerified: result.isVerified,

    createdAt: result.createdAt,
  }));
};

const updateReview = async (id: string, payload: IUpdateReview) => {
  return await prisma.review.update({
    where: { id },
    data: payload,
  });
};

const myReview = async (userId: string) => {
    const reviews = await prisma.review.findMany({
    where:{
      userId
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10
  });

  return reviews.map((review) => ({
    id: review.id,

    reviewerName: review.user?.name ?? "Anonymous",

    reviewerImage: review.user?.image ?? null,

    boatId: review.boatId,

    rating: review.rating,

    comment: review.comment ?? "No comment provided",

    images: review.images ?? [],

    isVerified: review.isVerified,

    createdAt: review.createdAt,
  }));
};



const deleteReview = async (id: string) => {
  return await prisma.review.delete({
    where: { id },
  });
};

export const ReviewService = {
  createReview,
  myReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
