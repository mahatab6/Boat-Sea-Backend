import status from "http-status";
import { Boat, Prisma } from "../../../generated/prisma/client";
import { BoatStatus } from "../../../generated/prisma/enums";
import AppErrors from "../../errorHandler/AppErrors";
import { IQueryParams } from "../../interface/query.interface";
import { IRequestUser } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { boatFilterableFields, boatSearchableFields } from "./boat.constant";
import { ICreateBoat, IUpdateBoat } from "./boat.interface";

const getAllBoats = async (query: IQueryParams) => {
  const queryBuilder = new QueryBuilder<Boat>(prisma.boat, query, {
    searchableFields: boatSearchableFields,
    filterableFields: boatFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .where({ isApproved: true, status: BoatStatus.AVAILABLE })
    .paginate()
    .sort()
    .dynamicInclude(
      {
        owner: true,
        reviews: true,
        schedules: true,
        license: true,
        boat_images: true,
      },
      ["owner"]
    )
    .execute();

  return result;
};

const createBoat = async (owner: IRequestUser, boatData: ICreateBoat) => {
  const id = owner?.id as string;
  const result = await prisma.boat.create({
    data: {
      ownerId: id,
      ...boatData,
    },
  });
  return result;
};

const getBoatById = async (id: string) => {
  const result = await prisma.boat.findFirst({
    where: {
      id,
      isApproved: true,
    },
    include: {
      owner: true,
      reviews: true,
      schedules: true,
      license: true,
      boat_images: true,
    },
  });

  if (!result) {
    throw new AppErrors(status.NOT_FOUND, "Boat not found or not approved");
  }

  return result;
};

const getBoatReviews = async () => {};

const updateBoat = async (
  id: string,
  payload: IUpdateBoat,
  ownerId: string
) => {
  const boat = await prisma.boat.findUnique({
    where: { id },
  });

  if (!boat) {
    throw new AppErrors(status.NOT_FOUND, "Boat not found");
  }

  if (boat.ownerId !== ownerId) {
    throw new AppErrors(
      status.FORBIDDEN,
      "You are not authorized to update this boat"
    );
  }

  const result = await prisma.boat.update({
    where: { id },
    data: payload,
  });

  return result;
};


const deleteBoat = async () => {};
const getMyBoats = async () => {};
const addSchedule = async () => {};
const checkAvailability = async () => {};

export const boatService = {
  getAllBoats,
  createBoat,
  getBoatById,
  getBoatReviews,
  updateBoat,
  deleteBoat,
  getMyBoats,
  addSchedule,
  checkAvailability,
};
