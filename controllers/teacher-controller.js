const { Teacher } = require('../models/user-models')
const bcrypt = require('bcrypt')

const getAllTeachers = async (req, res) => {
  try {
    const data = await Teacher.find().select('-password')
    return res.status(200).send(data)
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'teacher' })
  }
}

const getTeacherById = async (req, res) => {
  const { teacherId } = req.params
  try {
    const data = await Teacher.findById(teacherId).select('-password')
    if (!data)
      return res
        .status(404)
        .send({ message: 'Could not find any teacher', type: 'teacher' })

    return res.status(200).send(data)
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'teacher' })
  }
}

const updateTeacher = async (req, res) => {
  const { name, email, phoneNo, password, subjects } = req.body
  const { teacherId } = req.params

  if (password.length < 8) {
    return res.status(404).send({
      message: 'Password should be more than 8 Characters',
      type: 'password',
    })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const r = await Teacher.findOneAndUpdate(
      { _id: teacherId },
      {
        $set: { name, email, phoneNo, subjects, password: hashedPassword },
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
  getAllTeachers,
  getTeacherById,
  updateTeacher,
}
