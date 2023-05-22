const bcrypt = require('bcrypt')

const { Student, Parent, Admin, Teacher } = require('../models/user-models')
const { genToken } = require('../utils/generate-token')
const createAvatarHash = require('../utils/createAvatarHash')
const Program = require('../models/program-model')
const Section = require('../models/section-model')
const Session = require('../models/session-model')

const emailRegexp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

//? === Register Student ===

const registerStudent = async (req, res) => {
  let avatar
  let existingStudent
  let email

  const {
    name,
    password,
    section,
    session,
    program,
    rollNo,
    gender,
    phoneNo,
    department,
  } = req.body

  try {
    const userProgram = await Program.findById(program)
    const userSession = await Session.findById(session)

    email = `${
      userSession.session_title
    }${userProgram.program_abbreviation.toLowerCase()}${rollNo}@undergrad.nfciet.edu.pk`
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .send({ type: 'server', message: 'Something went wrong' })
  }

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
      department,
      role: 'Student',
    })

    console.table({
      name,
      password,
      section,
      session,
      program,
      rollNo,
      gender,
      phoneNo,
      department,
      email,
    })

    await user.save()

    const token = genToken(user)

    res.status(202).send({
      token,
      type: 'register',
      email,
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

  // ! Checking If Parent with same email already exists
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

  // !Creating New Parent
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

//? === Register Admin ===

const registerAdmin = async (req, res) => {
  let avatar
  let existingAdmin

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

  // ! Checking If Admin with same email already exists
  try {
    existingAdmin = await Admin.findOne({ email: email })
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'email' })
  }

  if (existingAdmin) {
    return res
      .status(403)
      .send({ message: 'Email already in use', type: 'email' })
  }
  //!-------------------------------------------------------

  // !Creating New Admin
  try {
    const user = Admin({
      name,
      email,
      password,
      phoneNo,
      avatar,
      role: 'Admin',
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

//? === Register Admin ===

const registerTeacher = async (req, res) => {
  let avatar
  let existingTeacher

  const { name, email, password, phoneNo, subjects } = req.body

  console.table({
    name,
    email,
    password,
    phoneNo,
    subjects,
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

  // ! Checking If Admin with same email already exists
  try {
    existingTeacher = await Teacher.findOne({ email: email })
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'email' })
  }

  if (existingTeacher) {
    return res
      .status(403)
      .send({ message: 'Email already in use', type: 'email' })
  }
  //!-------------------------------------------------------

  // !Creating New Admin
  try {
    const user = Teacher({
      name,
      email,
      password,
      phoneNo,
      avatar,
      subjects,
      role: 'Teacher',
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

//? === Login User ===

const login = async (req, res, next) => {
  let foundUser
  const { email, password } = req.body
  try {
    foundUser = await Student.findOne({ email })
    if (!foundUser) foundUser = await Parent.findOne({ email })
    if (!foundUser) foundUser = await Admin.findOne({ email })
    if (!foundUser) foundUser = await Teacher.findOne({ email })
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
  let user
  try {
    user = await Student.findById(req.userInfo.tokenUser.id)
      .select('-password')
      .populate(['program', 'session'])
    if (!user)
      user = await Parent.findById(req.userInfo.tokenUser.id).select(
        '-password',
      )
    if (!user)
      user = await Admin.findById(req.userInfo.tokenUser.id).select('-password')
    if (!user)
      user = await Teacher.findById(req.userInfo.tokenUser.id)
        .select('-password')
        .populate({
          path: 'subjects.subject',
          populate: ['department', 'program', 'semester', 'session'],
        })
    if (!user)
      return res
        .status(404)
        .send({ message: 'Could not find user', type: 'get-user' })
    return res.status(200).send(user)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .send({ message: 'Could not find user', type: 'get-user' })
  }
}

// ---------------------------------------------------

module.exports = {
  login,
  registerStudent,
  registerParent,
  registerTeacher,
  registerAdmin,
  getUser,
}
