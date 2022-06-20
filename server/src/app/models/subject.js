const mongoose = require('../../database');

SubjectSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
  },
  studentList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
  ],
  timetable: [
    {
      day: String,
      turn: String,
    },
  ],
});

const Subject = mongoose.model('Subject', SubjectSchema);

module.exports = Subject;
