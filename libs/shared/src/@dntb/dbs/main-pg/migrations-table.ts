/* tslint:disable */
/* eslint-disable */

export type MigrationsTableData = typeof MigrationsTableData;
export const MigrationsTableData = {
  "1": {
    id: 1,
    name: "/20230130102000-create-extension-pgcrypto",
  },
  "2": {
    id: 2,
    name: "/20230130102099-create-set-updated-at-function",
  },
  "3": {
    id: 3,
    name: "/20240208081029-create-user",
  },
} as const;

export type MigrationsTableDataPrimaryKeys =
  (typeof MigrationsTableDataPrimaryKeys)[number];
export const MigrationsTableDataPrimaryKeys = [1, 2, 3] as const;
