const express = require('express')

const {
  registerSection,
  getAllDependentSections,
  getAllSection,
} = require('../controllers/section-controller')
const isAuth = require('../middleware/isAuth')

/**
 * @openapi
 * /api/sections:
 *  get:
 *     tags:
 *     - Sections
 *     description: Returns all registered sections under department, program and session
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
 *              $ref: '#/components/schemas/AllSectionsResponse'
 *       401:
 *        description: Unauthorized
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 *  post:
 *     tags:
 *     - Sections
 *     description: Registers new Section
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/RegisterSectionRequest'
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RegisterSectionResponse'
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 * /api/all-sections:
 *  get:
 *     tags:
 *     - Sections
 *     description: Returns all registered sections
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AllSectionsResponse'
 *       401:
 *        description: Unauthorized
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 */

const router = express.Router()

router
  .route('/api/sections')
  .get(getAllDependentSections)
  .post(isAuth, registerSection)

router.route('/api/all-sections').get(getAllSection)

module.exports = router
