const express = require('express')

const {
  registerSubjectTeachers,
  getAllSubjectTeachers,
} = require('../controllers/subject-teachers-controller')
const isAuth = require('../middleware/isAuth')

const router = express.Router()

router
  .route('/api/subject-teachers')
  .get(isAuth, getAllSubjectTeachers)
  .post(isAuth, registerSubjectTeachers)

module.exports = router
