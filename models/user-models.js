const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

/**
 * @openapi
 * components:
 *  schemas:
 *    ParentsResponse:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        name:
 *          type: string
 *        email:
 *          type: string
 *        phoneNo:
 *          type: string
 *        avatar:
 *          type: string
 *        role:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 *    StudentResponse:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        name:
 *          type: string
 *        email:
 *          type: string
 *        section:
 *          type: string
 *        session:
 *          type: string
 *        program:
 *          type: string
 *        rollNo:
 *          type: string
 *        phoneNo:
 *          type: string
 *        gender:
 *          type: string
 *        avatar:
 *          type: string
 *        role:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 *    TokenResponse:
 *      type: object
 *      properties:
 *        token:
 *          type: string
 *        type:
 *          type: string
 *    LoginRequest:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *        password:
 *          type: string
 *    RegisterStudentRequest:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *        email:
 *          type: string
 *        section:
 *          type: string
 *        session:
 *          type: string
 *        program:
 *          type: string
 *        rollNo:
 *          type: string
 *        gender:
 *          type: string
 *        phoneNo:
 *          type: string
 *        password:
 *          type: string
 *    RegisterParentRequest:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *        email:
 *          type: string
 *        phoneNo:
 *          type: string
 *        password:
 *          type: string
 */

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
    role: String,
  },
  { timestamps: true },
)

studentSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next()
    const hashed = await bcrypt.hash(this['password'], 10)
    this['password'] = hashed
    return next()
  } catch (err) {
    return next(err)
  }
})

parentSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next()
    const hashed = await bcrypt.hash(this['password'], 10)
    this['password'] = hashed
    return next()
  } catch (err) {
    return next(err)
  }
})

module.exports = {
  Student: mongoose.model('Student', studentSchema),
  Parent: mongoose.model('Parent', parentSchema),
}
