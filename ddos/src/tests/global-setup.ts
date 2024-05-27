import path from "path";

import { Logger, isPortReachable, DockerCompose, KDB } from "@dnb/libs-common";
import * as dockerCompose from "docker-compose";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { v4 } from "uuid";

import { TestConfig } from "./global-config";

module.exports = async () => {
  console.time("global-setup");

  const testConfig = TestConfig();

  if (!testConfig.isInfraSkipped) {
    const dockerDefaultOptions = {
      cwd: path.join(__dirname),
      log: true,
    };

    Logger.init(() => {
      return {
        appEnvironment: testConfig.nodeEnv,
        appRevision: testConfig.serviceVersion,
        appName: "test",
        appStartUpTS: new Date(),
        appId: v4(),
      };
    });

    // Speed up during development, if already live then do nothing
    const isRMQReachable = await isPortReachable(
      testConfig.rabbitMQ.hostname,
      testConfig.rabbitMQ.port
    );

    if (!isRMQReachable) {
      // ️️️Start the infrastructure within a test hook - No failures occur because the DB is down
      await dockerCompose.upAll(dockerDefaultOptions);

      await DockerCompose.waitUntilLog(
        testConfig.rabbitMQ.containerName,
        "Server startup complete",
        {
          dockerOptions: {
            ...dockerDefaultOptions,
            log: false,
          },
        }
      );
    }

    if (!testConfig.isCI) {
      // . Build migrations
      await dockerCompose.buildAll({
        log: true,
        cwd: path.join(__dirname, "../../../databases/satan"),
      });
    }

    // . Wait till migrations passed
    const resMigrations = await dockerCompose.upAll({
      ...dockerDefaultOptions,
      config: path.join(__dirname, "./docker-compose.migrations.yaml"),
    });

    if (resMigrations.exitCode === 1) {
      throw new Error(
        `Migrations has completed with error: ${resMigrations.err}`
      );
    }

    const resFixtures = await dockerCompose.upAll({
      ...dockerDefaultOptions,
      config: path.join(__dirname, "./docker-compose.fixtures.yaml"),
    });

    if (resFixtures.exitCode === 1) {
      throw new Error(
        `Migrations has completed with error: ${resMigrations.err}`
      );
    }

    // . Test connection to PostgreSQL
    const dialect = new PostgresDialect({
      pool: new Pool({
        database: testConfig.mainPg.database,
        connectionString: testConfig.mainPg.uri,
      }),
    });

    const db = new Kysely<KDB>({
      dialect,
    });

    await db.destroy();

    // 👍🏼 We're ready
    console.timeEnd("global-setup");
  }
};
