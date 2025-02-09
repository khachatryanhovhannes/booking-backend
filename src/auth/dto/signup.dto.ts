/* eslint-disable @typescript-eslint/no-unsafe-call */
import { User_role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @MinLength(3)
  first_name: string;
  @IsString()
  @MinLength(3)
  last_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @IsString({ each: true })
  password: string;

  @IsEnum(User_role)
  role: 'ADMIN' | 'USER' | 'PROVIDER';
}
