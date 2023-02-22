const crypto = require('crypto')

const createAvatarHash = email => {
  return crypto.createHash('md5').update(email?.toLowerCase()).digest('hex')
}

module.exports = createAvatarHash
