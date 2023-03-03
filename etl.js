require('dotenv').config()
const { default: mongoose } = require('mongoose')
const { Sheet, Attendance } = require('./models/attendance-model')

;(async () => {
  mongoose.set('strictQuery', false)
  //? === Database Connection ===
  mongoose
    .connect(process.env.MONGODB_KEY)
    .then(() => {
      console.log('Connected to db')
    })
    .catch(err => console.error(err))
  try {
    const sheets = await Sheet.find()
    for (let sheet of sheets) {
      await Attendance.updateMany(
        { sheet: sheet._id },
        { $set: { date: sheet.date } },
      ).clone()
    }
    const attendanceDate = await Attendance.find({ sheet: sheets[0]._id })
    console.log(attendanceDate)
    mongoose.connection.close().then(() => console.log('Job done'))
  } catch (err) {
    console.log(err)
  }
})()
