import { Type } from './../../node_modules/@nestjs/common/interfaces/type.interface.d';
import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductImage } from './entities';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [TypeOrmModule.forFeature([Product, ProductImage])],
  exports: [ProductService, TypeOrmModule],
})
export class ProductModule {}
