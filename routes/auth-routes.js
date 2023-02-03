const express = require('express')

const {
  registerStudent,
  login,
  getUser,
} = require('../controllers/auth-controller')
const isAuth = require('../middleware/isAuth')

const router = express.Router()

router.route('/api/student/register').post(registerStudent)

router.route('/api/login').post(login)

router.route('/api/get-user').get(isAuth, getUser)

module.exports = router
