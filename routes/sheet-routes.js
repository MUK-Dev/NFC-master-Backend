const express = require('express')

const {
  getAllSheets,
  findSheetById,
} = require('../controllers/sheet-controller')
const isAuth = require('../middleware/isAuth')

/**
 * @openapi
 * /api/sheets:
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

router.route('/api/sheets').get(isAuth, getAllSheets)

router.route('/api/sheet/:sheetId').get(isAuth, findSheetById)

module.exports = router
