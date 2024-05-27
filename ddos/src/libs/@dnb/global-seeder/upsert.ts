import { Knex } from "knex";

const insert = async <T extends object>(
  table: Knex.QueryBuilder<T>,
  entity: T | T[]
) => {
  try {
    let entityToCheck: T;

    if (Array.isArray(entity)) {
      if (entity.length === 0) {
        return;
      }

      entityToCheck = entity[0]!;
    } else {
      entityToCheck = entity;
    }

    if ("id" in entityToCheck) {
      // @ts-expect-error: because i can't type this
      await table.insert(entity).onConflict("id").merge();
      return;
    }

    // @ts-expect-error: because i can't type this
    await table.insert(entity);
    return;
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes("duplicate key value")) {
        return;
      }
    }

    throw err;
  }
};

export const upsert = async <T extends object>(
  table: Knex.QueryBuilder<T>,
  entity: T | T[],
  opts?: {
    chunkSize?: number;
  }
) => {
  if (Array.isArray(entity)) {
    if (entity.length === 0) {
      return;
    }

    const chunkSize = opts?.chunkSize ?? 1000;
    if (entity.length > chunkSize) {
      const chunkN = Math.ceil(entity.length / chunkSize);

      for (let i = 0; i < chunkN; i++) {
        await insert(table, entity.slice(chunkSize * i, chunkSize * (i + 1)));
      }

      return;
    }
  }

  await insert(table, entity);

  return;
};
