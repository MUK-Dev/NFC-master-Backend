const Model = require('../models/subject-model')
const HttpError = require('../utils/HttpError')

const registerSubject = async (req, res, next) => {
  const {
    subject_title,
    type,
    subject_code,
    theory_hours,
    lab_hours,
    department,
    program,
    session,
    semester,
  } = req.body
  const required = {
    subject_title,
    type,
    subject_code,
    theory_hours,
    lab_hours,
    department,
    program,
    session,
    semester,
  }

  for (let val in required) {
    if (!required[val]) {
      return res.status(404).send({ message: `${val} is required!`, type: val })
    }
  }

  const subject = Model({
    subject_title,
    type,
    subject_code,
    theory_hours,
    lab_hours,
    department,
    program,
    session,
    semester,
  })

  try {
    await subject.save()
    res.status(202).send({
      type: 'subject',
      message: 'Successfully Registered',
    })
  } catch (e) {
    console.error(e)
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'subject' })
  }
}

const getAllSubjects = async (req, res, next) => {
  try {
    const data = await Model.find().populate([
      'department',
      'program',
      'session',
      'semester',
    ])
    res.status(200).send(data)
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'subjects' })
  }
}

module.exports = {
  registerSubject,
  getAllSubjects,
}
