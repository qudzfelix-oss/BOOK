"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_better_sqlite3_1 = require("@prisma/adapter-better-sqlite3");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const adapter = new adapter_better_sqlite3_1.PrismaBetterSqlite3({
    url: process.env.DATABASE_URL || 'file:./dev.db',
});
const prisma = new client_1.PrismaClient({ adapter });
const programmingBooks = [
    {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '9780132350884',
        publishedYear: 2008,
        description: 'A handbook of agile software craftsmanship covering readable code, naming, functions, and refactoring practices.',
    },
    {
        title: 'Eloquent JavaScript',
        author: 'Marijn Haverbeke',
        isbn: '9781593279509',
        publishedYear: 2024,
        description: 'A modern introduction to JavaScript programming with exercises, projects, and deep dives into the language.',
    },
    {
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt & David Thomas',
        isbn: '9780135957059',
        publishedYear: 2019,
        description: 'Timeless advice for software developers on craftsmanship, automation, debugging, and career growth.',
    },
    {
        title: "You Don't Know JS Yet",
        author: 'Kyle Simpson',
        isbn: '9781491904244',
        publishedYear: 2015,
        description: 'A deep dive into the core mechanisms of JavaScript, from scope and closures to prototypes and async.',
    },
    {
        title: 'Design Patterns',
        author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
        isbn: '9780201633610',
        publishedYear: 1994,
        description: 'The foundational guide to reusable object-oriented design patterns used across modern software systems.',
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
//# sourceMappingURL=seed.js.map