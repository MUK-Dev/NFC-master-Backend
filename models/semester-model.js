const mongoose = require('mongoose')

const semesterSchema = mongoose.Schema(
  {
    semester_title: String,
    type: String,
    starting_year: String,
    ending_year: String,
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
    change_history: [],
  },
  { timestamps: true },
)

module.exports = mongoose.model('Semester', semesterSchema)
