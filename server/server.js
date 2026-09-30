const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const bookRoutes = require('./routes/bookRoutes')
const authRoutes = require('./routes/authRoutes')

const app = express()

const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.get('/', (req, res) => {
  res.json({
    message: 'MAKTAB 230 Library API is running',
  })
})

app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is working correctly',
  })
})

// Book routes
app.use('/api/books', bookRoutes)
app.use('/api/auth', authRoutes)

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully')

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection failed:')
    console.error(error.message)
  })