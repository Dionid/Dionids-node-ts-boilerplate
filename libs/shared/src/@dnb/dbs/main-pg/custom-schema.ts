import { Insertable, Kysely, Selectable, Updateable } from "kysely";
import { Override } from "../../../typing";
import { Branded, UUID, UuidFactory, zUUID } from "../../branded-types";
import { UserTable as UserT } from "./dnb-db.it-schema";

export const UserId = UuidFactory();
export type UserId = Branded<UUID, "UserId">;
export const zUserId = zUUID(UserId);

export type UserTable = Override<
  UserT,
  {
    id: UserId;
  }
>;

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type ChangeUser = Updateable<UserTable>;

export type DatabaseSchema = {
  user: UserTable;
};

export type KDB = Kysely<DatabaseSchema>;
