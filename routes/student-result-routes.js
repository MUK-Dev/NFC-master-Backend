const express = require('express')

const isAuth = require('../middleware/isAuth')
const {
  studentAllResult,
  studentPDFResult,
} = require('../controllers/student-result-controller')

const router = express.Router()

router.route('/api/student-result').post(isAuth, studentAllResult)

router.route('/api/student-result/report').post(isAuth, studentPDFResult)

module.exports = router
