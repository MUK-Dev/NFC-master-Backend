const mongoose = require('mongoose')

/**
 * @openapi
 * components:
 *  schemas:
 *    RegisterDepartmentRequest:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *        email:
 *          type: string
 *        section:
 *          type: string
 *        session:
 *          type: string
 *        program:
 *          type: string
 *        rollNo:
 *          type: string
 *        gender:
 *          type: string
 *        phoneNo:
 *          type: string
 *        password:
 *          type: string
 *        role:
 *          type: string
 *    AllDepartmentResponse:
 *      type: array
 *      items:
 *        $ref: '#/components/schemas/Department'
 *    Department:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *        email:
 *          type: string
 *        section:
 *          type: string
 *        session:
 *          type: string
 *        program:
 *          type: string
 *        rollNo:
 *          type: string
 *        gender:
 *          type: string
 *        phoneNo:
 *          type: string
 *        password:
 *          type: string
 *        role:
 *          type: string
 */

const departmentSchema = mongoose.Schema(
  {
    department_name: String,
    department_abbreviation: String,
    no_of_programs: Number,
    location: {
      lat: Number,
      lng: Number,
    },
    change_history: [],
  },
  { timestamps: true },
)

module.exports = mongoose.model('Department', departmentSchema)
