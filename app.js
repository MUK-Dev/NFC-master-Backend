require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const authRoutes = require('./routes/auth-routes')
const departmentRoutes = require('./routes/department-routes')
const programRoutes = require('./routes/program-routes')
const sessionRoutes = require('./routes/session-routes')
const semesterRoutes = require('./routes/semester-routes')
const subjectRoutes = require('./routes/subject-routes')
const subjectStudentsRoutes = require('./routes/subject-students-routes')
const subjectTeachersRoutes = require('./routes/subject-teachers-routes')
const studentRoutes = require('./routes/student-routes')
const parentRoutes = require('./routes/parent-routes')
const attendanceRoutes = require('./routes/attendance-routes')

const RouteMessage = require('./utils/RouteMessage')
const swaggerDocs = require('./utils/swagger')

class ExpressApp {
  constructor() {
    this.app = express()
    this.app.use(express.json())
    this.app.use(cors())
  }

  registerRoutes() {
    //? === Authentication ===
    this.app.use(authRoutes)

    //? === Students ===
    this.app.use(studentRoutes)

    //? === Parents ===
    this.app.use(parentRoutes)

    //? === Department ===
    this.app.use(departmentRoutes)

    //? === Program ===
    this.app.use(programRoutes)

    //? === Session ===
    this.app.use(sessionRoutes)

    //? === Semester ===
    this.app.use(semesterRoutes)

    //? === Subject ===
    this.app.use(subjectRoutes)

    //? === Subject Students ===
    this.app.use(subjectStudentsRoutes)

    //? === Subject Teachers ===
    this.app.use(subjectTeachersRoutes)

    //? === Attendance Routes ===
    this.app.use(attendanceRoutes)
  }

  runApp() {
    mongoose.set('strictQuery', false)
    //? === Database Connection ===
    mongoose
      .connect(process.env.MONGODB_KEY)
      .then(() => {
        let port
        if (process.env.PORT) port = process.env.PORT
        else port = 6000
        this.app.listen(port, () => {
          this.registerRoutes()
          swaggerDocs(this.app, port)
          console.log(`Running On Port: ${port}`)
        })
      })
      .catch(err => console.error(err))

    //------------------------------------------------------------
  }
}

module.exports = {
  ExpressApp,
}
