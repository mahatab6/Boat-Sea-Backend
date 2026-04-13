import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { envVariables } from "../../../config/env";
import status from "http-status";
import { PaymentService } from "./payment.service";
import { sendResponse } from "../../shared/sendResponse";
import { stripe } from "../../../config/stripe.config";
import Stripe from "stripe";
import { IQueryParams } from "../../interface/query.interface";

const handleStripeWebhookEvent = catchAsync(
  async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"] as string;
    const webhookSecret = envVariables.STRIPE_WEB_HOOK;

    if (!signature || !webhookSecret) {
      return res.status(status.BAD_REQUEST).json({
        success: false,
        message: "Missing Stripe signature or webhook secret",
      });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret,
      );
    } catch (error: any) {
      console.error(`❌ Webhook Error: ${error.message}`);
      return res
        .status(status.BAD_REQUEST)
        .send(`Webhook Error: ${error.message}`);
    }

    // Pass the verified event to the service layer
    const result = await PaymentService.handlerStripeWebhookEvent(event);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Stripe webhook event processed successfully",
      data: result,
    });
  },
);

const getPayments = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const payments = await PaymentService.getAllPayments(query as IQueryParams);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "get payments ",
    data: payments.data,
    meta: payments.meta
  });
});

export const PaymentController = {
  handleStripeWebhookEvent,
  getPayments,
};
