import { PrismaService } from '../prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
export declare class BooksService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createBookDto: CreateBookDto, userId: number): Promise<{
        owner: {
            email: string;
            name: string;
            id: number;
        };
    } & {
        description: string;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        author: string;
        isbn: string;
        publishedYear: number;
        ownerId: number;
    }>;
    findAll(): Promise<({
        owner: {
            email: string;
            name: string;
            id: number;
        };
    } & {
        description: string;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        author: string;
        isbn: string;
        publishedYear: number;
        ownerId: number;
    })[]>;
    findOne(id: number): Promise<{
        owner: {
            email: string;
            name: string;
            id: number;
        };
    } & {
        description: string;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        author: string;
        isbn: string;
        publishedYear: number;
        ownerId: number;
    }>;
    update(id: number, updateBookDto: UpdateBookDto, userId: number): Promise<{
        owner: {
            email: string;
            name: string;
            id: number;
        };
    } & {
        description: string;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        author: string;
        isbn: string;
        publishedYear: number;
        ownerId: number;
    }>;
    remove(id: number, userId: number): Promise<{
        message: string;
    }>;
}
