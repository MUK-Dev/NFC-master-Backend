const express = require('express')

const {
  markAttendanceList,
  getAttendanceChartData,
  getAttendanceCalendarData,
  markAttendanceByQr,
} = require('../controllers/attendance-controller')
const isAuth = require('../middleware/isAuth')

/**
 * @openapi
 * /api/attendance/student:
 *  post:
 *     tags:
 *     - Attendance
 *     description: Saves a list of students attendance
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
 *              $ref: '#/components/schemas/AttendanceListPostResponse'
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 * /api/attendance/student/chart-data:
 *  get:
 *     tags:
 *     - Attendance
 *     description: Returns attendance data for chart
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AttendanceChartDataResponse'
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 * /api/attendance/student/calendar-data:
 *  get:
 *     tags:
 *     - Attendance
 *     description: Returns attendance data for calendar
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AttendanceCalendarDataResponse'
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 * /api/mark-by-qr/{sheetId}:
 *  post:
 *     tags:
 *     - Attendance
 *     description: Saves a list of students attendance
 *     parameters:
 *       - in: path
 *         name: sheetId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/MarkAttendanceByQRRequest'
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/MarkByQrPostResponse'
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 */

const router = express.Router()

router.route('/api/attendance/student').post(isAuth, markAttendanceList)
router
  .route('/api/attendance/student/chart-data')
  .get(isAuth, getAttendanceChartData)

router
  .route('/api/attendance/student/calendar-data')
  .get(isAuth, getAttendanceCalendarData)

router.route('/api/mark-by-qr/:sheetId').post(isAuth, markAttendanceByQr)

module.exports = router
