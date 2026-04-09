import { User } from "../../../generated/prisma/client";
import { UserRole, UserStatus } from "../../../generated/prisma/enums";
import { IQueryParams } from "../../interface/query.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userFilterableFields, userSearchableFields } from "./user.constant";

const getProfile = async (userId: string) => {
  return await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: {
      bookings: true,
      reviews: true,
    },
  });
};

const getAlluser = async (query: IQueryParams) => {
  const queryBuilder = new QueryBuilder<User>(prisma.user, query, {
    searchableFields: userSearchableFields,
    filterableFields: userFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .paginate()
    .sort()
    .execute();

  return result;
};

const updateProfile = async (userId: string, payload: any) => {
  return await prisma.user.update({
    where: { id: userId },
    data: payload,
  });
};

const updateRole = async (userId: string, role: string) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      role,
    },
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

const markNotificationRead = async (id: string, userId: string) => {
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
      status: UserStatus.SUSPENDED,
    },
  });
};

export const userService = {
  getProfile,
  getAlluser,
  updateProfile,
  updateRole,
  getMyBookings,
  getMyReviews,
  getNotifications,
  markNotificationRead,
  deleteAccount,
};
