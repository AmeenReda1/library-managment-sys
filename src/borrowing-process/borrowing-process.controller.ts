import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { BorrowingProcessService } from './borrowing-process.service';
import { CreateBorrowingProcessDto } from './dto/create-borrowing-process.dto';
import { UpdateBorrowingProcessDto } from './dto/update-borrowing-process.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators';
import { UserType } from 'src/common/enums';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { ApiResponse, PaginatedApiResponse } from 'src/common/interfaces/api-response.interface';
import { BorrowingProcess } from './entities/borrowing-process.entity';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('borrowing-process')
@UseGuards(JwtAuthGuard)
@Roles(UserType.ADMIN)
export class BorrowingProcessController {
  constructor(private readonly borrowingProcessService: BorrowingProcessService) { }


  @Post()
  async create(@Body() createBorrowingProcessDto: CreateBorrowingProcessDto): Promise<ApiResponse<BorrowingProcess>> {
    const borrowingProcess = await this.borrowingProcessService.create(createBorrowingProcessDto);
    return {
      message: 'Borrowing process created successfully',
      data: borrowingProcess,
    };
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery): Promise<PaginatedApiResponse<BorrowingProcess>> {
    const paginatedBorrowingProcesses = await this.borrowingProcessService.findAll(query);
    return {
      message: 'Borrowing processes fetched successfully',
      ...paginatedBorrowingProcesses,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<BorrowingProcess>> {
    const borrowingProcess = await this.borrowingProcessService.findOne(+id);
    return {
      message: 'Borrowing process fetched successfully',
      data: borrowingProcess,
    };
  }
  @Patch('return/:id')
  async returnBook(@Param('id') id: string): Promise<ApiResponse<BorrowingProcess>> {
    const borrowingProcess = await this.borrowingProcessService.returnBook(+id);
    return {
      message: 'Borrowing process returned successfully',
      data: borrowingProcess,
    };
  }
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBorrowingProcessDto: UpdateBorrowingProcessDto): Promise<ApiResponse<BorrowingProcess>> {
    const borrowingProcess = await this.borrowingProcessService.update(+id, updateBorrowingProcessDto);
    return {
      message: 'Borrowing process updated successfully',
      data: borrowingProcess,
    };
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ short: { limit: 1, ttl: 5000 } }) // i used rate limit here 1 time in 6 seconds
  @Get('export/last-month')
  async exportLastMonthCSV(@Res() res: Response): Promise<void> {
    const csv = await this.borrowingProcessService.exportLastMonthToCSV();

    const now = new Date();
    const fileName = `borrowing-processes-${now.getFullYear()}-${(now.getMonth()).toString().padStart(2, '0')}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Cache-Control', 'no-cache');
    res.end(csv);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.borrowingProcessService.remove(+id);
  }
}
