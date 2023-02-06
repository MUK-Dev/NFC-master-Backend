const express = require('express')

const {
  registerSemester,
  getAllSemesters,
} = require('../controllers/semester-controller')
const isAuth = require('../middleware/isAuth')

const router = express.Router()

router
  .route('/api/semesters')
  .get(isAuth, getAllSemesters)
  .post(isAuth, registerSemester)

module.exports = router
