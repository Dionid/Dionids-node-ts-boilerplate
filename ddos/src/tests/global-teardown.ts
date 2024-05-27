import path from "path";

import * as dockerCompose from "docker-compose";

import { TestConfig } from "./global-config";

module.exports = async () => {
  const testConfig = TestConfig();

  if (!testConfig.isInfraSkipped) {
    if (testConfig.isCI) {
      // ️️️✅ Best Practice: Leave the DB up in dev environment
      await dockerCompose.down({
        cwd: path.join(__dirname),
        log: true,
      });
    }
  }
};
