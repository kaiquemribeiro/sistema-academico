const mongoose = require('../../database');

const courseSchema = new mongoose.Schema({
  name: String,
  idcode: Number,
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
