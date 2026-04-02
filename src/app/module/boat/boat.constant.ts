import { Prisma } from "../../../generated/prisma/client";

export const boatSearchableFields = ['boatName', 'location'];

export const boatFilterableFields = [
  'status', 
  'pricePerTrip', 
  'manufacturer', 
  'rating',       
  'type'
];
