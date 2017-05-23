const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personinfo = new Schema({
  location: String,
  college: String,
  degree: String,
  graduation: String,
  college2: String,
  degree2: String,
  graduation2: String,
  vocschool: String,
  certification: String,
  skills: [String],
  twitter: String,
  facebook: String,
  _id: false
});

module.exports = mongoose.model('PersonalInfo', personinfo);

