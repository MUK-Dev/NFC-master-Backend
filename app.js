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

    //?=== API Instruction Page ===
    // this.app.get('/', (req, res) =>
    //   res.sendFile(__dirname + '/views/index.html'),
    // )

    new RouteMessage('GET', '/')
    new RouteMessage('POST', '/api/student/register')
    new RouteMessage('POST', '/api/login')
    new RouteMessage('GET', '/api/get-user')
    new RouteMessage('GET, POST', '/api/departments')
    new RouteMessage('GET, POST', '/api/programs')
    new RouteMessage('GET, POST', '/api/sessions')
    new RouteMessage('GET, POST', '/api/semesters')
    new RouteMessage('GET, POST', '/api/subjects')
    new RouteMessage('GET, POST', '/api/subject-students')
    new RouteMessage('GET, POST', '/api/subject-teachers')
    new RouteMessage('GET ', '/api/students/search')
  }

  runApp() {
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
