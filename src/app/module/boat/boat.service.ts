import { BoatStatus } from "../../../generated/prisma/enums";
import { IRequestUser } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { ICreateBoat } from "./boat.interface";


const getAllBoats = async () => {
  const result = await prisma.boat.findMany({
    where:{
      status: BoatStatus.AVAILABLE
    }
  })
  return result;
};


const createBoat = async (owner: IRequestUser, boatData:ICreateBoat) => {
  const id = owner?.id as string
  const result = await prisma.boat.create({
    data: {
      ownerId: id,
      ...boatData
    }
  })
  return result
};


const getBoatById = async () => {};
const getBoatReviews = async () => {};
const updateBoat = async () => {};
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
