import { mysqlTable, int, varchar, boolean, uniqueIndex } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  full_name: varchar('full_name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  hashdRt: varchar('hashdRt', { length: 255 }),
  isActive: boolean('isActive').default(true),
}, (table) => ({
  emailIdx: uniqueIndex('email_idx').on(table.email),
}));
