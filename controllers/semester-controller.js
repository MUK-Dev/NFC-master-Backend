const moment = require('moment')
const Model = require('../models/semester-model')

const registerSemester = async (req, res, next) => {
  const {
    semester_title,
    type,
    starting,
    ending,
    department,
    program,
    session,
  } = req.body
  const required = {
    semester_title,
    type,
    starting,
    ending,
    department,
    program,
    session,
  }

  for (let val in required) {
    if (!required[val]) {
      return res.status(404).send({ message: `${val} is required!`, type: val })
    }
  }

  try {
    const existingSemester = await Model.find({
      semester_title,
      type,
      department,
      program,
      session,
    })
    if (existingSemester.length > 0)
      return res.status(404).send({
        message: 'This section is already registered in this session',
        type: 'semester',
      })
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'server' })
  }

  const semester = Model({
    semester_title,
    type,
    starting,
    ending,
    department,
    program,
    session,
  })

  try {
    await semester.save()
    res.status(202).send({
      message: 'Successfully Registered',
      type: 'semester',
    })
  } catch (e) {
    console.error(e)
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'session' })
  }
}

const getAllDependentSemesters = async (req, res, next) => {
  try {
    const data = await Model.find({
      department: req.query.department,
      program: req.query.program,
      session: req.query.session,
    }).populate(['department', 'program', 'session'])
    res.status(200).send(data)
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'semesters' })
  }
}

const getSemester = async (req, res) => {
  try {
    const semesters = await Model.find({ session: req.body.session_id })
    const today = moment()
    const selectedSemester = semesters.find(
      row =>
        today.isAfter(moment(new Date(row.starting))) &&
        today.isBefore(moment(new Date(row.ending))),
    )
    const semester_title = parseInt(selectedSemester.semester_title)
    const semester_id = selectedSemester._id
    const totalDays = moment(new Date(selectedSemester.ending)).diff(
      new Date(selectedSemester.starting),
      'day',
    )
    const pastDays = moment(today).diff(
      new Date(selectedSemester.starting),
      'day',
    )
    const percentage = parseInt((pastDays / totalDays) * 100)

    return res.send({
      semester_id: semester_id,
      semester_title: semester_title,
      percentage: percentage,
      ending: moment(new Date(selectedSemester.ending)),
    })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .send({ type: 'server', message: 'Something went wrong' })
  }
}

const getAllSemesters = async (req, res) => {
  try {
    const data = await Model.find().populate([
      'department',
      'program',
      'session',
    ])
    res.status(200).send(data)
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'semesters' })
  }
}

const getSemesterById = async (req, res) => {
  const { semesterId } = req.params
  try {
    const data = await Model.findById(semesterId)
    if (!data)
      return res
        .status(404)
        .send({ message: 'Could not find any semester', type: 'semester' })
    res.status(200).send(data)
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'semester' })
  }
}

const updateSemester = async (req, res) => {
  const { semester } = req.params
  const { _id, ...rest } = req.body

  try {
    await Model.findOneAndReplace({ _id: semester }, { ...rest })
    return res
      .status(200)
      .send({ message: 'Successfully updated', type: 'semester' })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'semester' })
  }
}

module.exports = {
  registerSemester,
  getAllDependentSemesters,
  getSemester,
  getAllSemesters,
  getSemesterById,
  updateSemester,
}
