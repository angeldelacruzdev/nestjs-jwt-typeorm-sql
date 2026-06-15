import { Provider } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/mysql2';
import * as mysql from 'mysql2/promise';
import * as schema from './schema';

export const DRIZZLE = 'DRIZZLE';

export const drizzleProvider: Provider = {
  provide: DRIZZLE,
  useFactory: async () => {
    const connection = await mysql.createConnection({
      host: process.env.MARIADB_HOST,
      port: Number(process.env.MARIADB_PORT),
      user: process.env.MARIADB_USER,
      password: process.env.MARIADB_PASSWORD,
      database: process.env.MARIADB_DATABASE,
    });
    return drizzle(connection, { schema, mode: 'default' });
  },
};
