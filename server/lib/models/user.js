const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const PersonalInfo = require('./personal-info');

const userSchema = new Schema({

  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  location: String,
  userUrl: String,
  ghaccess: String,
  ghUsername: String,
  github: { 
    type: Schema.Types.ObjectId, 
    ref: 'Github'
  },
  liAccess: { 
    oauth2_access_token: String,
    format: String
  },
  linkedIn: {
    type: Schema.Types.ObjectId,
    ref: 'LinkedIn'
  },
  personalInfo: PersonalInfo.schema,

  roles: []

});


userSchema.methods.generateHash = function(password) {
  return this.password = bcrypt.hashSync(password, 10);
};

userSchema.methods.compareHash = function(password) {
  return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('User', userSchema);

