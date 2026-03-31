import { prisma } from "../../lib/prisma";
import { IRequestUser } from "../../interface/requestUser.interface";
import httpStatus from "http-status";
import { BookingStatus, PaymentStatus, UserRole } from "../../../generated/prisma/enums";
import AppErrors from "../../errorHandler/AppErrors";

const getDashboardStatsData = async (user: IRequestUser) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: { id: user.id }
  });

  switch (userData.role) {
    case UserRole.SUPER_ADMIN:
    case UserRole.ADMIN:
      return getAdminStatsData();
    case UserRole.BOAT_OWNER:
      return getBoatOwnerStatsData(userData.id);
    case UserRole.CUSTOMER:
      return getCustomerStatsData(userData.id);
    default:
      throw new AppErrors(httpStatus.BAD_REQUEST, "Invalid user role");
  }
};

// --- ADMIN / SUPER ADMIN STATS ---
const getAdminStatsData = async () => {
  const totalBookings = await prisma.booking.count();
  const totalBoats = await prisma.boat.count();
  const totalUsers = await prisma.user.count();
  
  const revenueData = await prisma.booking.aggregate({
    _sum: { totalAmount: true },
    where: { paymentStatus: PaymentStatus.PAID }
  });

  const piChartData = await getGlobalBookingStatus();
  const barChartData = await getGlobalMonthlyRevenue();

  return {
    totalBookings,
    totalBoats,
    totalUsers,
    totalRevenue: revenueData._sum.totalAmount || 0,
    piChartData,
    barChartData
  };
};

// --- BOAT OWNER STATS ---
const getBoatOwnerStatsData = async (ownerId: string) => {
  // Owner er under e thaka sob boat er booking count
  const totalBookings = await prisma.booking.count({
    where: { boat: { ownerId } }
  });

  const myBoatsCount = await prisma.boat.count({
    where: { ownerId }
  });

  const revenueData = await prisma.booking.aggregate({
    _sum: { totalAmount: true },
    where: { 
      boat: { ownerId },
      paymentStatus: PaymentStatus.PAID 
    }
  });

  const bookingStatusDistribution = await prisma.booking.groupBy({
    by: ["bookingStatus"],
    where: { boat: { ownerId } },
    _count: { id: true }
  });

  const piChartData = bookingStatusDistribution.map((item) => ({
    status: item.bookingStatus,
    count: item._count.id
  }));

  const barChartData = await prisma.$queryRaw`
    SELECT DATE_TRUNC('month', b."createdAt") AS month,
    CAST(COUNT(b.id) AS INTEGER) AS count
    FROM "Booking" b
    JOIN "Boat" bt ON b."boatId" = bt.id
    WHERE bt."ownerId" = ${ownerId}
    GROUP BY month
    ORDER BY month ASC;
  `;

  return {
    totalBookings,
    myBoatsCount,
    totalEarnings: revenueData._sum.totalAmount || 0,
    piChartData,
    barChartData
  };
};

// --- CUSTOMER STATS (Already Updated) ---
const getCustomerStatsData = async (userId: string) => {
  const totalBookings = await prisma.booking.count({ where: { userId } });
  
  const activeTripCount = await prisma.booking.count({
    where: { 
        userId, 
        bookingStatus: BookingStatus.CONFIRMED,
        tripDate: { gte: new Date() } 
    }
  });

  const totalSpent = await prisma.booking.aggregate({
    _sum: { totalAmount: true },
    where: { userId, paymentStatus: PaymentStatus.PAID }
  });

  const bookingStatusDistribution = await prisma.booking.groupBy({
    by: ["bookingStatus"],
    where: { userId },
    _count: { id: true }
  });

  const piChartData = bookingStatusDistribution.map((item) => ({
    status: item.bookingStatus,
    count: item._count.id
  }));

  const barChartData = await prisma.$queryRaw`
    SELECT DATE_TRUNC('month', "createdAt") AS month,
    CAST(COUNT(*) AS INTEGER) AS count
    FROM "Booking"
    WHERE "userId" = ${userId}
    GROUP BY month
    ORDER BY month ASC;
  `;

  return {
    totalBookings,
    activeTripCount,
    totalSpent: totalSpent._sum.totalAmount || 0,
    piChartData,
    barChartData
  };
};

// Helper Functions for Charts
const getGlobalBookingStatus = async () => {
  const data = await prisma.booking.groupBy({
    by: ["bookingStatus"],
    _count: { id: true }
  });
  return data.map(i => ({ status: i.bookingStatus, count: i._count.id }));
};

const getGlobalMonthlyRevenue = async () => {
  return await prisma.$queryRaw`
    SELECT DATE_TRUNC('month', "createdAt") AS month,
    CAST(SUM("totalAmount") AS FLOAT) AS amount
    FROM "Booking"
    WHERE "paymentStatus" = 'PAID'
    GROUP BY month
    ORDER BY month ASC;
  `;
};

export const statsService = {
  getDashboardStatsData,
};