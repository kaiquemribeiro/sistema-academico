const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/sisac');
mongoose.Promise = global.Promise;

module.exports = mongoose;