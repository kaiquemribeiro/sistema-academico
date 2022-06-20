const mongoose = require('../../database');
const User = require('./user');

const AdminSchema = new mongoose.Schema({});

const Admin = User.discriminator('Admin', AdminSchema);

module.exports = Admin;
