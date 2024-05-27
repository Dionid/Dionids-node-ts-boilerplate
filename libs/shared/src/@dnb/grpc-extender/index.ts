import {
  CallContext,
  ServerError,
  ServerMiddlewareCall,
  Status,
} from "nice-grpc";
import pino from "pino";
import { BaseError, InternalError } from "../typed-errors";

export const mapHttpStatusToGrpcStatus = (status: number): Status => {
  switch (status) {
    case 200:
      return Status.OK;
    case 400:
      return Status.INVALID_ARGUMENT;
    case 401:
      return Status.UNAUTHENTICATED;
    case 403:
      return Status.PERMISSION_DENIED;
    case 404:
      return Status.NOT_FOUND;
    case 409:
      return Status.ALREADY_EXISTS;
    case 500:
      return Status.INTERNAL;
    default:
      return Status.UNKNOWN;
  }
};

export const errorHandlingMiddleware = (deps: {
  logger: pino.Logger;
  isProd: boolean;
}) => {
  return async function* errorHandlingMiddleware<Request, Response>(
    call: ServerMiddlewareCall<Request, Response>,
    context: CallContext
  ) {
    try {
      return yield* call.next(call.request, context);
    } catch (error: unknown) {
      if (error instanceof ServerError) {
        throw error;
      }

      let code = Status.INTERNAL;
      let message = "Internal error";

      if (error instanceof BaseError) {
        code = mapHttpStatusToGrpcStatus(error.statusCode);
        message = error.message || message;

        if (error instanceof InternalError) {
          deps.logger.error(error);
        }
      } else if (!deps.isProd) {
        message = JSON.stringify(error, Object.getOwnPropertyNames(error));
      } else {
        deps.logger.error(error);
      }

      throw new ServerError(code, message);
    }
  };
};
