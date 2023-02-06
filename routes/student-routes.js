const express = require('express')

const { findStudents } = require('../controllers/student-controller')
const isAuth = require('../middleware/isAuth')

const router = express.Router()

router.route('/api/students/search').get(findStudents)

module.exports = router
