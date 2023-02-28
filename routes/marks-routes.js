const express = require('express')
const { studentmarks } = require('../controllers/marks-controller')

const isAuth = require('../middleware/isAuth')

/**
 * @openapi
 * /api/marks:
 *  post:
 *     tags:
 *     - StudentMarks
 *     description: Saves a list of students marks
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/AttendanceListRequest'
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/MarksResponse'
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 */

const router = express.Router()

router.route('/api/marks').post(studentmarks)

module.exports = router
