import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Public, Roles } from 'src/common/decorators';
import { UserType } from 'src/common/enums';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { Book } from './entities/book.entity';
import { PaginatedApiResponse } from 'src/common/interfaces/api-response.interface';

@Controller('books')
@UseGuards(JwtAuthGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) { }

  @Roles(UserType.ADMIN)
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Public()
  @Get()
  async findAll(@Paginate() query: PaginateQuery): Promise<PaginatedApiResponse<Book>> {
    const paginatedBooks = await this.booksService.findAll(query);
    return {
      message: 'Books fetched successfully',
      ...paginatedBooks,
    };
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOneById(+id);
  }
  @Roles(UserType.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }


}
