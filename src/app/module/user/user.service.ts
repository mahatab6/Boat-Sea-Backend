import { prisma } from "../../lib/prisma";

const getProfile = async (userId: string) => {
  return await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: {
      bookings: true,
      reviews: true,
    },
  });
};

const updateProfile = async (
  userId: string,
  payload: any
) => {
  return await prisma.user.update({
    where: { id: userId },
    data: payload,
  });
};

const getMyBookings = async (userId: string) => {
  return await prisma.booking.findMany({
    where: { userId },
    include: {
      boat: true,
      schedule: true,
      tickets: true,
    },
  });
};

const getMyReviews = async (userId: string) => {
  return await prisma.review.findMany({
    where: { userId },
    include: {
      boat: true,
    },
  });
};

const getNotifications = async (userId: string) => {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const markNotificationRead = async (
  id: string,
  userId: string
) => {
  return await prisma.notification.updateMany({
    where: {
      id,
      userId,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
};

const deleteAccount = async (userId: string) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      status: "DELETED",
    },
  });
};

export const userService = {
  getProfile,
  updateProfile,
  getMyBookings,
  getMyReviews,
  getNotifications,
  markNotificationRead,
  deleteAccount,
};