import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule, UsersService],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
})
export class UsersModule {}
