const Model = require('../models/session-model')

const registerSession = async (req, res, next) => {
  const {
    session_title,
    type,
    starting_year,
    ending_year,
    department,
    program,
  } = req.body
  const required = {
    session_title,
    type,
    starting_year,
    ending_year,
    department,
    program,
  }

  for (let val in required) {
    if (!required[val]) {
      return res.status(404).send({ message: `${val} is required!`, type: val })
    }
  }

  const session = Model({
    session_title,
    type,
    starting_year,
    ending_year,
    department,
    program,
  })

  try {
    await session.save()
    res.status(202).send({
      type: 'session',
      message: 'Successfully Registered',
    })
  } catch (e) {
    console.error(e)
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'session' })
  }
}

const getAllSessions = async (req, res, next) => {
  try {
    const data = await Model.find({
      department: req.query.department,
      program: req.query.program,
    }).populate(['department', 'program'])
    res.status(200).send(data)
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'sessions' })
  }
}

module.exports = {
  registerSession,
  getAllSessions,
}
