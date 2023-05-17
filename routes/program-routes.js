const express = require('express')

const {
  registerProgram,
  getAllPrograms,
  getAllDependentPrograms,
  getProgramById,
  updateProgram,
} = require('../controllers/program-controller')
const isAuth = require('../middleware/isAuth')

/**
 * @openapi
 * /api/programs:
 *  get:
 *     tags:
 *     - Programs
 *     description: Returns all registered programs of departments
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
 * /api/programs/{programId}:
 *  get:
 *     tags:
 *     - Programs
 *     description: Returns program detail by Id
 *     parameters:
 *       - in: path
 *         name: programId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Program'
 *       401:
 *        description: Unauthorized
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 *  put:
 *     tags:
 *     - Programs
 *     description: Updates registered program by Id
 *     parameters:
 *       - in: path
 *         name: programId
 *         schema:
 *           type: string
 *         required: true
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
 *              $ref: '#/components/schemas/GeneralResponse'
 *       401:
 *        description: Unauthorized
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 * /api/all-programs:
 *  get:
 *     tags:
 *     - Programs
 *     description: Returns all registered programs
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AllProgramsResponse'
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 */

const router = express.Router()

router
  .route('/api/programs')
  .get(getAllDependentPrograms)
  .post(isAuth, registerProgram)

router
  .route('/api/programs/:programId')
  .get(isAuth, getProgramById)
  .put(isAuth, updateProgram)

router.route('/api/all-programs').get(getAllPrograms)

module.exports = router
