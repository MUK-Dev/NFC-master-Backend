const express = require('express')
const {
  studentMarks,
  updateMarkList,
  markMarksList,
  repeaterMarkList,
} = require('../controllers/marks-controller')

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

router.route('/api/marks').post(studentMarks)

router.route('/api/marks/student').post(isAuth, markMarksList)

router.route('/api/marks/student/:sheetId').patch(isAuth, updateMarkList)

router
  .route('/api/repeater_marks/student/:sheetId')
  .post(isAuth, repeaterMarkList)

module.exports = router
