/* eslint-disable no-console */
import dotenv from 'dotenv';
import { Migrator, Kysely, PostgresDialect, FileMigrationProvider } from 'kysely';
import { Pool } from 'pg';

import { promises as fs } from 'fs';
import path from 'path';

dotenv.config();

const databaseConnectionString = process.env.SUPABASE_DATABASE_CONNECTION_STRING;
const databaseSslCertificate = process.env.SUPABASE_DATABASE_SSL_CERTIFICATE;

const databaseConnection = new Kysely({
  dialect: new PostgresDialect({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    pool: new Pool({
      connectionString: databaseConnectionString,
      ssl: { ca: databaseSslCertificate },
    }),
  }),
});

const migrator = new Migrator({
  db: databaseConnection,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(__dirname, 'migrations'),
  }),
});

(async () => {
  const { results, error } = await migrator.migrateDown();
  const allSuccess = results?.every(({ status }) => status === 'Success');
  if (!allSuccess) {
    console.error('Failed to rollback migrations');
    if (error) {
      console.error(error);
    }
  }
})();
