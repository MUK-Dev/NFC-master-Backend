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
    subjectType,
    creditHours,
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
    subjectType,
    creditHours,
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
    subjectType,
    creditHours,
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

// 63ff16eb005ddd64e4564796

const generateSubjectReport = async (req, res) => {
  const { subjectId, sectionId } = req.body
  try {
    const sheets = await Sheet.find({
      subject: subjectId,
      section: sectionId,
      teacher: req.userInfo.tokenUser.id,
    })
      .sort({ date: 1 })
      .populate(['subject', 'teacher'])

    if (sheets.length <= 0) {
      return res
        .status(404)
        .send({ message: 'No records found', type: 'sheets' })
    }

    const tableColumn = ['ID', 'Name', 'Roll no']
    const tableRows = []

    for (let i = 0; i < sheets.length; i++) {
      const attendanceRecords = await Attendance.find({
        sheet: sheets[i]._id,
      })
        .sort({ rollNo: 1 })
        .populate('student')

      tableColumn.push(moment(sheets[i].date).format('DD/MM/YYYY'))
      for (let j = 0; j < attendanceRecords.length; j++) {
        if (!!!tableRows[j])
          tableRows[j] = [
            attendanceRecords[j].student._id,
            attendanceRecords[j].student.name,
            attendanceRecords[j].student.rollNo,
            attendanceRecords[j].leave
              ? 'L'
              : attendanceRecords[j].present
              ? 'P'
              : 'A',
          ]
        else if (!!tableRows[j]) {
          const record = attendanceRecords.filter(r =>
            r.student._id.equals(tableRows[j][0]),
          )[0]
          tableRows[j].push(record.leave ? 'L' : record.present ? 'P' : 'A')
        } else tableRows[j].push('null')
      }
    }

    for (let i = 0; i < tableRows.length; i++) {
      let presentDays = 0
      for (let j = 2; j < tableRows[i].length; j++) {
        if (tableRows[i][j] === 'P') presentDays++
      }
      const percentage = Math.round(
        (presentDays / (tableRows[i].length - 2)) * 100,
      )
      tableRows[i].push(`${percentage}%`)
    }

    tableColumn.push('%')
    tableColumn.shift()
    tableRows.map(row => row.shift())

    return res.send({
      tableColumn,
      tableRows,
      subject_name: sheets[0].subject.subject_title,
      teacher_name: sheets[0].teacher.name,
    })
  } catch (err) {
    console.log(err)
  }
}

const updateAttendanceList = async (req, res) => {
  const { list } = req.body

  if (list.length <= 0)
    return res
      .status(404)
      .send({ message: `List can not be empty`, type: 'list' })

  try {
    for (let item of list) {
      await Attendance.updateOne(
        {
          sheet: req.params.sheetId,
          _id: item.student,
        },
        { $set: { present: item.present, leave: item.leave } },
      )
    }
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .send({ type: 'server', message: 'Something went wrong' })
  }

  res
    .status(200)
    .send({ message: 'Marked attendance', type: 'mark-attendance' })
}

const getAttendanceChartData = async (req, res) => {
  try {
    const data = await Attendance.find({
      student: req.userInfo.tokenUser.id,
      date: {
        $gte: moment().subtract(11, 'days').toDate(),
        $lt: moment().toDate(),
      },
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

const getStudentCalendarData = async (req, res) => {
  const { studentId } = req.params
  try {
    const data = await Attendance.find({
      student: studentId,
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
    if (existingEntry && existingEntry?.present) {
      return res.status(200).send({
        type: 'already-marked',
        message: 'Your attendance is already marked',
      })
    } else if (existingEntry && !existingEntry?.present) {
      await Attendance.updateOne(
        {
          sheet: sheet._id,
          student,
          date: sheet.date,
        },
        { $set: { present: true, leave: false } },
      )
      return res.status(200).send({
        type: 'marked',
        message: 'Marked your attendance',
      })
    } else if (!existingEntry) {
      const newAttendance = Attendance({
        sheet: sheet._id,
        student,
        date: sheet.date,
        present: true,
        leave: false,
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
  updateAttendanceList,
  generateSubjectReport,
  getStudentCalendarData,
}
