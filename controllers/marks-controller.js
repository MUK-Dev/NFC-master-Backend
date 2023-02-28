const studentmarks = async (req, res, next) => {
  console.log(req.body)
  res.status(200).send({ message: 'success', type: 'marks' })
}

module.exports = {
  studentmarks,
}
