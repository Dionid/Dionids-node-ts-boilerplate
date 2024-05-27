import { Kysely, sql } from "kysely";
import { pino } from "pino";
import { fixedTimeoutBetweenCalls } from "../../retry";
import { Sleep } from "../../sleep";
import { KDB } from "../dbs/main-pg";
import { MigrationsTableDataPrimaryKeys } from "../dbs/main-pg/migrations-table";
import { InternalError } from "../typed-errors";

export const waitUntilAllMigrationsAreDone = async (
  db: Kysely<KDB>,
  logger: pino.Logger,
  maxRetries: number = 10,
  waitFor: (current: number) => number = fixedTimeoutBetweenCalls(5000),
  current: number = 1
): Promise<boolean> => {
  const migrations = await sql<
    Array<Record<string, string>>
  >`select * from migrations;`.execute(db);

  if (migrations.rows.length < MigrationsTableDataPrimaryKeys.length) {
    if (current >= maxRetries) {
      throw new InternalError("Migrations are not done yet");
    }

    await Sleep(waitFor(current));

    return waitUntilAllMigrationsAreDone(
      db,
      logger,
      maxRetries,
      waitFor,
      current + 1
    );
  }

  logger.debug("All migrations are done");

  return true;
};
