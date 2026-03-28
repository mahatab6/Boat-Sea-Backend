import { BoatStatus, BoatType } from "../../../generated/prisma/enums";

export interface ICreateBoat {
  boatName: string;
  boatType: BoatType;
  status: BoatStatus;
  capacity: number;
  boatCondition: string;
  location: string;
  pricePerTrip: number;
  length: number;
  width: number;
  engineCapacity: number;
  manufacturer: string;
  manufacturingYear: number;
  amenities: string[];
  cancellationPolicy: string;
}