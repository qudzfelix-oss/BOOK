import React from 'react';

interface BookViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: {
    title: string;
    author: string;
    isbn: string;
    publishedYear: number;
    description: string;
    owner?: { name: string };
  } | null;
}

export const BookViewModal: React.FC<BookViewModalProps> = ({ isOpen, onClose, book }) => {
  if (!isOpen || !book) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel store-view-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          <h2>{book.title}</h2>
          <button className="modal-close" onClick={onClose} type="button">
            &times;
          </button>
        </div>

        <p className="store-view-author">by {book.author}</p>
        <div className="store-view-meta">
          <span>ISBN: {book.isbn}</span>
          <span>Published: {book.publishedYear}</span>
          {book.owner && <span>Owner: {book.owner.name}</span>}
        </div>
        <p className="store-view-description">{book.description}</p>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
