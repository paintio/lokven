import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createListingDto: CreateListingDto) {
    return this.listingsService.create(createListingDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.listingsService.findAll(query);
  }

  @Get('search')
  search(@Query() query: any) {
    return this.listingsService.search(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateListingDto: UpdateListingDto) {
    return this.listingsService.update(id, updateListingDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.listingsService.remove(id);
  }

  @Post(':id/views')
  @HttpCode(HttpStatus.OK)
  incrementViews(@Param('id') id: string) {
    return this.listingsService.incrementViews(id);
  }

  @Get('type/:type')
  findByType(@Param('type') type: string) {
    return this.listingsService.findByType(type);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.listingsService.findByUser(userId);
  }
}
