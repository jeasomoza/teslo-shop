import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    try {
      const newProduct = await this.productRepository.create(createProductDto);
      await this.productRepository.save(newProduct);
      return newProduct;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll() {
    try {
      const products = await this.productRepository.find();
      return products;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(
        `El producto con id #${id} No fue encontrado`,
      );
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return product;
  }

  private handleDBException(error: any) {
    if (error.code === '23505') {
      throw new InternalServerErrorException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException(error);
  }
}
