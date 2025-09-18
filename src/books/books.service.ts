import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookRepository } from './repositories/book.repository';
import { Book } from './entities/book.entity';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { BookPaginationConfig } from './config/book-pagination.config';

@Injectable()
export class BooksService {
  constructor(private readonly bookRepository: BookRepository) { }

  async create(createBookDto: CreateBookDto) {

    const { ISBN } = createBookDto;
    const book = await this.bookRepository.findOne({ where: { ISBN } });

    if (book)
      throw new BadRequestException('Book already exists');

    const newBook = await this.bookRepository.create(createBookDto as Book);
    return await this.bookRepository.saveOne(newBook);
  }

  findAll(query: PaginateQuery): Promise<Paginated<Book>> {
    return paginate(query, this.bookRepository.repository, BookPaginationConfig);
  }

  findOneById(id: number): Promise<Book> {
    return this.bookRepository.findOneOrThrow({ where: { id } });
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    return await this.bookRepository.findOneAndUpdate({ where: { id } }, updateBookDto);
  }


}
