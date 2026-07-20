import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Product from 'src/entities/Product';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productsrepository: Repository<Product>,
  ) {}
  //ep buoc du lieu truyen vao service bat buoc khop vs db
  create(productdata: Partial<Product>) {
    const product = this.productsrepository.create(productdata);
    product.created_at = new Date();

    product.updated_at = new Date();
    return this.productsrepository.save(product);
  }
  async update(id: number, productData: Partial<Product>) {
    productData.updated_at = new Date();
    await this.productsrepository.update(id, productData);
    return this.productsrepository.findOneBy({ id });
  }
  async delete(id: number) {
    const product = this.productsrepository.findOneBy({ id });
    await this.productsrepository.delete(id);
    return product;
  }
  async findOne(id: number) {
    return this.productsrepository.findOneBy({ id });
  }
  async findAll() {
    return await this.productsrepository.find();
  }
}
