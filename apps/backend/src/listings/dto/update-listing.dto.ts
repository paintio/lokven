import { PartialType } from '@nestjs/mapped-types';
import { CreateListingDto } from './create-listing.dto';
import { IsOptional, IsArray, IsString } from 'class-validator';

export class UpdateListingDto extends PartialType(CreateListingDto) {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
