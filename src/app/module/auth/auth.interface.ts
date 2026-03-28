import { UserRole } from "../../../generated/prisma/enums";

export interface Iregister {
  name: string;
  email: string;
  password: string;
  role?: UserRole
}

export interface Ilogin {
  email: string;
  password: string;
}
