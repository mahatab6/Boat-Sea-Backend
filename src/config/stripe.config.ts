import Stripe from "stripe";
import { envVariables } from "./env";

export const stripe = new Stripe(envVariables.STRIPE_SECRET_KEY)