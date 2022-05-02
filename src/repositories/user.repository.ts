import { UpdateUserDto } from './../users/dto/update-user.dto';
import { CreateUserDto } from './../users/dto/create-user.dto';
import { verify } from 'crypto';
import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findByEmail(email: string) {
    return await this.findOne({ email });
  }

  async saveOne(dto: CreateUserDto) {
    return await this.save(dto);
  }

  async findAll() {
    return await this.find();
  }

  async findById(id: number) {
    return await this.findOne(id);
  }

  async updateOne(id: number, dto: UpdateUserDto) {
    return await this.update(id, dto);
  }

  async register(dto: { email: string; password: string }) {
    return await this.save(dto);
  }

  async removeOne(id: number) {
    return await this.delete(id);
  }
}
