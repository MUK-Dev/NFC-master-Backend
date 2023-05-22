const Model = require('../models/subject-model')
const { Teacher } = require('../models/user-models')

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

  try {
    const existingSubjects = await Model.find({
      subject_title,
      type,
      subject_code,
      department,
      program,
      session,
      semester,
    })
    if (existingSubjects.length > 0)
      return res.status(404).send({
        message: 'This subject is already registered in this semester',
        type: 'subject',
      })
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'server' })
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

    for (let j = 0; j < subjects.length; j++) {
      const teacher = await Teacher.find({
        'subjects.subject': subjects[j]._id,
        'subjects.theory_hours': { $ne: ' ' },
      })

      subjectData[j] = {
        title: subjects[j].subject_title,
        teacher: teacher[0]?.name || null,
        hours: `${subjects[j].theory_hours} + ${subjects[j].lab_hours}`,
      }
    }

    return res.status(200).send(subjectData)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .send({ type: 'server', message: 'Something went wrong' })
  }
}

const getSubjectById = async (req, res) => {
  const { subjectId } = req.params
  try {
    const data = await Model.findById(subjectId)
    if (!data)
      return res
        .status(404)
        .send({ message: 'Could not find any subject', type: 'subject' })
    res.status(200).send(data)
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'subject' })
  }
}

const updateSubject = async (req, res) => {
  const { subjectId } = req.params
  const { _id, ...rest } = req.body

  try {
    await Model.findOneAndReplace({ _id: subjectId }, { ...rest })
    return res
      .status(200)
      .send({ message: 'Successfully updated', type: 'subject' })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'subject' })
  }
}

module.exports = {
  registerSubject,
  getAllSubjects,
  getAllSubjectsDependent,
  getSubject,
  getSubjectById,
  updateSubject,
}
