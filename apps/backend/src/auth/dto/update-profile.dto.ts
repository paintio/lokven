import { IsString, IsOptional, IsEmail, IsPhoneNumber, IsObject } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsPhoneNumber('RU')
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  // Документы продавца
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
