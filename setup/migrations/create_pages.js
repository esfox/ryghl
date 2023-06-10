/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-var-requires */
const { sql } = require('kysely');

exports.up = async (db) => {
  await sql`
    CREATE TABLE IF NOT EXISTS pages (
      pk serial PRIMARY KEY,
      id VARCHAR(50) UNIQUE NOT NULL,
      created_on TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `.execute(db);
};

exports.down = async (db) => {
  await sql`
    DROP TABLE pages
  `.execute(db);
};
