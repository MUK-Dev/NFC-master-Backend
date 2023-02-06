const bcrypt = require('bcrypt')
const crypto = require('crypto')

const { Student } = require('../models/user-models')
const HttpError = require('../utils/HttpError')
const { genToken } = require('../utils/generate-token')

const emailRegexp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

//? === Register Student ===

const registerStudent = async (req, res, next) => {
  let existingStudent
  let avatar

  const {
    name,
    email,
    password,
    section,
    session,
    program,
    rollNo,
    gender,
    phoneNo,
  } = req.body

  console.table({
    name,
    email,
    password,
    section,
    session,
    program,
    rollNo,
    gender,
    phoneNo,
  })

  const avatarHash = crypto
    .createHash('md5')
    .update(email?.toLowerCase())
    .digest('hex')

  if (gender)
    avatar = `https://avatars.dicebear.com/api/${gender}/:${avatarHash}.svg`
  else avatar = `https://avatars.dicebear.com/api/bottts/:${avatarHash}.svg`

  if (!emailRegexp.test(email)) {
    return res
      .status(404)
      .send({ message: 'Invalid Email Address', type: 'email' })
  }

  if (password.length < 8) {
    return res.status(404).send({
      message: 'Password should be more than 8 Characters',
      type: 'password',
    })
  }

  // ! Checking If Student with same email already exists
  try {
    existingStudent = await Student.findOne({ email: email })
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'email' })
  }

  if (existingStudent) {
    return res
      .status(403)
      .send({ message: 'Email already in use', type: 'email' })
  }
  //!-------------------------------------------------------

  // !Creating New Student
  const saltRounds = await bcrypt.genSalt(10)
  bcrypt.hash(password, saltRounds, async (e, hash) => {
    if (e) {
      console.error('Bcrypt: While hashing', e)
      return res
        .status(500)
        .send({ message: 'Something went wrong', type: 'password' })
    }
    const user = Student({
      name,
      email,
      password: hash,
      avatar,
      section,
      session,
      program,
      rollNo,
      phoneNo,
      role: 'Student',
    })

    try {
      await user.save()

      const token = genToken(user)

      res.status(202).send({
        token,
        type: 'register',
      })
    } catch (err) {
      console.error('While Saving User', err)
      return res.status(500).send({
        message: "Couldn't Register, please try again",
        type: 'password',
      })
    }
  })
  // !-------------------------------------------
}

//-------------------------------------------------------

//? === Login User ===

const login = async (req, res, next) => {
  const { email, password } = req.body
  try {
    const foundUser = await Student.findOne({ email: email })
    if (!foundUser)
      return res.status(404).send({ message: 'Invalid Email', type: 'email' })
    bcrypt.compare(password, foundUser.password, async (e, result) => {
      if (result) {
        const token = genToken(foundUser)
        res.status(202).send({
          token,
          type: 'login',
        })
      } else {
        console.error(e)
        return res
          .status(404)
          .send({ message: "Passwords Don't Match", type: 'password' })
      }
    })
  } catch (err) {
    console.error(err)
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'server' })
  }
}

// ---------------------------------------------------

//? === Login User ===
const getUser = async (req, res, next) => {
  try {
    const user = await Student.findById(req.userInfo.tokenUser.id).select(
      '-password',
    )
    return res.status(200).send(user)
  } catch (err) {
    console.log(err)
    return res.status(500).send('Could not find user')
  }
}

// ---------------------------------------------------

module.exports = {
  login,
  registerStudent,
  getUser,
}
