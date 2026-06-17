import React, { useState } from 'react';
import { getApiErrorMessage } from '../utils/errors';

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  description: string;
  ownerId: number;
}

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bookData: Omit<Book, 'id' | 'ownerId'>) => Promise<void>;
  book: Book | null;
}

function getInitialFormState(book: Book | null) {
  return {
    title: book?.title ?? '',
    author: book?.author ?? '',
    isbn: book?.isbn ?? '',
    publishedYear: book?.publishedYear ?? ('' as number | ''),
    description: book?.description ?? '',
  };
}

export const BookModal: React.FC<BookModalProps> = ({ isOpen, onClose, onSave, book }) => {
  const initialState = getInitialFormState(book);
  const [title, setTitle] = useState(initialState.title);
  const [author, setAuthor] = useState(initialState.author);
  const [isbn, setIsbn] = useState(initialState.isbn);
  const [publishedYear, setPublishedYear] = useState<number | ''>(initialState.publishedYear);
  const [description, setDescription] = useState(initialState.description);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !author.trim() || !isbn.trim() || !description.trim() || publishedYear === '') {
      setError('All fields are required.');
      return;
    }

    if (isNaN(Number(publishedYear)) || publishedYear < 1000 || publishedYear > new Date().getFullYear() + 5) {
      setError('Please enter a valid publishing year.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        title: title.trim(),
        author: author.trim(),
        isbn: isbn.trim(),
        publishedYear: Number(publishedYear),
        description: description.trim(),
      });
      onClose();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to save book. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div className="modal-title">
          <h2>{book ? 'Edit Book' : 'Add New Book'}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#ef4444',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Book Title</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Great Gatsby"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Author</label>
            <input
              type="text"
              className="form-input"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. F. Scott Fitzgerald"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="form-label">ISBN</label>
              <input
                type="text"
                className="form-input"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="e.g. 9780743273565"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="form-label">Published Year</label>
              <input
                type="number"
                className="form-input"
                value={publishedYear}
                onChange={(e) => setPublishedYear(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 1925"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a brief summary of the book..."
              disabled={isSubmitting}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
