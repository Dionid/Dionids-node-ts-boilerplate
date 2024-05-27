import { KDB } from "@dnb/libs-common";
import { Kysely } from "kysely";
import pino from "pino";

export type FeaturesCtx = {
  logger: pino.Logger;
  db: Kysely<KDB>;
};
