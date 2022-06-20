const mongoose = require('../../database');
const User = require('./user');

const TeacherSchema = new mongoose.Schema({
  subjectList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
    },
  ],
});

const Teacher = User.discriminator('Teacher', TeacherSchema);

module.exports = Teacher;
