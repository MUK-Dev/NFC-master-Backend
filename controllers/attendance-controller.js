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
    date,
    list,
  } = req.body

  const required = {
    teacher,
    department,
    program,
    session,
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

  res.status(200).send({ message: 'success', type: 'mark-attendance' })
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

module.exports = {
  markAttendanceList,
  getAttendanceChartData,
  getAttendanceCalendarData,
}
