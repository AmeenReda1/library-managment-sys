import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { UserType } from 'src/common/enums';
import { Public, Roles } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { ApiResponse, PaginatedApiResponse } from 'src/common/interfaces/api-response.interface';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<ApiResponse<User>> {
    const user = await this.usersService.create(createUserDto);
    return {
      message: 'User created successfully',
      data: user,
    }
  }

  @Roles(UserType.ADMIN)
  @Get()
  async findAll(@Paginate() query: PaginateQuery): Promise<PaginatedApiResponse<User>> {
    const paginatedUsers = await this.usersService.findAll(query);
    return {
      message: 'Users fetched successfully',
      ...paginatedUsers,
    };
  }

  @Roles(UserType.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<User>> {
    const user = await this.usersService.findOneById(+id);
    return {
      message: 'User fetched successfully',
      data: user,
    }
  }

  @Roles(UserType.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<ApiResponse<User>> {

    const user = await this.usersService.update(+id, updateUserDto);
    
    return {
      message: 'User updated successfully',
      data: user,
    }

  }

  @Roles(UserType.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse<string>> {

    await this.usersService.remove(+id);

    return {
      success: true,
      message: 'User deleted successfully',
    }
  }
}
