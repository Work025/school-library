const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const User = require('./models/User')

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    console.log('MongoDB connected.')

    const existingUser = await User.findOne({
      email: process.env.ADMIN_EMAIL,
    })

    if (existingUser) {
      console.log('Admin user already exists.')
      process.exit(0)
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12)

    const admin = await User.create({
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
    })

    console.log('Admin user created successfully.')
    console.log(`Email: ${admin.email}`)

    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error('Failed to create admin:', error.message)

    await mongoose.disconnect()
    process.exit(1)
  }
}

createAdmin()
