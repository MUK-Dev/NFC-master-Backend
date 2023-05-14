const express = require('express')

const {
  getAllResultSheets,
  findResultSheetById,
  generateClassResultReport,
} = require('../controllers/result-controller')
const isAuth = require('../middleware/isAuth')

/**
 * @openapi
 * /api/result-sheets:
 *  get:
 *     tags:
 *     - Sheets
 *     description: Returns all sheets of a teacher
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GetAllSheetsResponse'
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 * /api/sheet/{sheetId}:
 *  get:
 *     tags:
 *     - Sheets
 *     description: Returns sheet
 *     parameters:
 *       - in: path
 *         name: sheetId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GetSheetResponse'
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 */

const router = express.Router()

router.route('/api/result-sheets').get(isAuth, getAllResultSheets)

router.route('/api/result-sheet/:sheetId').get(isAuth, findResultSheetById)

router
  .route('/api/result/subject-report')
  .post(isAuth, generateClassResultReport)

module.exports = router
