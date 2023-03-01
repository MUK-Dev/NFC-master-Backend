const mongoose = require('mongoose')

const subjectSchema = mongoose.Schema(
  {
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
    semester: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester' },
    semester: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    change_history: [],
  },
  { timestamps: true },
)

module.exports = mongoose.model('SubjectStudents', subjectSchema)
