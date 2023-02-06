require('dotenv').config()
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(404).send({ message: 'No token provided', type: 'token' })
  }
  const token = req.headers.authorization.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    req.userInfo = decoded
    next()
  } catch (err) {
    console.log(err)
    return res
      .status(401)
      .send({ message: 'Could not Authentication', type: 'token' })
  }
}
