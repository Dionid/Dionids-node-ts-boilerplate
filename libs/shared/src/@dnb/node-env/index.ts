import { safeGuard } from "../../switch";

export type NodeEnv = "local" | "development" | "production";

export const NodeEnv = {
  fromString: (rawValue: string): NodeEnv => {
    const value: NodeEnv = rawValue as NodeEnv;

    switch (value) {
      case "local":
      case "development":
      case "production":
        break;
      default:
        return safeGuard(value);
    }

    return value;
  },
};
