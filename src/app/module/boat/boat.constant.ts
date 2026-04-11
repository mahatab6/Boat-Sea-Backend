import { Prisma } from "../../../generated/prisma/client";

export const boatSearchableFields = ['boatName', 'location'];

export const boatFilterableFields = [
  'status', 
  'boatType',
  'pricePerTrip', 
  'manufacturer', 
  'rating',       
  'type',
  'capacity'
];
