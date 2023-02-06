const Model = require('../models/department-model')

const registerDepartment = async (req, res, next) => {
  const { department_name, department_abbreviation, no_of_programs, lat, lng } =
    req.body
  const required = {
    department_name,
    department_abbreviation,
    no_of_programs,
    lat,
    lng,
  }

  for (let val in required) {
    if (!required[val]) {
      return res.status(404).send({ message: `${val} is required!`, type: val })
    }
  }

  const department = Model({
    department_name,
    department_abbreviation,
    no_of_programs,
    location: {
      lat,
      lng,
    },
  })

  try {
    await department.save()
    res.status(202).send({
      message: 'Successfully Registered',
      type: 'department',
    })
  } catch (e) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'department' })
  }
}

const getAllDepartments = async (req, res, next) => {
  try {
    const data = await Model.find()
    res.status(200).send(data)
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'departments' })
  }
}

module.exports = {
  registerDepartment,
  getAllDepartments,
}
