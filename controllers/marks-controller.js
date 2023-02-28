const { Student } = require('../models/user-models')

const studentmarks = async (req, res, next) => {
  // console.log(req.body)

  try {
    const data = await Student.find({
      session: req.body.session,
      section: req.body.section,
      program: req.body.program,
    })
    // console.log(data)

    const modifiedUserArray = data.map(user => ({
      _id: user._id,
      rollNo: user.rollNo,
      name: user.name,
      mids: '',
      sessional: '',
      finals: '',
    }))
    function compareByRoll(a, b) {
      return a.rollNo - b.rollNo
    }
    modifiedUserArray.sort(compareByRoll)
    return res.send(modifiedUserArray)
  } catch (err) {}

  // res.status(200).send({ message: 'success', type: 'marks' })
}

module.exports = {
  studentmarks,
}
