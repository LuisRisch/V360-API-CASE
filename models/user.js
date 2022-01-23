const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  lists: [
    {
      type: Schema.Types.ObjectId,
      ref: 'List'
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
