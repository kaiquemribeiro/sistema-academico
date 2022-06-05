const bcrypt = require('bcryptjs');

class User {
  constructor(name, email, password, birthDate, ra, rg, id) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._password = password;
    this._birthDate = birthDate;
    this._ra = ra;
    this._rg = rg;
  }

  set id(id) {
    this._id = id;
  }

  get id() {
    return this._id;
  }

  set name(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }
  set email(email) {
    this._email = email;
  }

  get email() {
    return this._email;
  }

  set password(password) {
    this._password = password;
  }

  get password() {
    return this._password;
  }

  set birthDate(birthDate) {
    this._birthDate = birthDate;
  }

  get birthDate() {
    return this._birthDate;
  }

  set ra(ra) {
    this._ra = ra;
  }

  get ra() {
    return this._ra;
  }

  set rg(rg) {
    this._rg = rg;
  }

  get rg() {
    return this._rg;
  }

  static async encryptPassword(next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
  }

  static fields = {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    birthDate: {
      type: Date,
      required: false,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    ra: {
      type: Number,
      // unique: true,
      required: false,
    },
    rg: {
      type: Number,
      // unique: true,
      required: false,
    },
  };
}

module.exports = User;
