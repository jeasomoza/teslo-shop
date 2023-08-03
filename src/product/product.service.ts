import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { ProductImage, Product } from './entities';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ) {}
  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetail } = createProductDto;

      const newProduct = await this.productRepository.create({
        ...productDetail,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });
      await this.productRepository.save(newProduct);
      return { ...newProduct, images: images };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;

      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
        relations: ['images'],
      });
      return products.map((product) => ({
        ...product,
        images: product.images.map((image) => image.url),
      }));
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findOne(term: string) {
    let product: Product;
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('product');
      product = await queryBuilder
        .where('UPPER(title) ILIKE :term or slug=:slug', {
          term: `%${term.toUpperCase}%`,
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('product.images', 'image')
        .getOne();
    }

    if (!product) {
      throw new NotFoundException(
        `El producto con term #${term} No fue encontrado`,
      );
    }
    return product;
  }

  async findOnePlaint(term: string) {
    const { images = [], ...product } = await this.findOne(term);
    return { ...product, images: images.map((image) => image.url) };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images = [], ...productDetail } = updateProductDto;

    const product = await this.productRepository.preload({
      id,
      ...productDetail,
    });

    if (!product)
      throw new NotFoundException(
        `El producto con id #${id} No fue encontrado`,
      );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (images.length > 0) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        await queryRunner.manager.save(
          images.map((image) =>
            this.productImageRepository.create({ url: image, product }),
          ),
        );
      } else {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
      }
      await this.productRepository.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlaint(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBException(error);
    }
  }

  async removeAllProduct() {
    const query = this.productRepository.createQueryBuilder('product');
    try {
      await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBException(error);
    }
    return { message: 'Todos los productos fueron eliminados' };
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return { message: `El producto con id #${id} fue eliminado` };
  }

  private handleDBException(error: any) {
    if (error.code === '23505') {
      throw new InternalServerErrorException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException(error);
  }
}
