import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  async create(@Body() createUserDto: CreateUserDto) {
    console.log('Create User DTO:', createUserDto);

    const result = await this.userService.createUser(createUserDto);
    console.log('User created successfully:', result);
    return result;
  }

  @Get()
  findAll() {
    return this.userService.findAllUsers();
  }

  @Post('/update')
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(updateUserDto);
  }

  @Post('/delete')
  delete(@Body() deleteUserDto: DeleteUserDto) {
    return this.userService.deleteUser(deleteUserDto);
  }
}
