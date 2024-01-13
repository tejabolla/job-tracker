// models/Job.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  company: String,
  jobLink: String,
  description: String,
  roleName: String,
  dateApplied: Date,
  status: String,
});

module.exports = mongoose.model('Job', jobSchema);

