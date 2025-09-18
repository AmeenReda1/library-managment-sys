import { Module } from '@nestjs/common';
import { BorrowingProcessService } from './borrowing-process.service';
import { BorrowingProcessController } from './borrowing-process.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowingProcess } from './entities/borrowing-process.entity';
import { BooksModule } from 'src/books/books.module';
import { UsersModule } from 'src/users/users.module';
import { BorrowingProcessRepository } from './repositories/borrowing-process.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([BorrowingProcess]),
    UsersModule,
    BooksModule
  ],
  controllers: [BorrowingProcessController],
  providers: [BorrowingProcessService, BorrowingProcessRepository],
})
export class BorrowingProcessModule { }
