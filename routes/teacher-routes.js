const express = require('express')

const {
  getAllTeachers,
  getTeacherById,
  updateTeacher,
} = require('../controllers/teacher-controller')
const isAuth = require('../middleware/isAuth')

/**
 * @openapi
 * /api/all-teachers:
 *  get:
 *     tags:
 *     - Teacher
 *     description: Returns all registered sessions
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AllSessionsResponse'
 *       401:
 *        description: Unauthorized
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 * /api/teachers/{teacherId}:
 *  get:
 *     tags:
 *     - Teacher
 *     description: Returns teacher by Id
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Session'
 *       401:
 *        description: Unauthorized
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 *  put:
 *     tags:
 *     - Teacher
 *     description: Updates session by Id
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/RegisterSessionRequest'
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GeneralResponse'
 *       401:
 *        description: Unauthorized
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 */

const router = express.Router()

router.route('/api/all-teachers').get(getAllTeachers)

router
  .route('/api/teachers/:teacherId')
  .get(isAuth, getTeacherById)
  .put(isAuth, updateTeacher)

module.exports = router
