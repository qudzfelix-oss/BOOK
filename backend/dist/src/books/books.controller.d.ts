import type { AuthUser } from '../auth/interfaces/auth-user.interface';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
export declare class BooksController {
    private readonly booksService;
    constructor(booksService: BooksService);
    create(createBookDto: CreateBookDto, user: AuthUser): Promise<{
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
    update(id: number, updateBookDto: UpdateBookDto, user: AuthUser): Promise<{
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
    remove(id: number, user: AuthUser): Promise<{
        message: string;
    }>;
}
