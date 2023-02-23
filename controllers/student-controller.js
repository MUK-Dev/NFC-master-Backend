const { Student } = require('../models/user-models')

const findStudents = async (req, res, next) => {
  const query = new RegExp(req.body.query, 'i')
  try {
    const data = await Student.find({ [req.body.type]: query })
    res.send(data)
  } catch (error) {
    console.log(error)
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

module.exports = {
  findStudents,
  getAllStudents,
}
