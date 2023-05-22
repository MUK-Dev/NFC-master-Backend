const express = require('express')

const {
  findStudents,
  getAllStudents,
  getStudentsAttendanceData,
  getStudentById,
  updateStudent,
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
 * /api/attendance-student-data:
 *  get:
 *     tags:
 *     - Students
 *     description: Returns students data for attendance
 *     parameters:
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: program
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: session
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: section
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/StudentAttendanceDataResponse'
 *       401:
 *        description: Unauthorized
 *       500:
 *        description: Something went wrong (Server error)
 * /api/students/{studentId}:
 *  get:
 *     tags:
 *     - Students
 *     description: Returns student by Id
 *     parameters:
 *       - in: path
 *         name: studentId
 *         schema:
 *           type: string
 *         required: true
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
 *  put:
 *     tags:
 *     - Students
 *     description: Returns student by Id
 *     parameters:
 *       - in: path
 *         name: studentId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/RegisterStudentRequest'
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

router
  .route('/api/students/:studentId')
  .get(isAuth, getStudentById)
  .put(isAuth, updateStudent)

router
  .route('/api/attendance-student-data')
  .get(isAuth, getStudentsAttendanceData)

module.exports = router
