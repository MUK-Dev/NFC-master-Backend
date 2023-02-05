const Model = require('../models/subject-teachers-model')
const HttpError = require('../utils/HttpError')

const registerSubjectTeachers = async (req, res, next) => {
  const { teachers, department, program, session, subject, semester } = req.body
  const required = {
    teachers,
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

  const subjectTeachers = Model({
    teachers,
    department,
    program,
    session,
    subject,
    semester,
  })

  try {
    await subjectTeachers.save()
    res.status(202).send({
      type: 'subject-teachers',
      message: 'Successfully Registered',
    })
  } catch (e) {
    console.error(e)
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'subject-teachers' })
  }
}

module.exports = {
  registerSubjectTeachers,
}
