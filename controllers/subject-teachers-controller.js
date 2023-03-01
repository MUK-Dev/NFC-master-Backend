const Model = require('../models/subject-teachers-model')
const HttpError = require('../utils/HttpError')

const registerSubjectTeachers = async (req, res, next) => {
  const { teacher, department, program, session, subject, semester, section } =
    req.body
  const required = {
    teacher,
    department,
    program,
    session,
    subject,
    semester,
    section,
  }

  for (let val in required) {
    if (!required[val]) {
      return res.status(404).send({ message: `${val} is required!`, type: val })
    }
  }

  const subjectTeachers = Model({
    teacher,
    department,
    program,
    session,
    subject,
    semester,
    section,
  })

  try {
    await subjectTeachers.save()
    res.status(202).send({
      type: 'subject-teacher',
      message: 'Successfully Registered',
    })
  } catch (e) {
    console.error(e)
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'subject-teachers' })
  }
}

const getAllSubjectTeachers = async (req, res, next) => {
  try {
    const data = await Model.find().populate([
      'department',
      'program',
      'session',
      'semester',
      'section',
      'subject',
    ])
    res.status(200).send(data)
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'subject-teachers' })
  }
}

module.exports = {
  registerSubjectTeachers,
  getAllSubjectTeachers,
}
