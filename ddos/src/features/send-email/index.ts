import { Call, CallHandler, zEmpty } from "@dnb/libs-common";
import { z } from "zod";
import { FeaturesCtx } from "../ctx";

export const SendEmailCall = Call({
  name: "SendEmail",
  paramsSchema: z.object({
    email: z.string(),
  }),
  successSchema: zEmpty,
});

export const SendEmailCallHandler: CallHandler<
  FeaturesCtx,
  typeof SendEmailCall
> = async (ctx, request) => {
  return SendEmailCall.success(request, {});
};
