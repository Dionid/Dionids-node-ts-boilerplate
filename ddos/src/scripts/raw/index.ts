import path from "path";
import { Env, KDB, Logger } from "@dnb/libs-common";
import dotenv from "dotenv";
import { Kysely, PostgresDialect, sql } from "kysely";
import { Pool } from "pg";
import { v4 } from "uuid";

dotenv.config({
  path: path.join(process.cwd(), "src/scripts/raw/.env"),
});

const main = async () => {
  const appId = v4();
  const logger = Logger.init(() => {
    return {
      appName: "sphoenix-sync-seeder",
      appStartUpTS: new Date(),
      appId,
    };
  });

  const getEnvOrThrowWithLog = Env.getEnvOrThrow(console.error);

  const dialect = new PostgresDialect({
    pool: new Pool({
      connectionString: getEnvOrThrowWithLog("DB_CONNECTION_STRING"),
    }),
  });

  const db = new Kysely<KDB>({
    dialect,
  });

  const res = await sql<
    Record<string, string>
  >`SELECT * FROM pg_stat_activity`.execute(db);

  logger.info({ res });

  logger.info("Done");
};

main().catch((err) => {
  // eslint-disable-next-line no-restricted-syntax
  console.error(err);
  process.exit(1);
});
