const express = require('express')

const {
  registerDepartment,
  getAllDepartments,
} = require('../controllers/department-controller')
const isAuth = require('../middleware/isAuth')

const router = express.Router()

router
  .route('/api/departments')
  .get(isAuth, getAllDepartments)
  .post(isAuth, registerDepartment)

module.exports = router

/*
MVC Pattern:

Model: Schema of data

View: Presentation of data

Controller: Functionality
*/
