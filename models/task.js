const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      required: true,
    },
    priority: {
      type: String,
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    fromList: {
      type: Schema.Types.ObjectId,
      ref: 'List',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
