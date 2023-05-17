const Model = require('../models/subject-model')
const Teacher = require('../models/subject-teachers-model')

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

const getAllSubjectsDependent = async (req, res, next) => {
  try {
    const data = await Model.find({
      department: req.query.department,
      program: req.query.program,
      session: req.query.session,
      semester: req.query.semester,
    }).populate(['department', 'program', 'session', 'semester'])
    return res.status(200).send(data)
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'subjects' })
  }
}

const getAllSubjects = async (req, res) => {
  try {
    const data = await Model.find().populate([
      'department',
      'program',
      'session',
      'semester',
    ])
    return res.status(200).send(data)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'subjects' })
  }
}

const getSubject = async (req, res) => {
  try {
    const subjects = await Model.find({ semester: req.body.semesterId })
    const subjectData = []
    const subjectIds = subjects.map(s => s._id)
    const teachers = await Teacher.find({
      'subjects.subject': { $in: subjectIds },
    })
    console.log(teachers)
    return res.status(200).send(teachers)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .send({ type: 'server', message: 'Something went wrong' })
  }
}

module.exports = {
  registerSubject,
  getAllSubjects,
  getAllSubjectsDependent,
  getSubject,
}
