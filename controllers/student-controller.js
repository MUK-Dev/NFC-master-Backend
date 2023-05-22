const { Student } = require('../models/user-models')

const findStudents = async (req, res, next) => {
  const query = new RegExp(req.body.query, 'i')
  try {
    const data = await Student.find({
      [req.body.type ? req.body.type : 'name']: query,
    }).populate(['program', 'session'])
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

module.exports = {
  findStudents,
  getAllStudents,
  getStudentsAttendanceData,
}
