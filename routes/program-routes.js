const express = require('express')

const {
  registerProgram,
  getAllPrograms,
} = require('../controllers/program-controller')
const isAuth = require('../middleware/isAuth')

const router = express.Router()

router
  .route('/api/programs')
  .get(isAuth, getAllPrograms)
  .post(isAuth, registerProgram)

module.exports = router
