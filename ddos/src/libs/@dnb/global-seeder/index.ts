import { KDB } from "@dnb/libs-common";
import { Kysely } from "kysely";

export const GlobalSeeder = {
  run: async (db: Kysely<KDB>) => {
    return {};
  },
};
