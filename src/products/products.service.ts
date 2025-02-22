import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      return await this.prismaService.product.create({
        data: createProductDto,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ConflictException(
            `Product with name ${createProductDto.name} already exists`,
          );
        }
      }
    }
  }

  async findAll() {
    return await this.prismaService.product.findMany();
  }

  async findOne(id: number) {
    const productFound = await this.prismaService.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!productFound) {
      throw new NotFoundException(`Product with id ${id} is not found'`);
    }

    return productFound;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const productUpdate = await this.prismaService.product.update({
      where: {
        id,
      },
      data: updateProductDto,
    });

    if (!productUpdate) {
      throw new NotFoundException(`Product with id ${id} is not found'`);
    }

    return productUpdate;
  }

  async remove(id: number) {
    const deletedProduct = await this.prismaService.product.delete({
      where: {
        id: id,
      },
    });

    if (!deletedProduct) {
      throw new NotFoundException(`Product with id ${id} is not found'`);
    }

    return deletedProduct;
  }
}
