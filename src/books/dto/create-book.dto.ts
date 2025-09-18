import { isNotEmpty, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateBookDto {
    @IsNotEmpty({message: 'Title is required'})
    @IsString()
    title: string;

    @IsNotEmpty({message: 'Author is required'})
    @IsString()
    author: string;

    
    @IsNotEmpty({message: 'ISBN  is required'})
    @IsNumber()
    ISBN: number;
    
    @IsNotEmpty({message: 'Description is required'})
    @IsString()
    description: string;


    @IsNotEmpty({message: 'Shelf location is required'})
    @IsString()
    shelf_location: string;

    @IsNotEmpty({message: 'Available quantity is required'})
    @IsNumber({}, {message: 'Available quantity must be a number'})
    @IsPositive({message: 'Available quantity must be a positive number'})
    available_quantity: number;
    
}
