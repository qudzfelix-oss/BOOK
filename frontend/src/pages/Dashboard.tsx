import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BookCard, type Book } from '../components/BookCard';
import { BookModal } from '../components/BookModal';
import { BookViewModal } from '../components/BookViewModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { ChevronDownIcon, FilterIcon, SearchIcon } from '../components/Icons';
import { Sidebar } from '../components/Sidebar';
import { Toast } from '../components/Toast';
import { useAuth } from '../context/useAuth';
import { getBookDisplayMeta, PROGRAMMING_TAGS } from '../data/bookCatalog';
import api from '../services/api';
import { getApiErrorMessage } from '../utils/errors';

type StatusFilter = 'all' | 'mine' | 'shared';
type SortOption = 'title' | 'year' | 'rating';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState<(typeof PROGRAMMING_TAGS)[number]>('All');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('title');
  const [loading, setLoading] = useState(true);

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [viewBook, setViewBook] = useState<Book | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    let cancelled = false;

    api.get('/books')
      .then((response) => {
        if (!cancelled) {
          setBooks(response.data);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          showToast(getApiErrorMessage(err, 'Failed to load books.'), 'error');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [showToast]);

  const handleSaveBook = async (bookData: Omit<Book, 'id' | 'ownerId' | 'createdAt'>) => {
    try {
      if (selectedBook) {
        const response = await api.put(`/books/${selectedBook.id}`, bookData);
        setBooks((prev) => prev.map((book) => (book.id === selectedBook.id ? response.data : book)));
        showToast('Book updated successfully!', 'success');
      } else {
        const response = await api.post('/books', bookData);
        setBooks((prev) => [response.data, ...prev]);
        showToast('Book added successfully!', 'success');
      }
    } catch (err: unknown) {
      showToast(getApiErrorMessage(err, 'Failed to save book.'), 'error');
      throw err;
    }
  };

  const handleDeleteBook = async () => {
    if (!bookToDelete) return;

    try {
      await api.delete(`/books/${bookToDelete.id}`);
      setBooks((prev) => prev.filter((book) => book.id !== bookToDelete.id));
      showToast('Book deleted successfully!', 'success');
    } catch (err: unknown) {
      showToast(getApiErrorMessage(err, 'Failed to delete book.'), 'error');
      throw err;
    }
  };

  const filteredBooks = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return books
      .filter((book) => {
        const matchesSearch =
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.isbn.toLowerCase().includes(query);

        const meta = getBookDisplayMeta(book.isbn, book.title);
        const matchesTag = tagFilter === 'All' || meta.tag === tagFilter;
        const isOwner = user?.id === book.ownerId;
        const matchesStatus =
          statusFilter === 'all' ||
          (statusFilter === 'mine' && isOwner) ||
          (statusFilter === 'shared' && !isOwner);

        return matchesSearch && matchesTag && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'year') {
          return b.publishedYear - a.publishedYear;
        }

        if (sortBy === 'rating') {
          return (
            getBookDisplayMeta(b.isbn, b.title).rating -
            getBookDisplayMeta(a.isbn, a.title).rating
          );
        }

        return a.title.localeCompare(b.title);
      });
  }, [books, searchQuery, sortBy, statusFilter, tagFilter, user?.id]);

  return (
    <div className="store-shell">
      {toast && (
        <div className="toast-container">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}

      <Sidebar userName={user?.name} onLogout={logout} />

      <main className="store-main">
        <header className="library-header">
          <div className="library-header-left">
            <h1>My Library</h1>
            <p>{books.length} books</p>
          </div>

          <div className="library-search">
            <SearchIcon className="library-search-icon" />
            <input
              type="text"
              className="library-search-input"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button type="button" className="library-add-btn" onClick={() => {
            setSelectedBook(null);
            setIsBookModalOpen(true);
          }}>
            Add New Book
          </button>

          <div className="library-profile">
            <div className="library-avatar">{user?.name?.charAt(0) ?? 'A'}</div>
            <div className="library-profile-text">
              <span>{user?.name ?? 'Guest'}</span>
              <ChevronDownIcon />
            </div>
          </div>
        </header>

        <div className="library-toolbar">
          <div className="library-filter">
            <label>
              Tags
              <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value as typeof tagFilter)}>
                {PROGRAMMING_TAGS.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Status
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              >
                <option value="all">All</option>
                <option value="mine">My Books</option>
                <option value="shared">Shared</option>
              </select>
            </label>

            <label>
              Sort
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}>
                <option value="title">Title</option>
                <option value="year">Year</option>
                <option value="rating">Rating</option>
              </select>
            </label>
          </div>

          <button type="button" className="library-filter-btn" aria-label="Filter options">
            <FilterIcon />
          </button>
        </div>

        {loading ? (
          <div className="spinner-container">
            <div className="spinner" />
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="store-books-grid">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                isOwner={user?.id === book.ownerId}
                onView={setViewBook}
                onEdit={(selected) => {
                  setSelectedBook(selected);
                  setIsBookModalOpen(true);
                }}
                onDelete={(selected) => {
                  setBookToDelete(selected);
                  setIsDeleteModalOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state glass-panel">
            <div className="empty-icon">📚</div>
            <h3>No books found</h3>
            <p>
              {searchQuery
                ? "We couldn't find any books matching your search."
                : 'Your programming library is empty. Add your first book!'}
            </p>
            {searchQuery && (
              <button
                type="button"
                className="btn btn-secondary btn-small"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </main>

      <BookModal
        key={`${selectedBook?.id ?? 'new'}-${isBookModalOpen}`}
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onSave={handleSaveBook}
        book={selectedBook}
      />

      <BookViewModal
        isOpen={Boolean(viewBook)}
        onClose={() => setViewBook(null)}
        book={viewBook}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteBook}
        title="Delete Book"
        message={`Are you sure you want to delete "${bookToDelete?.title}"? This action cannot be undone.`}
      />
    </div>
  );
};
