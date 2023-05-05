require('dotenv').config()
const moment = require('moment')
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
    // await Sheet.updateMany({}, { section: '63ff0f5ff4bceba698b5320b' })
    // for (let sheet of sheets) {
    //   await Attendance.updateMany(
    //     { sheet: sheet._id },
    //     { $set: { date: sheet.date } },
    //   ).clone()
    // }
    // const attendanceDate = await Attendance.find({ sheet: sheets[0]._id })
    // console.log(attendanceDate)
    // const data = await Attendance.deleteMany({
    //   date: {
    //     $gte: moment('2022-10-14').toDate(),
    //     $lt: moment('2022-10-15').toDate(),
    //   },
    // })
    // console.log(data)
    const sheets = await Sheet.find({ teacher: '644e3b257dd225e87e6af597' })
    for (let sheet of sheets) {
      await Attendance.deleteMany({ sheet: sheet._id })
    }
    await Sheet.deleteMany({ teacher: '644e3b257dd225e87e6af597' })
    mongoose.connection.close().then(() => console.log('Job done'))
  } catch (err) {
    console.log(err)
  }
})()
