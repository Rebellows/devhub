const express    = require('express');
const { engine } = require('express-handlebars'); 
const app        = express(); 
const path       = require('path');
const db         = require('./db/connection');
const bodyParser = require('body-parser');
const Job        = require('./models/Job');
const Sequelize  = require('sequelize');
const Op         = Sequelize.Op;
const Handlebars = require('handlebars'); // Importa o Handlebars

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, function() {
//   console.log(`Express is working in ${PORT} port`);
// });

// body parser
app.use(bodyParser.urlencoded({extended: false}));

// handlebars com o helper para quebras de linha
app.engine('handlebars', engine({
  defaultLayout: 'main',
  helpers: {
    breaklines: function(text) {
      text = Handlebars.escapeExpression(text);
      return new Handlebars.SafeString(text.replace(/(\r\n|\n|\r)/gm, '<br>'));
    }
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// db connection
db
  .authenticate()
  .then(() => {
    console.log("Database connection [SUCCESS]");
  })
  .catch(error => {
    console.log("Database connection [ERROR]", error);
  });

// routes
app.get('/', (req, res) => {
  let search = req.query.job;
  let query = '%'+search+'%';
  if (!search) {
    Job.findAll({order: [
      ['CreatedAt', 'DESC']
    ]})
    .then(jobs => {
      res.render('index', {
        jobs
      });
    })
    .catch(error => console.log(error));
  }
  else {
    Job.findAll({
      where: {title: {[Op.like]: query}},
      order: [
      ['CreatedAt', 'DESC']
    ]})
    .then(jobs => {
      res.render('index', {
        jobs, search
      });
    })
    .catch(error => console.log(error));
  }
});

// jobs routes
app.use('/jobs', require('./routes/jobs'));

module.exports = app;
