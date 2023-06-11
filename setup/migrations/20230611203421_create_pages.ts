import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>) {
  await sql`
    CREATE TABLE IF NOT EXISTS pages (
      pk serial PRIMARY KEY,
      id VARCHAR(50) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      created_on TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE INDEX index_id ON pages(id);
    CREATE INDEX index_title ON pages(title);

    ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
  `.execute(db);
}

export async function down(db: Kysely<unknown>) {
  await sql`
    DROP TABLE pages
  `.execute(db);
}
