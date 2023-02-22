const express = require('express')

const { getAllParents } = require('../controllers/parent-controller')
const isAuth = require('../middleware/isAuth')

/**
 * @openapi
 * /api/parents:
 *  get:
 *     tags:
 *     - Parents
 *     description: Returns all registered parents
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ParentsResponse'
 *       401:
 *        description: Unauthorized
 *       500:
 *        description: Something went wrong (Server error)
 */

const router = express.Router()

router.route('/api/parents').get(isAuth, getAllParents)

module.exports = router
