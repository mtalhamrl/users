import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto) {
    console.log('Creating user in Neo4j with data:', createUserDto);
    return this.userRepository.create(createUserDto);
  }
  async findAllUsers() {
    return this.userRepository.findAll();
  }
  async updateUser(updateUserDto: UpdateUserDto) {
    return this.userRepository.update(updateUserDto);
  }
  async deleteUser(deleteUserDto: DeleteUserDto) {
    console.log('Deleting user in Neo4j with data:', deleteUserDto);
    return this.userRepository.delete(deleteUserDto);
  }
}
