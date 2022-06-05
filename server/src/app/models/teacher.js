const mongoose = require('../../database');
const User = require('./user');

class Teacher extends User {
  static fields = {
    ...super.fields,
  };

  static schema = new mongoose.Schema(Teacher.fields).pre(
    'save',
    User.encryptPassword
  );
  static model = mongoose.model('Teacher', Teacher.schema);

  static async findOne(params = {}) {
    try {
      const teacher = await Teacher.model.findOne(params);

      if (!teacher) return null;

      const { id, email, birthDate, password, name, rg, ra } = teacher;

      return new Teacher(id, name, email, password, birthDate, ra, rg);
    } catch (err) {
      console.log(err);
    }
  }
  async findByIdAndUpdate(id, params = {}) {
    await Teacher.model.findByIdAndUpdate(id, params);
  }

  async save() {
    try {
      const { name, password, email, ra, rg, birthDate } = this;

      await Teacher.model.create({
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

module.exports = Teacher;
