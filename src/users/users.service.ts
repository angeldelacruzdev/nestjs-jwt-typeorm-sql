import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

import { DRIZZLE } from '../database/drizzle.provider';
import { users } from '../database/schema/users';
import { HashService } from '../common/hash.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE) private readonly db: MySql2Database,
    private readonly hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const [result] = await this.db.insert(users).values({
      name: createUserDto.name,
      full_name: createUserDto.full_name ?? null,
      email: createUserDto.email,
      password: await this.hashService.hash(createUserDto.password),
    });
    return this.findOne(result.insertId);
  }

  async findAll() {
    return this.db.select().from(users);
  }

  async findOne(id: number) {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user ?? null;
  }

  async findOneByEmail(email: string) {
    const [user] = await this.db.select().from(users).where(eq(users.email, email));
    return user ?? null;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { id: _, ...values } = updateUserDto;
    if (values.password) {
      values.password = await this.hashService.hash(values.password);
    }
    await this.db.update(users).set(values).where(eq(users.id, id));
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.db.delete(users).where(eq(users.id, id));
  }
}
