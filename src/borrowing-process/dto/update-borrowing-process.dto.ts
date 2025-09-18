import { PartialType } from '@nestjs/swagger';
import { CreateBorrowingProcessDto } from './create-borrowing-process.dto';

export class UpdateBorrowingProcessDto extends PartialType(CreateBorrowingProcessDto) {}
