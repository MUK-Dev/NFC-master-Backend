const express = require('express')

const {
  registerDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
} = require('../controllers/department-controller')
const isAuth = require('../middleware/isAuth')

/**
 * @openapi
 * /api/departments:
 *  get:
 *     tags:
 *     - Departments
 *     description: Returns all registered departments
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AllDepartmentResponse'
 *       401:
 *        description: Unauthorized
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 *  post:
 *     tags:
 *     - Departments
 *     description: Registers new department
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/RegisterDepartmentRequest'
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RegisterDepartmentResponse'
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 * /api/departments/{departmentId}:
 *  get:
 *     tags:
 *     - Departments
 *     description: Returns registered department by Id
 *     parameters:
 *       - in: path
 *         name: departmentId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Department'
 *       401:
 *        description: Unauthorized
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 *  put:
 *     tags:
 *     - Departments
 *     description: Updates registered department by Id
 *     parameters:
 *       - in: path
 *         name: departmentId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/UpdateDepartmentRequest'
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Department'
 *       401:
 *        description: Unauthorized
 *       404:
 *        description: Invalid request
 *       500:
 *        description: Something went wrong (Server error)
 */

const router = express.Router()

router
  .route('/api/departments')
  .get(getAllDepartments)
  .post(isAuth, registerDepartment)

router
  .route('/api/departments/:departmentId')
  .get(isAuth, getDepartmentById)
  .put(isAuth, updateDepartment)

module.exports = router
