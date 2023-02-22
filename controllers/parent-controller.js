const { Parent } = require('../models/user-models')

const getAllParents = async (req, res, next) => {
  try {
    const data = await Parent.find().select('-password')

    return res.send(data)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'get-all-students' })
  }
}

module.exports = {
  getAllParents,
}
