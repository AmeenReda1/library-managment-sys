import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindOneOptions } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { UserPaginationConfig } from './config/user-pagination.config';

@Injectable()
export class UsersService {

  constructor(private readonly userRepository: UserRepository) { }

  create(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto as User);
  }

  findAll(query: PaginateQuery): Promise<Paginated<User>> {
    return paginate(query, this.userRepository.repository, UserPaginationConfig);
  }

  async findOne(where: FindOneOptions<User>) {
    return await this.userRepository.findOne(where);
  }

  findOneById(id: number): Promise<User> {
    return this.userRepository.findOneOrThrow({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {

    const user = await this.userRepository.findOneAndUpdate({ where: { id } }, updateUserDto);
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  saveOne(user: User) {
    return this.userRepository.saveOne(user);
  }

}
