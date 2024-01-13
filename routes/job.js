// routes/job.js
const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// Display Job Tracker dashboard
router.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  // Fetch jobs for the logged-in user
  Job.find({ user: req.user._id })
    .then((jobs) => {
      res.render('dashboard', { jobs });
    })
    .catch((err) => {
      console.error(err);
      res.redirect('/');
    });
});

// Add Job route
router.post('/add', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  const { company, jobLink, description, roleName, dateApplied, status } = req.body;
  const newJob = new Job({
    user: req.user._id,
    company,
    jobLink,
    description,
    roleName,
    dateApplied,
    status,
  });
  newJob.save()
    .then(() => res.redirect('/job/dashboard'))
    .catch((err) => {
      console.error(err);
      res.redirect('/job/dashboard');
    });
});

module.exports = router;
