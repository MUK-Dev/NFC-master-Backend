const express = require('express')

const isAuth = require('../middleware/isAuth')
const { studentAllResult } = require('../controllers/student-result-controller')

const router = express.Router()

router.route('/api/student-result').get(isAuth, studentAllResult)

module.exports = router
