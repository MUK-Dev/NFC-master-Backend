const express = require('express')

const {
  registerStudent,
  login,
  getUser,
  registerParent,
} = require('../controllers/auth-controller')
const isAuth = require('../middleware/isAuth')

/**
 * @openapi
 * /api/get-user:
 *  get:
 *     tags:
 *     - Authentication
 *     description: Responds with the users information
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/StudentResponse'
 *       401:
 *        description: Unauthorized
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 * /api/login:
 *  post:
 *     tags:
 *     - Authentication
 *     description: Logins user and returns token
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/TokenResponse'
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 * /api/student/register:
 *  post:
 *     tags:
 *     - Authentication
 *     description: Registers student and returns token
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/RegisterStudentRequest'
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/TokenResponse'
 *       404:
 *        description: Invalid request
 *       403:
 *        description: Email already in use
 *       500:
 *        description: Something went wrong (Server error)
 * /api/parent/register:
 *  post:
 *     tags:
 *     - Authentication
 *     description: Registers parent and returns token
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/RegisterParentRequest'
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/TokenResponse'
 *       404:
 *        description: Invalid request
 *       403:
 *        description: Email already in use
 *       500:
 *        description: Something went wrong (Server error)
 * /api/admin/register:
 *  post:
 *     tags:
 *     - Authentication
 *     description: Registers admin and returns token
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/RegisterParentRequest'
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/TokenResponse'
 *       404:
 *        description: Invalid request
 *       403:
 *        description: Email already in use
 *       500:
 *        description: Something went wrong (Server error)
 */

const router = express.Router()

router.route('/api/student/register').post(registerStudent)

router.route('/api/parent/register').post(registerParent)

router.route('/api/admin/register').post(registerParent)

router.route('/api/login').post(login)

router.route('/api/get-user').get(isAuth, getUser)

module.exports = router
