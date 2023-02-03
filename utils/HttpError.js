class HttpError extends Error {
  constructor(message, statusCode, type) {
    super()
    this.description = message
    this.statusCode = statusCode
    this.type = type
  }
}

module.exports = HttpError
