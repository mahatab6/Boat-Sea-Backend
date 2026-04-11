import { Route } from "../../../generated/prisma/client";
import { IQueryParams } from "../../interface/query.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { routeFilterableFields, routeSearchableFields } from "./route.constant";
import { IRoute } from "./route.interface";



const createRoute = async (payload: IRoute) => {
  const result = await prisma.route.create({
    data: payload,
  });
  return result;
};

const getAllRoutes = async (query: IQueryParams) => {
   const queryBuilder = new QueryBuilder<Route>(prisma.route, query, {
      searchableFields: routeSearchableFields,
      filterableFields: routeFilterableFields,
    });
  
    const result = await queryBuilder
      .search()
      .filter()
      .paginate()
      .sort()
      .execute();
  
    return result;
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