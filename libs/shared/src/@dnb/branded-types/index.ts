import { v4, validate } from "uuid";
import { z } from "zod";
import { ValidationError } from "../typed-errors";

export type Unbrand<T> = T extends string
  ? string
  : T extends number
  ? number
  : T extends boolean
  ? boolean
  : T extends Date
  ? Date
  : T extends Array<infer AT>
  ? AT[]
  : unknown;

export type Branded<T, BTT extends string | symbol> = T & {
  readonly [key in BTT]: BTT;
};

export type UUID = Branded<string, "UUID">;
export const UuidFactory = <T extends UUID>() => {
  return {
    new: (): T => {
      return v4() as T;
    },
    fromString: (id: string): T => {
      if (!validate(id)) {
        throw new ValidationError("invalid uuid");
      }
      return id as T;
    },
  };
};

export const zUUID = <B extends Branded<any, any>>(uuidFactory: {
  fromString: (val: string) => B;
}) =>
  z.custom<B>(
    (val) => {
      if (typeof val === "string") {
        return !!uuidFactory.fromString(val);
      }

      return false;
    },
    {
      message: "Incorrect id",
    }
  );
