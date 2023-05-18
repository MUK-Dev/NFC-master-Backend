const express = require('express')

const {
  registerSemester,
  getAllDependentSemesters,
  getSemester,
  getAllSemesters,
  getSemesterById,
  updateSemester,
} = require('../controllers/semester-controller')
const isAuth = require('../middleware/isAuth')

/**
 * @openapi
 * /api/semesters:
 *  get:
 *     tags:
 *     - Semesters
 *     description: Returns all registered semesters depending on department, program, & session
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
 * /api/all-semesters:
 *  get:
 *     tags:
 *     - Semesters
 *     description: Returns all registered semesters
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
 * /api/semesters/{semesterId}:
 *  get:
 *     tags:
 *     - Semesters
 *     description: Returns semester by Id
 *     parameters:
 *       - in: path
 *         name: semesterId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Semester'
 *       401:
 *        description: Unauthorized
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 *  put:
 *     tags:
 *     - Semesters
 *     description: Returns all registered semesters
 *     parameters:
 *       - in: path
 *         name: semesterId
 *         schema:
 *           type: string
 *         required: true
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
 *              $ref: '#/components/schemas/AllSemestersResponse'
 *       401:
 *        description: Unauthorized
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 */

const router = express.Router()

router
  .route('/api/semesters')
  .get(getAllDependentSemesters)
  .post(isAuth, registerSemester)

router.route('/api/all-semesters').get(getAllSemesters)

router
  .route('/api/semesters/:semesterId')
  .get(isAuth, getSemesterById)
  .put(isAuth, updateSemester)

router.route('/api/student/semester').post(isAuth, getSemester)

module.exports = router
