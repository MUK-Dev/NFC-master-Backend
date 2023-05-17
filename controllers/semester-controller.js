const moment = require('moment')
const Model = require('../models/semester-model')
const HttpError = require('../utils/HttpError')

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

const getAllSemesters = async (req, res, next) => {
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

module.exports = {
  registerSemester,
  getAllSemesters,
  getSemester,
}
