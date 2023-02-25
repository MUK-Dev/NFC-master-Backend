const markAttendanceList = async (req, res, next) => {
  console.log(req.body)
  res.status(200).send({ message: 'success', type: 'mark-attendance' })
}

module.exports = {
  markAttendanceList,
}
