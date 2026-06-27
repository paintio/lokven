import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  async create(@Request() req, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(req.user.id, createReviewDto);
  }

  @Get('seller/:sellerId')
  async getSellerReviews(
    @Param('sellerId') sellerId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reviewsService.getSellerReviews(
      sellerId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get('order/:orderId')
  async getUserReviewForOrder(@Request() req, @Param('orderId') orderId: string) {
    return this.reviewsService.getUserReviewForOrder(req.user.id, orderId);
  }

  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    return this.reviewsService.delete(id, req.user.id);
  }
}
