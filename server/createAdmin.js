const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const User = require('./models/User')

async function createOrUpdateAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    console.log('MongoDB connected.')

    const email = process.env.ADMIN_EMAIL
    const password = process.env.ADMIN_PASSWORD

    if (!email || !password) {
      throw new Error(
        'ADMIN_EMAIL or ADMIN_PASSWORD is missing in environment variables.',
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    })

    if (existingUser) {
      existingUser.password = hashedPassword
      existingUser.role = 'admin'

      await existingUser.save()

      console.log('Admin password updated successfully.')
    } else {
      await User.create({
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: 'admin',
      })

      console.log('Admin user created successfully.')
    }

    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error('Failed to create/update admin:', error.message)

    await mongoose.disconnect()
    process.exit(1)
  }
}

createOrUpdateAdmin()
