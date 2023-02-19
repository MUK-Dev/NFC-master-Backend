const express = require('express')

const {
  findStudents,
  getAllStudents,
} = require('../controllers/student-controller')
const isAuth = require('../middleware/isAuth')

/**
 * @openapi
 * /api/students:
 *  get:
 *     tags:
 *     - Students
 *     description: Returns all registered students
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/StudentResponse'
 *       401:
 *        description: Unauthorized
 *       500:
 *        description: Something went wrong (Server error)
 */

const router = express.Router()

router.route('/api/students/search').get(findStudents)

router.route('/api/students').get(isAuth, getAllStudents)

module.exports = router
