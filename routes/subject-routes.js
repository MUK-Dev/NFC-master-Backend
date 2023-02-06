const express = require('express')

const {
  registerSubject,
  getAllSubjects,
} = require('../controllers/subject-controller')
const isAuth = require('../middleware/isAuth')

const router = express.Router()

router
  .route('/api/subjects')
  .get(isAuth, getAllSubjects)
  .post(isAuth, registerSubject)

module.exports = router
