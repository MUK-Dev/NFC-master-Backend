const bcrypt = require('bcrypt')

const { Student, Parent } = require('../models/user-models')
const { genToken } = require('../utils/generate-token')
const createAvatarHash = require('../utils/createAvatarHash')

const emailRegexp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

//? === Register Student ===

const registerStudent = async (req, res) => {
  let avatar
  let existingStudent

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

  const avatarHash = createAvatarHash(email)

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
  try {
    const user = Student({
      name,
      email,
      password,
      avatar,
      section,
      session,
      program,
      rollNo,
      phoneNo,
      role: 'Student',
    })

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
  // !-------------------------------------------
}

//-------------------------------------------------------

//? === Register Parent ===

const registerParent = async (req, res) => {
  let avatar
  let existingParent

  const { name, email, password, phoneNo } = req.body

  console.table({
    name,
    email,
    password,
    phoneNo,
  })

  const avatarHash = createAvatarHash(email)

  avatar = `https://avatars.dicebear.com/api/bottts/:${avatarHash}.svg`

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
    existingParent = await Parent.findOne({ email: email })
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'email' })
  }

  if (existingParent) {
    return res
      .status(403)
      .send({ message: 'Email already in use', type: 'email' })
  }
  //!-------------------------------------------------------

  // !Creating New Student
  try {
    const user = Parent({
      name,
      email,
      password,
      phoneNo,
      avatar,
      role: 'Parent',
    })

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
  // !-------------------------------------------
}

//-------------------------------------------------------

//? === Login User ===

const login = async (req, res, next) => {
  let foundUser
  const { email, password } = req.body
  try {
    foundUser = await Student.findOne({ email })
    if (!foundUser) foundUser = await Parent.findOne({ email })
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
          .send({ message: 'Invalid Password', type: 'password' })
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
  registerParent,
  getUser,
}
