const express = require('express')

const { registerDepartment } = require('../controllers/department-controller')
const isAuth = require('../middleware/isAuth')

const router = express.Router()

router.route('/api/departments').get().post(isAuth, registerDepartment)

module.exports = router

/*
MVC Pattern:

Model: Schema of data

View: Presentation of data

Controller: Functionality
*/
