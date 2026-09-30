import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import API_URL from '../../config/api.js'
import './Admin.css'

const categories = [
  'Library',
  'Novels',
  'Story Books',
  'IELTS',
  'School Books',
]

const emptyForm = {
  title: '',
  author: '',
  category: 'Library',
  pdf: null,
  image: null,
}

function Admin() {
  const navigate = useNavigate()
  const { token, isAuthenticated, logout } = useAuth()

  const [books, setBooks] = useState([])
  const [form, setForm] = useState(emptyForm)

  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [booksLoading, setBooksLoading] = useState(true)

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    fetchBooks()
  }, [isAuthenticated])

  const fetchBooks = async () => {
    setBooksLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/api/books`)
      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.message || 'Failed to load books.')
        return
      }

      setBooks(data.books)
    } catch (error) {
      console.error('Failed to load books:', error)
      setError('Unable to connect to the server.')
    } finally {
      setBooksLoading(false)
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }))
  }

  const handleFileChange = (event) => {
    const { name, files } = event.target

    setForm((previousForm) => ({
      ...previousForm,
      [name]: files[0] || null,
    }))
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setMessage('')
    setError('')

    if (!token) {
      setError('Your session has expired. Please log in again.')
      logout()
      navigate('/login')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()

      formData.append('title', form.title)
      formData.append('author', form.author)
      formData.append('category', form.category)

      if (form.pdf) {
        formData.append('pdf', form.pdf)
      }

      if (form.image) {
        formData.append('image', form.image)
      }

      const isEditing = Boolean(editingId)

      const url = isEditing
        ? `${API_URL}/api/books/${editingId}`
        : `${API_URL}/api/books`

      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (response.status === 401) {
        logout()
        navigate('/login')
        return
      }

      if (!response.ok || !data.success) {
        setError(data.message || 'Failed to save book.')
        return
      }

      setMessage(
        isEditing
          ? 'Book updated successfully.'
          : 'Book added successfully.',
      )

      resetForm()
      await fetchBooks()
    } catch (error) {
      console.error('Save book error:', error)
      setError('Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (book) => {
    setMessage('')
    setError('')

    setEditingId(book._id)

    setForm({
      title: book.title || '',
      author: book.author || '',
      category: book.category || 'Library',
      pdf: null,
      image: null,
    })

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this book?',
    )

    if (!confirmed) {
      return
    }

    setMessage('')
    setError('')

    if (!token) {
      setError('Your session has expired. Please log in again.')
      logout()
      navigate('/login')
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/books/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.status === 401) {
        logout()
        navigate('/login')
        return
      }

      if (!response.ok || !data.success) {
        setError(data.message || 'Failed to delete book.')
        return
      }

      setMessage('Book deleted successfully.')

      await fetchBooks()
    } catch (error) {
      console.error('Delete book error:', error)
      setError('Unable to connect to the server.')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <main className="admin-page">
      <div className="admin-container">
        <header className="admin-header">
          <div>
            <p>MAKTAB 230</p>

            <h1>Library Admin</h1>

            <span>Add, edit and manage school library books.</span>
          </div>

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>

        <section className="admin-section">
          <div className="admin-section-header">
            <h2>{editingId ? 'Edit Book' : 'Add New Book'}</h2>

            <p>
              {editingId
                ? 'Update the selected book information.'
                : 'Add a new book to the school library.'}
            </p>
          </div>

          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="title">Title</label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleInputChange}
                  placeholder="Enter book title"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="author">Author</label>

                <input
                  id="author"
                  name="author"
                  type="text"
                  value={form.author}
                  onChange={handleInputChange}
                  placeholder="Enter author name"
                  required
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="category">Category</label>

                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleInputChange}
                  required
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label htmlFor="pdf">PDF File</label>

                <input
                  id="pdf"
                  name="pdf"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  required={!editingId}
                />

                {editingId && (
                  <span className="admin-file-info">
                    Leave empty to keep the current PDF.
                  </span>
                )}
              </div>
            </div>

            <div className="admin-form-group">
              <label htmlFor="image">Cover Image</label>

              <input
                id="image"
                name="image"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                required={!editingId}
              />

              {editingId && (
                <span className="admin-file-info">
                  Leave empty to keep the current cover.
                </span>
              )}
            </div>

            {message && <p className="admin-message">{message}</p>}

            {error && <p className="admin-error-message">{error}</p>}

            <div className="admin-form-actions">
              <button
                type="submit"
                className="admin-submit-button"
                disabled={loading}
              >
                {loading
                  ? 'Saving...'
                  : editingId
                    ? 'Update Book'
                    : 'Add Book'}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="admin-cancel-button"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="admin-section">
          <div className="admin-books-header">
            <h2>Manage Books</h2>

            <span className="admin-books-count">
              {books.length} {books.length === 1 ? 'book' : 'books'}
            </span>
          </div>

          {booksLoading ? (
            <div className="admin-empty">Loading books...</div>
          ) : books.length === 0 ? (
            <div className="admin-empty">No books have been added yet.</div>
          ) : (
            <div className="admin-books-list">
              {books.map((book) => (
                <article className="admin-book-item" key={book._id}>
                  <div className="admin-book-info">
                    <div className="admin-book-cover">
                      {book.image ? (
                        <img
                          src={`${API_URL}${book.image}`}
                          alt={book.title}
                        />
                      ) : (
                        <span className="admin-book-cover-placeholder">
                          No Cover
                        </span>
                      )}
                    </div>

                    <div className="admin-book-details">
                      <h3>{book.title}</h3>

                      <p>{book.author}</p>

                      <span className="admin-book-category">
                        {book.category}
                      </span>
                    </div>
                  </div>

                  <div className="admin-book-actions">
                    <button
                      type="button"
                      className="admin-edit-button"
                      onClick={() => handleEdit(book)}
                      disabled={loading}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="admin-delete-button"
                      onClick={() => handleDelete(book._id)}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <button
          type="button"
          className="admin-back-button"
          onClick={() => navigate('/')}
        >
          ← Back to Library
        </button>
      </div>
    </main>
  )
}

export default Admin