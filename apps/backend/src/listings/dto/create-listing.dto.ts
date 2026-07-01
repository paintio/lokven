import { IsString, IsNumber, IsOptional, IsObject, IsArray, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateListingDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  type: string; // product, auto, service

  @IsObject()
  attributes: Record<string, any>;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(-90)
  @Max(90)
  lat?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(-180)
  @Max(180)
  lng?: number;

  @IsString()
  @IsOptional()
  address?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsString()
  authorId: string;
}
