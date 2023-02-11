const express = require('express')

const {
  registerSession,
  getAllSessions,
} = require('../controllers/session-controller')
const isAuth = require('../middleware/isAuth')

/**
 * @openapi
 * /api/sessions:
 *  get:
 *     tags:
 *     - Sessions
 *     description: Returns all registered sessions
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AllSessionsResponse'
 *       401:
 *        description: Unauthorized
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 *  post:
 *     tags:
 *     - Sessions
 *     description: Registers new Session
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/RegisterSessionRequest'
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RegisterSessionResponse'
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 */

const router = express.Router()

router
  .route('/api/sessions')
  .get(isAuth, getAllSessions)
  .post(isAuth, registerSession)

module.exports = router
