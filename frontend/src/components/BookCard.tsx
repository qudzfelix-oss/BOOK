import React, { useState } from 'react';
import { getBookDisplayMeta } from '../data/bookCatalog';
import { EditIcon, MoreIcon, StarIcon, TrashIcon, ViewIcon } from './Icons';

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  description: string;
  ownerId: number;
  owner?: {
    id: number;
    email: string;
    name: string;
  };
  createdAt: string;
}

interface BookCardProps {
  book: Book;
  isOwner: boolean;
  onView: (book: Book) => void;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  isOwner,
  onView,
  onEdit,
  onDelete,
}) => {
  const meta = getBookDisplayMeta(book.isbn, book.title);
  const [coverFailed, setCoverFailed] = useState(false);

  return (
    <article className="store-book-card glass-panel">
      <div className="store-book-cover-wrap">
        {!coverFailed ? (
          <img
            src={meta.coverUrl}
            alt={`${book.title} cover`}
            className="store-book-cover"
            loading="lazy"
            onError={() => setCoverFailed(true)}
          />
        ) : (
          <div
            className="store-book-cover-fallback"
            style={{ background: `linear-gradient(145deg, ${meta.accent}, #111827)` }}
          >
            <span>{book.title}</span>
          </div>
        )}
      </div>

      <div className="store-book-body">
        <h3 className="store-book-title">{book.title}</h3>
        <p className="store-book-author">{book.author}</p>

        <div className="store-book-meta-row">
          <span className={`store-book-tag tag-${meta.tagColor}`}>{meta.tag}</span>
          <span className="store-book-rating">
            <StarIcon className="store-book-star" />
            {meta.rating.toFixed(1)}
          </span>
        </div>

        <div className="store-book-actions">
          <button
            type="button"
            className="store-action-btn action-view"
            aria-label={`View ${book.title}`}
            onClick={() => onView(book)}
          >
            <ViewIcon />
          </button>
          <button
            type="button"
            className="store-action-btn action-edit"
            aria-label={`Edit ${book.title}`}
            onClick={() => onEdit(book)}
            disabled={!isOwner}
          >
            <EditIcon />
          </button>
          <button
            type="button"
            className="store-action-btn action-delete"
            aria-label={`Delete ${book.title}`}
            onClick={() => onDelete(book)}
            disabled={!isOwner}
          >
            <TrashIcon />
          </button>
          <button type="button" className="store-action-btn action-more" aria-label="More options">
            <MoreIcon />
          </button>
        </div>
      </div>
    </article>
  );
};
