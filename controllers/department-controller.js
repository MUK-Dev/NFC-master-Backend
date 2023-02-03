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
    res.send({
      statusCode: 202,
      message: 'Successfully Registered',
    })
  } catch (e) {
    return res.status(500).send('Something went wrong')
    // return next(error)
  }
}

module.exports = {
  registerDepartment,
}
