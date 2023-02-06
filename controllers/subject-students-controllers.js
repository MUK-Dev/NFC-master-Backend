const Model = require('../models/subject-students-model')
const HttpError = require('../utils/HttpError')

const registerSubjectStudents = async (req, res, next) => {
  const { students, department, program, session, subject, semester } = req.body
  const required = {
    students,
    department,
    program,
    session,
    subject,
    semester,
  }

  for (let val in required) {
    if (!required[val]) {
      return res.status(404).send({ message: `${val} is required!`, type: val })
    }
  }

  const subjectStudents = Model({
    students,
    department,
    program,
    session,
    subject,
    semester,
  })

  try {
    await subjectStudents.save()
    res.status(202).send({
      type: 'subject-students',
      message: 'Successfully Registered',
    })
  } catch (e) {
    console.error(e)
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'subject-students' })
  }
}

const getAllSubjectStudents = async (req, res, next) => {
  try {
    const data = await Model.find().populate([
      'department',
      'program',
      'session',
      'semester',
      'subject',
    ])
    res.status(200).send(data)
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'subject-students' })
  }
}

module.exports = {
  registerSubjectStudents,
  getAllSubjectStudents,
}
