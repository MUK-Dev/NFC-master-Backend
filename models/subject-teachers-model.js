const mongoose = require('mongoose')

const subjectSchema = mongoose.Schema(
  {
    teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teachers' }],
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    semester: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester' },
    change_history: [],
  },
  { timestamps: true }
)

module.exports = mongoose.model('SubjectTeachers', subjectSchema)
