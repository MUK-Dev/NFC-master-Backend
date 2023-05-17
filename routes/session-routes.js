const express = require('express')

const {
  registerSession,
  getAllDependentSessions,
  getSessionById,
  updateSession,
  getAllSessions,
} = require('../controllers/session-controller')
const isAuth = require('../middleware/isAuth')

/**
 * @openapi
 * /api/sessions:
 *  get:
 *     tags:
 *     - Sessions
 *     description: Returns all registered sessions under department and program
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
 * /api/all-sessions:
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
 * /api/sessions/{sessionId}:
 *  get:
 *     tags:
 *     - Sessions
 *     description: Returns session by Id
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Session'
 *       401:
 *        description: Unauthorized
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 *  put:
 *     tags:
 *     - Sessions
 *     description: Updates session by Id
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
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
 *              $ref: '#/components/schemas/GeneralResponse'
 *       401:
 *        description: Unauthorized
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 */

const router = express.Router()

router
  .route('/api/sessions')
  .get(getAllDependentSessions)
  .post(isAuth, registerSession)

router.route('/api/all-sessions').get(getAllSessions)

router
  .route('/api/sessions/:sessionId')
  .get(isAuth, getSessionById)
  .put(isAuth, updateSession)
// .delete(isAuth, deleteSession)

module.exports = router
