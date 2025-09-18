import { Injectable } from '@nestjs/common';
import { LessThan, MoreThanOrEqual, Between } from 'typeorm';
import { Response } from 'express';
import { CreateBorrowingProcessDto } from './dto/create-borrowing-process.dto';
import { UpdateBorrowingProcessDto } from './dto/update-borrowing-process.dto';
import { BorrowingProcessRepository } from './repositories/borrowing-process.repository';
import { UsersService } from 'src/users/users.service';
import { BooksService } from 'src/books/books.service';
import { UpdateBookDto } from 'src/books/dto/update-book.dto';
import { BorrowingProcess } from './entities/borrowing-process.entity';
import { PaginateQuery, paginate, Paginated, FilterOperator } from 'nestjs-paginate';
import { BorrowingProcessPaginationConfig } from './config/borrowing-process-pagination.config';
import { createObjectCsvStringifier } from 'csv-writer';
import { StreamOptions } from 'stream';

@Injectable()
export class BorrowingProcessService {

  constructor(
    private readonly borrowingProcessRepository: BorrowingProcessRepository,
    private readonly usersService: UsersService,
    private readonly booksService: BooksService
  ) { }

  async create(createBorrowingProcessDto: CreateBorrowingProcessDto) {

    const { user_id, book_id, due_date } = createBorrowingProcessDto;

    const user = await this.usersService.findOneById(user_id); // throw error internally if user not found

    const book = await this.booksService.findOneById(book_id);

    if (book && book.available_quantity > 0) {

      book.available_quantity--;
      await this.booksService.update(book_id, book as UpdateBookDto);

    }
    const borrowingProcess = new BorrowingProcess();
    borrowingProcess.borrower = user;
    borrowingProcess.book = book;
    borrowingProcess.due_date = new Date(due_date);
    borrowingProcess.borrowed_at = new Date();

    const newBorrowingProcess = await this.borrowingProcessRepository.create(borrowingProcess);
    return this.borrowingProcessRepository.saveOne(newBorrowingProcess);

  }

  findAll(query: PaginateQuery): Promise<Paginated<BorrowingProcess>> {
    return paginate(query, this.borrowingProcessRepository.repository, BorrowingProcessPaginationConfig);
  }

  findOne(id: number): Promise<BorrowingProcess> {
    return this.borrowingProcessRepository.findOneOrThrow({ where: { id } });
  }

  async returnBook(id: number): Promise<BorrowingProcess> {

    const borrowingProcess = await this.borrowingProcessRepository.findOneOrThrow({ where: { id } });
    borrowingProcess.returned_at = new Date();
    borrowingProcess.isReturned = true;
    borrowingProcess.book.available_quantity++;
    await this.booksService.update(borrowingProcess.book.id, borrowingProcess.book as UpdateBookDto);
    return this.borrowingProcessRepository.saveOne(borrowingProcess);

  }

  update(id: number, updateBorrowingProcessDto: UpdateBorrowingProcessDto): Promise<BorrowingProcess> {
    return this.borrowingProcessRepository.findOneAndUpdate({ where: { id } }, updateBorrowingProcessDto as Partial<BorrowingProcess>);
  }

  remove(id: number) {
    return this.borrowingProcessRepository.delete(id);
  }

  async getLastMonthBorrowingProcesses(): Promise<BorrowingProcess[]> {
    const now = new Date();
    // For testing: get current month's data instead of last month
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    return this.borrowingProcessRepository.findAll({
      where: {
        borrowed_at: Between(lastMonthStart, lastMonthEnd)
      },
      relations: ['borrower', 'book'],
      order: { borrowed_at: 'DESC' }
    });
  }

  async exportLastMonthToCSV(): Promise<string> {
    const borrowingProcesses = await this.getLastMonthBorrowingProcesses();

    // Transform data for CSV
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'id', title: 'ID' },
        { id: 'borrower_name', title: 'Borrower Name' },
        { id: 'borrower_email', title: 'Borrower Email' },
        { id: 'book_title', title: 'Book Title' },
        { id: 'book_author', title: 'Book Author' },
        { id: 'book_isbn', title: 'Book ISBN' },
        { id: 'borrowed_at', title: 'Borrowed At' },
        { id: 'due_date', title: 'Due Date' },
        { id: 'returned_at', title: 'Returned At' },
        { id: 'returned_status', title: 'Returned Status' },
      ],
    });
    const records = borrowingProcesses.map(bp => ({
      id: bp.id,
      borrower_name: bp.borrower?.name || 'N/A',
      borrower_email: bp.borrower?.email || 'N/A',
      book_title: bp.book?.title || 'N/A',
      book_author: bp.book?.author || 'N/A',
      book_isbn: bp.book?.ISBN || 'N/A',
      borrowed_at: bp.borrowed_at,
      due_date: bp.due_date,
      returned_at: bp.returned_at ? bp.returned_at : 'Not Returned',
      returned_status: this.getBorrowingStatus(bp)
    }));
    return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);

  }

  private getBorrowingStatus(borrowingProcess: BorrowingProcess): string {
    if (borrowingProcess.isReturned) {
      return 'Returned';
    }

    const now = new Date();
    if (borrowingProcess.due_date < now) {
      return 'Overdue';
    }

    return 'Active';
  }

}
