import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto, userId: number) {
    return this.prisma.book.create({
      data: {
        ...createBookDto,
        ownerId: userId,
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.book.findMany({
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto, userId: number) {
    const book = await this.findOne(id);

    if (book.ownerId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to update this book',
      );
    }

    return this.prisma.book.update({
      where: { id },
      data: updateBookDto,
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(id: number, userId: number) {
    const book = await this.findOne(id);

    if (book.ownerId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to delete this book',
      );
    }

    await this.prisma.book.delete({
      where: { id },
    });

    return { message: 'Book successfully deleted' };
  }
}
