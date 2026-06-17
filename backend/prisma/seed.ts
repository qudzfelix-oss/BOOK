import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

const prisma = new PrismaClient({ adapter });

const programmingBooks = [
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '9780132350884',
    publishedYear: 2008,
    description:
      'A handbook of agile software craftsmanship covering readable code, naming, functions, and refactoring practices.',
  },
  {
    title: 'Eloquent JavaScript',
    author: 'Marijn Haverbeke',
    isbn: '9781593279509',
    publishedYear: 2024,
    description:
      'A modern introduction to JavaScript programming with exercises, projects, and deep dives into the language.',
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt & David Thomas',
    isbn: '9780135957059',
    publishedYear: 2019,
    description:
      'Timeless advice for software developers on craftsmanship, automation, debugging, and career growth.',
  },
  {
    title: "You Don't Know JS Yet",
    author: 'Kyle Simpson',
    isbn: '9781491904244',
    publishedYear: 2015,
    description:
      'A deep dive into the core mechanisms of JavaScript, from scope and closures to prototypes and async.',
  },
  {
    title: 'Design Patterns',
    author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
    isbn: '9780201633610',
    publishedYear: 1994,
    description:
      'The foundational guide to reusable object-oriented design patterns used across modern software systems.',
  },
];

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'alex@bookify.com' },
    update: { name: 'Alex R.' },
    create: {
      email: 'alex@bookify.com',
      name: 'Alex R.',
      password: hashedPassword,
    },
  });

  for (const book of programmingBooks) {
    const existing = await prisma.book.findFirst({
      where: { isbn: book.isbn },
    });

    if (existing) {
      await prisma.book.update({
        where: { id: existing.id },
        data: book,
      });
      continue;
    }

    await prisma.book.create({
      data: {
        ...book,
        ownerId: user.id,
      },
    });
  }

  console.log(`Seeded ${programmingBooks.length} programming books for ${user.name}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
