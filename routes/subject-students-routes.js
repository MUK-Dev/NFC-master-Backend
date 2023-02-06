const express = require('express')

const {
  registerSubjectStudents,
  getAllSubjectStudents,
} = require('../controllers/subject-students-controllers')
const isAuth = require('../middleware/isAuth')

const router = express.Router()

router
  .route('/api/subject-students')
  .get(isAuth, getAllSubjectStudents)
  .post(isAuth, registerSubjectStudents)

module.exports = router
