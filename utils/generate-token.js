require('dotenv').config()
const jwt = require('jsonwebtoken')

const genToken = user => {
  let token
  try {
    const tokenUser = {
      id: user._id,
    }
    token = jwt.sign({ tokenUser }, process.env.JWT_KEY, {
      expiresIn: '1d',
    })
    return token
  } catch (err) {
    const error = new HttpError("Couldn't generate token", 500)
    throw error
  }
}

module.exports = { genToken }
