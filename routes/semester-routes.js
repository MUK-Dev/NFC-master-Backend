const express = require('express')

const {
  registerSemester,
  getAllSemesters,
} = require('../controllers/semester-controller')
const isAuth = require('../middleware/isAuth')

/**
 * @openapi
 * /api/semesters:
 *  get:
 *     tags:
 *     - Semesters
 *     description: Returns all registered semesters
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
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AllSemestersResponse'
 *       401:
 *        description: Unauthorized
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 *  post:
 *     tags:
 *     - Semesters
 *     description: Registers new Semester
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/RegisterSemesterRequest'
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RegisterSemesterResponse'
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 */

const router = express.Router()

router
  .route('/api/semesters')
  .get(getAllSemesters)
  .post(isAuth, registerSemester)

module.exports = router
