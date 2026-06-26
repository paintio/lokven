import { IsString, IsPhoneNumber, IsEmail, IsOptional, IsBoolean, IsObject } from 'class-validator';

export class RegisterDto {
  @IsPhoneNumber('RU')
  phone: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  isSeller?: boolean;

  // Документы для продавца
  @IsString()
  @IsOptional()
  inn?: string;

  @IsString()
  @IsOptional()
  ogrn?: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  legalAddress?: string;

  @IsString()
  @IsOptional()
  bankAccount?: string;

  @IsString()
  @IsOptional()
  bik?: string;

  @IsObject()
  @IsOptional()
  documents?: Record<string, any>;
}
