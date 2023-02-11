const express = require('express')

const {
  registerSubject,
  getAllSubjects,
} = require('../controllers/subject-controller')
const isAuth = require('../middleware/isAuth')

/**
 * @openapi
 * /api/subjects:
 *  get:
 *     tags:
 *     - Subjects
 *     description: Returns all registered subjects
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AllSubjectsResponse'
 *       401:
 *        description: Unauthorized
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 *  post:
 *     tags:
 *     - Subjects
 *     description: Registers new Subjects
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/RegisterSubjectRequest'
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RegisterSubjectResponse'
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 */

const router = express.Router()

router
  .route('/api/subjects')
  .get(isAuth, getAllSubjects)
  .post(isAuth, registerSubject)

module.exports = router
