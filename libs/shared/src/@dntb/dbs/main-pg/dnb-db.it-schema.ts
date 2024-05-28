/* tslint:disable */
/* eslint-disable */

export const SchemaName = "public" as const;

export type MigrationsTableIdColumn = number;
export type MigrationsTableNameColumn = string;
export type MigrationsTableRunOnColumn = Date;

export type MigrationsTable = {
  id: MigrationsTableIdColumn;
  name: MigrationsTableNameColumn;
  runOn: MigrationsTableRunOnColumn;
};

export const MigrationsTableName = "migrations" as const;

export const MigrationsTableIdColumnName = "id" as const;
export const MigrationsTableNameColumnName = "name" as const;
export const MigrationsTableRunOnColumnName = "run_on" as const;

export const MigrationsTableColumnNames = {
  id: MigrationsTableIdColumnName,
  name: MigrationsTableNameColumnName,
  runOn: MigrationsTableRunOnColumnName
} as const;

export type UserTableCreatedAtColumn = Date;
export type UserTableEmailColumn = string;
export type UserTableEmailConfirmedColumn = boolean;
export type UserTableIdColumn = string;
export type UserTablePasswordColumn = string;
export type UserTableUpdatedAtColumn = Date | null;

export type UserTable = {
  createdAt: UserTableCreatedAtColumn;
  email: UserTableEmailColumn;
  emailConfirmed: UserTableEmailConfirmedColumn;
  id: UserTableIdColumn;
  password: UserTablePasswordColumn;
  updatedAt: UserTableUpdatedAtColumn;
};

export const UserTableName = "user" as const;

export const UserTableCreatedAtColumnName = "created_at" as const;
export const UserTableEmailColumnName = "email" as const;
export const UserTableEmailConfirmedColumnName = "email_confirmed" as const;
export const UserTableIdColumnName = "id" as const;
export const UserTablePasswordColumnName = "password" as const;
export const UserTableUpdatedAtColumnName = "updated_at" as const;

export const UserTableColumnNames = {
  createdAt: UserTableCreatedAtColumnName,
  email: UserTableEmailColumnName,
  emailConfirmed: UserTableEmailConfirmedColumnName,
  id: UserTableIdColumnName,
  password: UserTablePasswordColumnName,
  updatedAt: UserTableUpdatedAtColumnName
} as const;

