import status from "http-status";
import { Boat, Prisma } from "../../../generated/prisma/client";
import { BoatStatus, BookingStatus } from "../../../generated/prisma/enums";
import AppErrors from "../../errorHandler/AppErrors";
import { IQueryParams } from "../../interface/query.interface";
import { IRequestUser } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { boatFilterableFields, boatSearchableFields } from "./boat.constant";
import { ICreateBoat, ICreateSchedule, IUpdateBoat } from "./boat.interface";
import { deleteFileFromCloudinary } from "../../../config/cloudinary.config";

const getAllBoats = async (query: IQueryParams) => {
  const queryBuilder = new QueryBuilder<Boat>(prisma.boat, query, {
    searchableFields: boatSearchableFields,
    filterableFields: boatFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .where({status: BoatStatus.AVAILABLE })
    .paginate()
    .sort()
    .execute();

  return result;
};

const featuredBoats = async () => {
  const result = await prisma.boat.findMany({
    where: {
      isApproved: true,
      status: BoatStatus.AVAILABLE
    },
    orderBy: {
      rating: 'desc'
    },
    take: 6
  })
  return result;
};

const createBoat = async (
  owner: IRequestUser,
  boatData: ICreateBoat,
 
) => {

  const ownerId = owner.id;

  const result = await prisma.boat.create({
    data: {
      ...boatData,
      ownerId: ownerId,
    }
  })

  return result;
};

const getBoatById = async (id: string) => {
  const result = await prisma.boat.findFirst({
    where: {
      id,
    },
    // include: {
    //   owner: true,
    //   reviews: true,
    //   schedules: true,
    //   license: true,
    //   boat_images: true,
    // },
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

const deleteBoat = async (id: string, ownerId: string) => {
  const boat = await prisma.boat.findUnique({
    where: { id },
  });

  if (!boat) {
    throw new AppErrors(status.NOT_FOUND, "Boat not found");
  }

  if (boat.ownerId !== ownerId) {
    throw new AppErrors(
      status.FORBIDDEN,
      "Unauthorized action"
    );
  }

  const activeBooking = await prisma.booking.findFirst({
    where: {
      boatId: id,
      bookingStatus: BookingStatus.CONFIRMED
    },
  });

  if (activeBooking) {
    throw new AppErrors(
      status.BAD_REQUEST,
      "Boat has active bookings"
    );
  }

  if(boat.primary_img){
    await deleteFileFromCloudinary(boat.primary_img)
  }

  const result = await prisma.boat.delete({
    where: {
      id: id
    }
  })
  return result;
};

const getMyBoats = async (
  ownerId: string,
  query: IQueryParams
) => {
  const queryBuilder = new QueryBuilder<Boat>(
    prisma.boat,
    query,
    {
      searchableFields: boatSearchableFields,
      filterableFields: boatFilterableFields,
    }
  );

  const result = await queryBuilder
    .where({ ownerId })
    .search()
    .filter()
    .paginate()
    .sort()
    .dynamicInclude(
      {
        reviews: true,
        schedules: true,
        license: true,
        boat_images: true,
      },
      ["boat_images"] 
    )
    .execute();

  return result;
};





export const boatService = {
  getAllBoats,
  createBoat,
  getBoatById,
  getBoatReviews,
  updateBoat,
  deleteBoat,
  getMyBoats,
  featuredBoats
};
