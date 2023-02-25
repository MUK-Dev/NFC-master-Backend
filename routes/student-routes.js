const express = require('express')

const {
  findStudents,
  getAllStudents,
} = require('../controllers/student-controller')
const isAuth = require('../middleware/isAuth')

/**
 * @openapi
 * /api/students/search:
 *  post:
 *     tags:
 *     - Students
 *     description: Searches registered students
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              type: object
 *              properties:
 *                query:
 *                  type: string
 *                type:
 *                  type: string
 *                  default: name
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

router.route('/api/students/search').post(isAuth, findStudents)

router.route('/api/students').get(isAuth, getAllStudents)

module.exports = router
