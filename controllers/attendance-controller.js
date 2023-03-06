const moment = require('moment')
const { Sheet, Attendance } = require('../models/attendance-model')

const markAttendanceList = async (req, res) => {
  const {
    teacher,
    department,
    program,
    session,
    semester,
    subject,
    section,
    date,
    list,
  } = req.body

  const required = {
    teacher,
    department,
    program,
    session,
    section,
    semester,
    subject,
    date,
    list,
  }

  for (let val in required) {
    if (!required[val]) {
      return res.status(404).send({ message: `${val} is required!`, type: val })
    }
  }

  const sheet = Sheet({
    teacher,
    department,
    program,
    session,
    section,
    semester,
    subject,
    date,
  })

  try {
    await sheet.save()
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .message({ type: 'sheet', message: 'Could not save attendance sheet' })
  }

  for (let item of list) {
    const singleStudentAttendance = Attendance({
      ...item,
      sheet: sheet._id,
      date,
    })
    try {
      await singleStudentAttendance.save()
    } catch (err) {
      console.log(err)
      return res
        .status(500)
        .message({ type: 'sheet', message: 'Could not save attendance' })
    }
  }

  res
    .status(200)
    .send({ message: 'success', type: 'mark-attendance', sheet: sheet._id })
}

const getAttendanceChartData = async (req, res) => {
  try {
    const data = await Attendance.find({
      student: req.userInfo.tokenUser.id,
    }).sort({ date: 1 })
    let modifiedData = []
    let key = 'date'

    data.forEach(d => {
      if (
        modifiedData.some(val => {
          return moment(val['x']).isSame(d[key], 'day')
        })
      ) {
        modifiedData.forEach(k => {
          if (moment(k['x']).isSame(d[key], 'day') && d.present === true) {
            k['y']++
          }
        })
      } else {
        let a = {}
        a['x'] = d[key]
        a['y'] = 1
        modifiedData.push(a)
      }
    })
    res.status(200).send(modifiedData)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .send({ type: 'server', message: 'Something went wrong' })
  }
}

const getAttendanceCalendarData = async (req, res) => {
  try {
    const data = await Attendance.find({
      student: req.userInfo.tokenUser.id,
    })
      .sort({ date: 1 })
      .populate({
        path: 'sheet',
        populate: {
          path: 'subject',
        },
      })

    const modifiedData = data.map(a => ({
      title: `${
        a.present ? 'Present' : 'Absent'
      } - ${a.sheet.subject.subject_title.match(/\b([A-Z])/g).join('')}`,
      date: a.date,
      color: a.present ? '#4caf50' : '#ef5350',
    }))

    res.status(200).send(modifiedData)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .send({ type: 'server', message: 'Something went wrong' })
  }
}

const markAttendanceByQr = async (req, res) => {
  const student = req.userInfo.tokenUser.id
  let sheet
  try {
    sheet = await Sheet.findById(req.params.sheetId)
  } catch (err) {
    return res
      .status(500)
      .send({ type: 'server', message: 'Something went wrong' })
  }

  try {
    const existingEntry = await Attendance.findOne({
      sheet: sheet._id,
      student,
      date: sheet.date,
    })
    if (existingEntry && existingEntry?.present)
      return res.status(200).send({
        type: 'already-marked',
        message: 'Your attendance is already marked',
      })
    else if (existingEntry && !existingEntry?.present) {
      await Attendance.updateOne(
        {
          sheet: sheet._id,
          student,
          date: sheet.date,
        },
        { $set: { present: true } },
      )
    } else if (!existingEntry) {
      const newAttendance = Attendance({
        sheet: sheet._id,
        student,
        date: sheet.date,
        present: true,
      })
      await newAttendance.save()
      return res
        .status(202)
        .send({ type: 'marked', message: 'Your attendance was marked' })
    } else
      return res
        .status(404)
        .send({ type: 'error', message: "Couldn't mark attendance" })
  } catch (err) {
    return res
      .status(500)
      .send({ type: 'server', message: 'Something went wrong' })
  }
}

module.exports = {
  markAttendanceList,
  getAttendanceChartData,
  getAttendanceCalendarData,
  markAttendanceByQr,
}
