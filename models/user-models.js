const mongoose = require('mongoose')

const studentSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    section: String,
    session: String,
    program: String,
    rollNo: String,
    gender: String,
    phoneNo: String,
    password: String,
    avatar: String,
    role: String,
  },
  { timestamps: true },
)

const parentSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    phoneNo: String,
    password: String,
    avatar: String,
  },
  { timestamps: true },
)

module.exports = {
  Student: mongoose.model('Student', studentSchema),
  Parent: mongoose.model('Parent', parentSchema),
}
