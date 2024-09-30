const express = require('express');
const router  = express.Router();
const Job     = require('../models/Job');
const { where } = require('sequelize');

// for testing
router.get('/test', (req, res) => {
  res.send('Test [SUCCESS]');
});

// forms
router.get('/add', (req, res) => {
  res.render('add');
});

// details
router.get('/view/:id', (req, res) => Job.findOne({
  where: {id: req.params.id}
}).then(job=> {
  res.render('view', {
    job
  });
}).catch(error => console.log(error)));

// add Job via POST
router.post('/add', (req, res) => {
  let {title, salary, company, description, email, new_job} = req.body;
  Job.create({
    title, 
    description,
    salary,
    company,
    email,
    new_job
  })
  .then(() => res.redirect('/'))
  .catch(error => console.log(error));
});

module.exports = router;