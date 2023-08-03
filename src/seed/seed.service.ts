import { Injectable } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { Product } from '../product/entities/product.entity';
import { initialData } from './data/initialData';

@Injectable()
export class SeedService {
  constructor(private readonly productService: ProductService) {}
  async runSeed() {
    await this.insertNewProduct();
    return 'Se borro todos los productos';
  }
  private async insertNewProduct() {
    await this.productService.removeAllProduct();
    const Product = initialData.products;
    const insertPromisses = [];
    Product.forEach((product) => {
      insertPromisses.push(this.productService.create(product));
    });
    await Promise.all(insertPromisses);

    return true;
  }
}
