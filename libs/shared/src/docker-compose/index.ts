import * as dockerCompose from "docker-compose";

import { InternalError } from "../@dnb";
import { Retry, TooManyRetries } from "../retry";
import { Sleep } from "../sleep";
import mapPorts from "./map-ports";

const nonEmptyString = (v: string) => v !== "";

const newMapPsOutput = (
  output: string,
  options?: dockerCompose.IDockerComposeOptions
): dockerCompose.DockerComposePsResult => {
  let isQuiet = false;

  if (options?.commandOptions) {
    isQuiet =
      options.commandOptions.includes("-q") ||
      options.commandOptions.includes("--quiet") ||
      options.commandOptions.includes("--services");
  }

  const services = output
    .split("\n")
    .filter(nonEmptyString)
    .filter((_, index) => isQuiet || index >= 1)
    .map((line) => {
      let nameFragment = line;
      let commandFragment = "";
      let serviceFragment = "";
      let stateFragment = "";
      let untypedPortsFragment = "";

      if (!isQuiet) {
        [
          //@ts-expect-error: i sure
          nameFragment,
          //@ts-expect-error: i sure
          commandFragment,
          //@ts-expect-error: i sure
          serviceFragment,
          //@ts-expect-error: i sure
          stateFragment,
          //@ts-expect-error: i sure
          untypedPortsFragment,
        ] = line.split(/\s{3,}/);
      }

      return {
        name: nameFragment.trim(),
        command: commandFragment.trim(),
        serviceFragment: serviceFragment.trim(),
        state: stateFragment.trim(),
        ports: mapPorts(untypedPortsFragment.trim()),
      };
    });

  return { services };
};

export const DockerCompose = {
  waitUntilExit: async (options: {
    serviceName: string;
    isDesiredState: (state: string) => boolean;
    isUnDesiredState?: (state: string) => boolean;
    dockerOptions?: dockerCompose.IDockerComposeLogOptions;
  }) => {
    const {
      serviceName,
      isDesiredState: desiredState,
      isUnDesiredState: unDesiredState,
      dockerOptions,
    } = options;

    return Retry.onError(
      async () => {
        const result = await dockerCompose.execCompose("ps", [], dockerOptions);
        const oldPsOutput = dockerCompose.mapPsOutput(
          result.out,
          dockerOptions
        );
        const newPsOutput = newMapPsOutput(result.out, dockerOptions);
        const data = {
          services: [...oldPsOutput.services, ...newPsOutput.services],
        };

        const service = data.services.find((service) => {
          return service.name === serviceName;
        });

        if (!service) {
          throw new Error(`No service with this name: ${serviceName}`);
        }

        if (unDesiredState?.(service.state)) {
          return false;
        }

        if (!desiredState(service.state)) {
          throw new Error("Not in desired state");
        }

        return true;
      },
      {
        total: 5,
        unref: false,
      }
    );
  },
  waitUntilLog: async (
    services: string | string[],
    log: string,
    options: {
      dockerOptions?: dockerCompose.IDockerComposeLogOptions;
      retry?: {
        timeout?: number;
        current?: number;
        total?: number;
      };
    }
  ): Promise<boolean> => {
    const retry = {
      total: 5,
      timeout: 2000,
      current: 0,
      ...options.retry,
    };

    if (retry.current > retry.total) {
      throw new TooManyRetries("Too many retries");
    }

    const res = await dockerCompose.logs(services, options.dockerOptions);

    if (res.err) {
      throw new InternalError(res.err);
    }

    if (res.out.includes(log)) {
      return true;
    }

    await Sleep.run(retry.timeout, { unref: false });

    return DockerCompose.waitUntilLog(services, log, {
      ...options,
      retry: {
        ...retry,
        current: retry.current + 1,
      },
    });
  },
};
