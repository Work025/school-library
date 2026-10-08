const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Book = require('../models/Book')
const protectAdmin = require('../middleware/authMiddleware')

const router = express.Router()
const uploadDir = path.join(__dirname, '..', 'uploads')

fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDir)
  },

  filename: (req, file, callback) => {
    const uniqueName = `${Date.now()}-${file.originalname}`
    callback(null, uniqueName)
  },
})

const upload = multer({
  storage,
  fileFilter: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase()

    const allowedExtensions = [
      '.pdf',
      '.jpg',
      '.jpeg',
      '.png',
      '.webp',
    ]

    if (!allowedExtensions.includes(extension)) {
      return callback(
        new Error('Only PDF, JPG, JPEG, PNG and WEBP files are allowed.'),
      )
    }

    callback(null, true)
  },
})

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 })

    res.json({
      success: true,
      books,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get books',
    })
  }
})

// Add a book with PDF and image
router.post(
  '/',
  protectAdmin,
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, author, category } = req.body

      if (!title || !author || !category) {
        return res.status(400).json({
          success: false,
          message: 'Title, author and category are required.',
        })
      }

      const pdfPath = req.files?.pdf?.[0]
        ? `/uploads/${req.files.pdf[0].filename}`
        : ''

      const imagePath = req.files?.image?.[0]
        ? `/uploads/${req.files.image[0].filename}`
        : ''

      const book = await Book.create({
        title,
        author,
        category,
        pdf: pdfPath,
        image: imagePath,
      })

      res.status(201).json({
        success: true,
        message: 'Book added successfully',
        book,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to add book',
        error: error.message,
      })
    }
  },
)

// Delete a book
router.delete(
  '/:id',
  protectAdmin,
  async (req, res) => {
    try {
      const book = await Book.findById(req.params.id)

      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found',
        })
      }

      if (book.pdf) {
        const pdfFilePath = path.join(
          __dirname,
          '..',
          book.pdf.replace('/uploads/', 'uploads/'),
        )

        if (fs.existsSync(pdfFilePath)) {
          fs.unlinkSync(pdfFilePath)
        }
      }

      if (book.image) {
        const imageFilePath = path.join(
          __dirname,
          '..',
          book.image.replace('/uploads/', 'uploads/'),
        )

        if (fs.existsSync(imageFilePath)) {
          fs.unlinkSync(imageFilePath)
        }
      }

      await Book.findByIdAndDelete(req.params.id)

      res.json({
        success: true,
        message: 'Book deleted successfully',
      })
    } catch (error) {
      console.error('Delete book error:', error)

      res.status(500).json({
        success: false,
        message: 'Failed to delete book',
        error: error.message,
      })
    }
  },
)

// Update a book
router.put(
  '/:id',
  protectAdmin,
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const book = await Book.findById(req.params.id)

      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found',
        })
      }

      const { title, author, category } = req.body

      if (!title || !author || !category) {
        return res.status(400).json({
          success: false,
          message: 'Title, author and category are required.',
        })
      }

      book.title = title
      book.author = author
      book.category = category

      if (req.files?.pdf?.[0]) {
        if (book.pdf) {
          const oldPdfPath = path.join(
            __dirname,
            '..',
            book.pdf.replace('/uploads/', 'uploads/'),
          )

          if (fs.existsSync(oldPdfPath)) {
            fs.unlinkSync(oldPdfPath)
          }
        }

        book.pdf = `/uploads/${req.files.pdf[0].filename}`
      }

      if (req.files?.image?.[0]) {
        if (book.image) {
          const oldImagePath = path.join(
            __dirname,
            '..',
            book.image.replace('/uploads/', 'uploads/'),
          )

          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath)
          }
        }

        book.image = `/uploads/${req.files.image[0].filename}`
      }

      await book.save()

      res.json({
        success: true,
        message: 'Book updated successfully',
        book,
      })
    } catch (error) {
      console.error('Update book error:', error)

      res.status(500).json({
        success: false,
        message: 'Failed to update book',
        error: error.message,
      })
    }
  },
)

module.exports = router