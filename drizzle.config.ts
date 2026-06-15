import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/database/schema/*.ts',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.DRIZZLE_HOST || 'localhost',
    port: Number(process.env.MARIADB_PORT || 3306),
    user: process.env.MARIADB_USER || 'root',
    password: process.env.MARIADB_PASSWORD || 'admin',
    database: process.env.MARIADB_DATABASE || 'cats_shop',
  },
});
