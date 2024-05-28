/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 } from "uuid";
import { z } from "zod";

// # Utils

// ## zod schema parser
export type SchemaParserResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: Error;
    };

export type SchemaParser<T> = {
  safeParse: (data: unknown) => SchemaParserResult<T>;
};

export type Empty = Record<string, never>;

export const Empty = {
  safeParse: (data: unknown): SchemaParserResult<Empty> => {
    if (typeof data === "object" && data !== null) {
      return { success: false, error: new Error("Expected empty object") };
    }

    return { success: true, data: {} };
  },
};

export const zEmpty = z.object({});

// # Message
export type MessageMeta = {
  traceId: string;
  ts: number;
  sid?: string;
};

// # Calls

export type CallRequest<
  Name extends string,
  Params extends Record<PropertyKey, unknown>
> = {
  id: string;
  name: Name;
  params: Params;
  meta: MessageMeta;
};

export type CallResponseDefaultFailure<
  Data extends Record<PropertyKey, any> | undefined = undefined
> = {
  code: number;
  message: string;
  data?: Data;
};

export type CallResponseResult<
  Success extends Record<PropertyKey, any> = Empty,
  Failure extends CallResponseDefaultFailure = CallResponseDefaultFailure
> =
  | { $case: "success"; success: Success }
  | { $case: "failure"; failure: Failure };

export type CallResponse<
  Success extends Record<PropertyKey, any> = Empty,
  Failure extends CallResponseDefaultFailure = CallResponseDefaultFailure
> = {
  id: string;
  result: CallResponseResult<Success, Failure>;
  // meta: MessageMeta;
};

export type Call<
  Name extends string,
  Params extends Record<PropertyKey, any>,
  Success extends Record<PropertyKey, any> = Empty,
  Failure extends CallResponseDefaultFailure = CallResponseDefaultFailure
> = {
  name: Name;
  description: string;
  request: (
    params: Params,
    meta?: Partial<MessageMeta>
  ) => CallRequest<Name, Params>;
  requestValidated: (
    params: Params,
    meta?: Partial<MessageMeta>
  ) => CallRequest<Name, Params>;
  validateRequest: (val: unknown) => CallRequest<Name, Params> | Error;
  validateResponse: (val: unknown) => CallResponse<Success, Failure> | Error;
  response: (
    requestOrId: string | CallRequest<Name, Params>,
    result: CallResponseResult<Success, Failure>,
    meta?: Partial<MessageMeta>
  ) => CallResponse<Success, Failure>;
  success: (
    requestOrId: string | CallRequest<Name, Params>,
    success: Success,
    meta?: Partial<MessageMeta>
  ) => CallResponse<Success, Failure>;
  failure: (
    requestOrId: string | CallRequest<Name, Params>,
    failure: Failure,
    meta?: Partial<MessageMeta>
  ) => CallResponse<Success, Failure>;
};

export function Call<
  Name extends string,
  Params extends Record<PropertyKey, any>,
  Success extends Record<PropertyKey, any>,
  Failure extends CallResponseDefaultFailure = CallResponseDefaultFailure
>(opts: {
  name: Name;
  description?: string;
  paramsSchema?: SchemaParser<Params>;
  successSchema?: SchemaParser<Success>;
  failureSchema?: SchemaParser<Failure>;
}): Call<Name, Params, Success, Failure> {
  const { name, description } = opts;

  const validateRequest = (val: unknown): CallRequest<Name, Params> | Error => {
    if (val === undefined || val === null) {
      return new Error("Request is undefined or null");
    }

    if (typeof val !== "object") {
      return new Error("Request is not an object");
    }

    if (!("id" in val) || typeof val.id !== "string") {
      return new Error("Request.id is not a string");
    }

    if (!("name" in val) || typeof val.name !== "string") {
      return new Error("Request.name is not a string");
    }

    if (!("params" in val) || typeof val.params !== "object") {
      return new Error("Request.params is not an object");
    }

    if (!("meta" in val) || typeof val.meta !== "object") {
      return new Error("Request.meta is not an object");
    }

    if (val.name !== name) {
      return new Error(`Request.name is not equal to ${name}`);
    }

    if (opts.paramsSchema) {
      const res = opts.paramsSchema.safeParse(val.params);

      if (!res.success) {
        return res.error;
      }
    }

    return val as CallRequest<Name, Params>;
  };

  const validateResponse = (
    val: unknown
  ): CallResponse<Success, Failure> | Error => {
    if (val === undefined || val === null) {
      return new Error("Request is undefined or null");
    }

    if (typeof val !== "object") {
      return new Error("Request is not an object");
    }

    if (!("id" in val) || typeof val.id !== "string") {
      return new Error("Request.id is not a string");
    }

    if (!("result" in val) || typeof val.result !== "object") {
      return new Error("Request.result is not an object");
    }

    if (opts.successSchema && val.result && "success" in val.result) {
      const res = opts.successSchema.safeParse(val.result.success);

      if (!res.success) {
        return res.error;
      }
    }

    return val as CallResponse<Success, Failure>;
  };

  const request = (
    params: Params,
    meta?: Partial<MessageMeta>
  ): CallRequest<Name, Params> => {
    return {
      id: v4(),
      name,
      params,
      meta: {
        traceId: meta?.traceId ?? v4(),
        ts: Date.now(),
        sid: meta?.sid,
      },
    };
  };

  const requestValidated = (
    params: Params,
    meta?: Partial<MessageMeta>
  ): CallRequest<Name, Params> => {
    const req = request(params, meta);

    const validation = validateRequest(req);

    if (validation instanceof Error) {
      throw validation;
    }

    return validation;
  };

  const response = (
    requestOrId: string | CallRequest<Name, Params>,
    result: CallResponseResult<Success, Failure>,
    meta?: Partial<MessageMeta>
  ) => {
    const isString = typeof requestOrId === "string";

    return {
      id: isString ? requestOrId : requestOrId.id,
      result,
      meta: {
        traceId: meta?.traceId ?? (!isString ? requestOrId.meta.traceId : v4()),
        ts: Date.now(),
        sid: meta?.sid ?? (!isString ? requestOrId.meta.sid : undefined),
      },
    };
  };
  const success = (
    requestOrId: string | CallRequest<Name, Params>,
    success: Success
  ): CallResponse<Success, Failure> => {
    const isString = typeof requestOrId === "string";

    return {
      id: isString ? requestOrId : requestOrId.id,
      result: { $case: "success", success },
    };
  };

  const failure = (
    requestOrId: string | CallRequest<Name, Params>,
    failure: Failure
  ): CallResponse<Success, Failure> => {
    const isString = typeof requestOrId === "string";

    return {
      id: isString ? requestOrId : requestOrId.id,
      result: { $case: "failure", failure },
    };
  };

  return {
    name,
    description: description ?? "",
    request,
    requestValidated,
    validateRequest,
    response,
    validateResponse,
    success,
    failure,
  };
}

export type RequestFromCall<C extends Call<any, any, any>> = ReturnType<
  C["request"]
>;
export type ResponseFromCall<C extends Call<any, any, any>> = ReturnType<
  C["response"]
>;

export type CallHandler<
  Ctx extends Record<PropertyKey, any>,
  C extends Call<any, any, any>
> = (ctx: Ctx, request: RequestFromCall<C>) => Promise<ResponseFromCall<C>>;

// # Events

export type EventMessage<
  Name extends string,
  Payload extends Record<PropertyKey, any>
> = {
  id: string;
  name: Name;
  payload: Payload;
  meta: MessageMeta;
};

export type Event<
  Name extends string,
  Payload extends Record<PropertyKey, any>
> = {
  new: (
    payload: Payload,
    meta?: Partial<MessageMeta>
  ) => EventMessage<Name, Payload>;
  newValidated: (
    payload: Payload,
    meta?: Partial<MessageMeta>
  ) => EventMessage<Name, Payload> | Error;
  validate: (val: unknown) => EventMessage<Name, Payload> | Error;
  name: Name;
};

export const Event = <
  Name extends string,
  Payload extends Record<PropertyKey, any>
>(opts: {
  name: Name;
  payloadSchema?: SchemaParser<Payload>;
}): Event<Name, Payload> => {
  const { name } = opts;

  const createNew = (payload: Payload, meta?: Partial<MessageMeta>) => {
    return {
      id: v4(),
      name,
      payload,
      meta: {
        traceId: meta?.traceId ?? v4(),
        ts: Date.now(),
        sid: meta?.sid,
      },
    };
  };

  const validate = (val: unknown): EventMessage<Name, Payload> | Error => {
    if (val === undefined || val === null) {
      return new Error("Event is undefined or null");
    }

    if (typeof val !== "object") {
      return new Error("Event is not an object");
    }

    if (!("id" in val) || typeof val.id !== "string") {
      return new Error("Event.id is not a string");
    }

    if (!("name" in val) || typeof val.name !== "string") {
      return new Error("Event.name is not a string");
    }

    if (!("payload" in val) || typeof val.payload !== "object") {
      return new Error("Event.payload is not an object");
    }

    if (!("meta" in val) || typeof val.meta !== "object") {
      return new Error("Event.meta is not an object");
    }

    if (val.name !== name) {
      return new Error(`Event.name is not equal to ${name}`);
    }

    if (opts.payloadSchema) {
      const res = opts.payloadSchema.safeParse(val.payload);

      if (!res.success) {
        return res.error;
      }
    }

    return val as EventMessage<Name, Payload>;
  };

  const newValidated = (
    payload: Payload,
    meta?: Partial<MessageMeta>
  ): EventMessage<Name, Payload> | Error => {
    const req = createNew(payload, meta);

    const validation = validate(req);

    if (validation instanceof Error) {
      return validation;
    }

    return validation;
  };

  return {
    name,
    new: createNew,
    newValidated,
    validate,
  };
};
