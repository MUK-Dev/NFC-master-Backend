const { Sheet, Attendance } = require('../models/attendance-model')

const getAllTeacherSheets = async (req, res) => {
  try {
    const sheets = await Sheet.find({
      teacher: req.userInfo.tokenUser.id,
    })
      .sort({ date: -1 })
      .populate([
        'department',
        'program',
        'session',
        'section',
        'semester',
        'subject',
      ])
    res.status(200).send(sheets)
  } catch (err) {
    console.log(err)
    res.status(500).send({ type: 'server', message: 'Something went wrong' })
  }
}

const getAllSheets = async (req, res) => {
  try {
    const sheets = await Sheet.find()
      .sort({ date: -1 })
      .populate([
        'department',
        'program',
        'session',
        'section',
        'semester',
        'subject',
        'teacher',
      ])
    res.status(200).send(sheets)
  } catch (err) {
    console.log(err)
    res.status(500).send({ type: 'server', message: 'Something went wrong' })
  }
}

const findSheetById = async (req, res) => {
  try {
    const sheet = await Sheet.findById(req.params.sheetId).populate([
      'department',
      'program',
      'session',
      'section',
      'semester',
      'subject',
      'teacher',
    ])
    const attendanceList = await Attendance.find({ sheet: sheet._id }).populate(
      'student',
    )

    res.status(200).send({
      sheet,
      list: attendanceList,
    })
  } catch (err) {
    console.log(err)
    res.status(500).send({ type: 'server', message: 'Something went wrong' })
  }
}

module.exports = {
  getAllTeacherSheets,
  findSheetById,
  getAllSheets,
}
