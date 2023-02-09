const { Student } = require('../models/user-models')

const findStudents = async (req, res, next) => {
  try {
    const data = await Student.find({
      name: { $regex: 'us' },
    })
    res.send(data)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  findStudents,
}
