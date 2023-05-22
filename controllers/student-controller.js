const bcrypt = require('bcrypt')

const { Student } = require('../models/user-models')

const findStudents = async (req, res, next) => {
  const query = new RegExp(req.body.query, 'i')
  try {
    const data = await Student.find({
      [req.body.type ? req.body.type : 'name']: query,
    })
    res.send(data)
  } catch (err) {
    console.log(err)
  }
}

const getAllStudents = async (req, res, next) => {
  try {
    const data = await Student.find().select('-password')

    return res.send(data)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'get-all-students' })
  }
}

const getStudentById = async (req, res) => {
  const { studentId } = req.params

  try {
    const data = await Student.findById(studentId).select('-password')

    if (!data)
      return res
        .status(404)
        .send({ message: 'Could not find any user', type: 'student' })

    return res.send(data)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'get-all-students' })
  }
}

const getStudentsAttendanceData = async (req, res) => {
  const query = req.query

  try {
    const data = await Student.find({
      department: query.department,
      program: query.program,
      session: query.session,
      section: query.section,
    })
      .select('-password')
      .sort({ rollNo: 1 })

    const modifiedData = data.map(student => ({
      _id: student._id,
      name: student.name,
      avatar: student.avatar,
      rollNo: student.rollNo,
      present: false,
      leave: false,
    }))

    res.status(200).send(modifiedData)
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: 'Somthing went wrong', type: 'server' })
  }
}

const updateStudent = async (req, res) => {
  const {
    name,
    email,
    phoneNo,
    password,
    department,
    program,
    session,
    section,
    rollNo,
    gender,
  } = req.body
  const { studentId } = req.params

  if (password.length < 8) {
    return res.status(404).send({
      message: 'Password should be more than 8 Characters',
      type: 'password',
    })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await Student.findOneAndUpdate(
      { _id: studentId },
      {
        $set: {
          name,
          email,
          phoneNo,
          password: hashedPassword,
          department,
          program,
          session,
          section,
          rollNo,
          gender,
        },
      },
    )

    res.status(202).send({
      message: 'Successfully updated',
      type: 'register',
    })
  } catch (err) {
    console.log(err)
    return res.status(500).send({
      message: "Couldn't update, please try again",
      type: 'server',
    })
  }
}

module.exports = {
  findStudents,
  getAllStudents,
  getStudentsAttendanceData,
  getStudentById,
  updateStudent,
}
