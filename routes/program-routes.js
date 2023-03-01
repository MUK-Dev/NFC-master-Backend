const express = require('express')

const {
  registerProgram,
  getAllPrograms,
} = require('../controllers/program-controller')
const isAuth = require('../middleware/isAuth')

/**
 * @openapi
 * /api/programs:
 *  get:
 *     tags:
 *     - Programs
 *     description: Returns all registered departments
 *     parameters:
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AllProgramsResponse'
 *       401:
 *        description: Unauthorized
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 *  post:
 *     tags:
 *     - Programs
 *     description: Registers new Program
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/RegisterProgramRequest'
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RegisterProgramResponse'
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 */

const router = express.Router()

router.route('/api/programs').get(getAllPrograms).post(isAuth, registerProgram)

module.exports = router
