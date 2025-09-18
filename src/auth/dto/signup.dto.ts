import { UserType } from "src/common/enums";
import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, IsEnum } from 'class-validator';

export class SignupDto {
    
    @IsNotEmpty({ message: 'Name is required' })
    @IsString()
    name: string;
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail()
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    password: string;

    @IsEnum(UserType)
    @IsNotEmpty({ message: `Type is required and must be one of the following: ${Object.values(UserType).join(', ')}` })
    type: UserType;

}