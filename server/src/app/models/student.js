const mongoose = require('../../database');
const User = require('./user');

class Student extends User {
  static fields = {
    ...super.fields,
  };

  static schema = new mongoose.Schema(Student.fields).pre(
    'save',
    User.encryptPassword
  );
  static model = mongoose.model('Student', Student.schema);

  static async findOne(params = {}) {
    try {
      const student = await Student.model.findOne(params);

      if (!student) return null;

      const { id, email, birthDate, password, name, rg, ra } = student;

      return new Student(id, name, email, password, birthDate, ra, rg);
    } catch (err) {
      console.log(err);
    }
  }

  async findByIdAndUpdate(id, params = {}) {
    await Student.modelmodel.findByIdAndUpdate(id, params);
  }

  async save() {
    try {
      const { name, password, email, ra, rg, birthDate } = this;

      await Student.model.create({
        name,
        password,
        email,
        ra,
        rg,
        birthDate,
      });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Student;
