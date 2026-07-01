import { IsInt, IsString, IsOptional, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  orderId: string;

  @IsString()
  sellerId: string;
}
