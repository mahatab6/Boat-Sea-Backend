import { prisma } from "../../lib/prisma";
import { IRoute } from "./route.interface";



const createRoute = async (payload: IRoute) => {
  const result = await prisma.route.create({
    data: payload,
  });
  return result;
};

const getAllRoutes = async () => {
  return await prisma.route.findMany({
    where: { isActive: true },
    include: { schedules: true } 
  });
};

const getSingleRoute = async (id: string) => {
  return await prisma.route.findUniqueOrThrow({
    where: { id },
  });
};

const updateRoute = async (id: string, payload: Partial<IRoute>) => {
  return await prisma.route.update({
    where: { id },
    data: payload,
  });
};

const deleteRoute = async (id: string) => {
  return await prisma.route.delete({
    where: { id },
  });
};

export const RouteService = {
  createRoute,
  getAllRoutes,
  getSingleRoute,
  updateRoute,
  deleteRoute,
};