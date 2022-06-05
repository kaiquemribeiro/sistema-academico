const mongoose = require('../../database');
const User = require('./user');

class Admin extends User {
  static fields = {
    ...super.fields,
  };

  static schema = new mongoose.Schema(Admin.fields).pre(
    'save',
    User.encryptPassword
  );
  static model = mongoose.model('Admin', Admin.schema);

  static async findOne(params = {}) {
    try {
      const admin = await Admin.model.findOne(params);

      if (!admin) return null;

      const { id, email, birthDate, password, name, rg, ra } = admin;

      return new Admin(id, name, email, password, birthDate, ra, rg);
    } catch (err) {
      console.log(err);
    }
  }

  async findByIdAndUpdate(id, params = {}) {
    await Admin.model.findByIdAndUpdate(id, params);
  }

  async save() {
    try {
      const { name, password, email, ra, rg, birthDate } = this;

      await Admin.model.create({
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

module.exports = Admin;
