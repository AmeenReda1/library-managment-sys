import { IsNotEmpty, IsNumber, IsDateString } from "class-validator";

export class CreateBorrowingProcessDto {

    @IsNotEmpty({ message: 'User ID is required' })
    @IsNumber()
    user_id: number;

    @IsNotEmpty({ message: 'Book ID is required' })
    @IsNumber()

    book_id: number;

    @IsNotEmpty({ message: 'Due date is required' })
    @IsDateString()
    due_date: string;

}
