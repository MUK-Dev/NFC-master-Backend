const express = require('express')

const {
  registerSession,
  getAllSessions,
} = require('../controllers/session-controller')
const isAuth = require('../middleware/isAuth')

const router = express.Router()

router
  .route('/api/sessions')
  .get(isAuth, getAllSessions)
  .post(isAuth, registerSession)

module.exports = router
