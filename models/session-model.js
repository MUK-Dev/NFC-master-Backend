const mongoose = require('mongoose')

const sessionSchema = mongoose.Schema(
  {
    session_title: String,
    type: String,
    starting_year: String,
    ending_year: String,
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
    change_history: [],
  },
  { timestamps: true },
)

module.exports = mongoose.model('Session', sessionSchema)
