import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import CreateProductDto from 'src/dto/create-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productsservice: ProductService) {}
  //   constructor(private productService: ProductService) {}
  @Get()
  findAll(@Req() req: Request & { user: string }) {
    return this.productsservice.findAll();
  }
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const product = await this.productsservice.findOne(id);
    if (!product) {
      throw new HttpException('san pham ko tim that', HttpStatus.NOT_FOUND);
    }
    return product;
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
