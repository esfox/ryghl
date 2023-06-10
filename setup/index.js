/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');
const { Migrator, Kysely, PostgresDialect, FileMigrationProvider } = require('kysely');
const { Pool } = require('pg');

const { promises: fs } = require('fs');
const path = require('path');

const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
const apiKey = process.env.SUPABASE_SERVICE_API_KEY;
const bucketName = process.env.SUPABASE_BUCKET_NAME;
const databaseConnectionString = process.env.SUPABASE_DATABASE_CONNECTION_STRING;
const databaseSslCertificate = process.env.SUPABASE_DATABASE_SSL_CERTIFICATE;

const supabase = createClient(projectUrl, apiKey);

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
  /* Create bucket in Supabase */
  console.log('Creating Supabase bucket...');
  const { error: createBucketError } = await supabase.storage.createBucket(bucketName, {
    public: false,
  });

  if (createBucketError) {
    console.error('Error creating the Supabase bucket');
    console.error(createBucketError);
  }

  /* Create the pages database table */
  console.debug('Running database migrations...');
  const { error: migrationsError } = await migrator.migrateToLatest();
  if (migrationsError) {
    console.error('Error running database migrations');
    console.error(migrationsError);
  }
})();
