export type TagColor = 'purple' | 'teal' | 'green' | 'blue' | 'orange';

export interface BookDisplayMeta {
  tag: string;
  tagColor: TagColor;
  rating: number;
  coverUrl: string;
  accent: string;
}

const catalog: Record<string, BookDisplayMeta> = {
  '9780132350884': {
    tag: 'Programming',
    tagColor: 'purple',
    rating: 4.8,
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780132350884-M.jpg',
    accent: '#7c3aed',
  },
  '9781593279509': {
    tag: 'JavaScript',
    tagColor: 'teal',
    rating: 4.7,
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781593279509-M.jpg',
    accent: '#14b8a6',
  },
  '9780135957059': {
    tag: 'Career',
    tagColor: 'green',
    rating: 4.9,
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780135957059-M.jpg',
    accent: '#22c55e',
  },
  '9781491904244': {
    tag: 'JavaScript',
    tagColor: 'blue',
    rating: 4.6,
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781491904244-M.jpg',
    accent: '#3b82f6',
  },
  '9780201633610': {
    tag: 'Architecture',
    tagColor: 'orange',
    rating: 4.5,
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780201633610-M.jpg',
    accent: '#f97316',
  },
};

function hashTitle(title: string): number {
  return title.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

export function getBookDisplayMeta(isbn: string, title: string): BookDisplayMeta {
  if (catalog[isbn]) {
    return catalog[isbn];
  }

  const palette = ['#8b5cf6', '#06b6d4', '#22c55e', '#3b82f6', '#f97316'];
  const colors: TagColor[] = ['purple', 'teal', 'green', 'blue', 'orange'];

  const index = hashTitle(title) % palette.length;

  return {
    tag: 'Programming',
    tagColor: colors[index],
    rating: 4.2 + (hashTitle(isbn) % 8) / 10,
    coverUrl: `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`,
    accent: palette[index],
  };
}

export const PROGRAMMING_TAGS = [
  'All',
  'Programming',
  'JavaScript',
  'Architecture',
  'Career',
] as const;
