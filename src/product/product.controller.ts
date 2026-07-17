import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import CreateProductDto from 'src/dto/create-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productsservice: ProductService) {}
  //   constructor(private productService: ProductService) {}
  @Get()
  findAll() {
    return 'a';
  }
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productsservice.findOne(id);
  }

  @Post()
  create(@Body() productData: CreateProductDto) {
    return this.productsservice.create(productData);
  }
  @Patch(':id')
  update(@Body() productData: any, @Param('id') id: number) {
    return this.productsservice.update(id, productData);
  }
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.productsservice.delete(id);
  }
}
