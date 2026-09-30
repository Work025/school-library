const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        'Library',
        'Novels',
        'Story Books',
        'IELTS',
        'School Books',
      ],
    },

    pdf: {
      type: String,
      default: '',
    },

    image: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('Book', bookSchema)