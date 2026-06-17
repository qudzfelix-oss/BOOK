import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    example: 'The Great Gatsby',
    description: 'The title of the book',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'F. Scott Fitzgerald',
    description: 'The author of the book',
  })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({
    example: '9780743273565',
    description: 'The ISBN code of the book',
  })
  @IsString()
  @IsNotEmpty()
  isbn: string;

  @ApiProperty({
    example: 1925,
    description: 'The year the book was published',
  })
  @IsInt()
  @Min(1000)
  @Max(new Date().getFullYear() + 5)
  publishedYear: number;

  @ApiProperty({
    example:
      'A story of the wealthy Jay Gatsby and his love for Daisy Buchanan.',
    description: 'A brief description of the book',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
