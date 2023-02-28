const { Sheet, Attendance } = require('../models/attendance-model')

const markAttendanceList = async (req, res) => {
  console.log(req.body)
  const { teacher, department, program, session, semester, subject, list } =
    req.body

  const sheet = Sheet({
    teacher,
    department,
    program,
    session,
    semester,
    subject,
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

module.exports = {
  markAttendanceList,
}
