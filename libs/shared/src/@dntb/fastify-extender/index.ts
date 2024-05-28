import { FastifyInstance } from "fastify";
import pino from "pino";
import { BaseError, InternalError } from "../typed-errors";

export const setErrorHandler = (
  ctx: { logger: pino.Logger; isProd: boolean },
  fastify: FastifyInstance
) => {
  fastify.setErrorHandler(async function (error, request, reply) {
    let code = 400;

    const id = (request.body && (request.body as { id: string }).id) || "";

    let message = "Internal error";

    let data: Record<PropertyKey, unknown> = {};

    const meta =
      (request.body && (request.body as { meta: unknown }).meta) || {};

    if (error instanceof BaseError) {
      code = error.statusCode;
      data = {
        type: error.type,
      };
      message = error.message || message;

      if (error instanceof InternalError) {
        ctx.logger.error(error);
      }
    } else if (!ctx.isProd) {
      message = JSON.stringify(error, Object.getOwnPropertyNames(error));
    } else {
      ctx.logger.error(error);
    }

    await reply.status(code).send({
      id,
      result: {
        $case: "failure",
        failure: {
          code,
          message,
          data,
        },
      },
      meta,
    });
  });
};

export const setHealthCheck = (
  server: FastifyInstance,
  opts: {
    livenessEndpoint?: string;
    readinessEndpoint?: string;
  }
) => {
  server.get(opts.livenessEndpoint ?? "/live", async (_, res) => {
    return res
      .code(200)
      .header("Content-Type", "application/json")
      .send(JSON.stringify({ uptime: process.uptime() | 0 }));
  });

  server.get(opts.readinessEndpoint ?? "/ready", async (request, res) => {
    return res
      .code(200)
      .header("Content-Type", "application/json")
      .send(JSON.stringify({ status: "ready" }));
  });
};
