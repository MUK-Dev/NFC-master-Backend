const mongoose = require('mongoose')

const subjectSchema = mongoose.Schema(
  {
    subject_title: String,
    type: String,
    subject_code: String,
    theory_hours: Number,
    lab_hours: Number,
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
    semester: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester' },
    change_history: [],
  },
  { timestamps: true },
)

module.exports = mongoose.model('Subject', subjectSchema)
