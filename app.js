var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var envAuthApi = require('./routes/api/envAuth');
var svcTypeApi = require('./routes/api/serviceType');
var zoneApi = require('./routes/api/zone');
var taskApi = require('./routes/api/task');
var specieApi = require('./routes/api/specie');
var contractApi = require('./routes/api/contract')
var teamApi = require('./routes/api/team')
var employeeApi = require('./routes/api/employee')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', expressHbs({extname:'hbs', defaultLayout:'template.hbs'}));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// routes
/*GET*/
app.get('/api/service/environmentalauthorities', envAuthApi.getAll);
app.get('/api/service/servicetypes', svcTypeApi.getAll);
app.get('/api/service/zones', zoneApi.getAll);
app.get('/api/service/tasks', taskApi.getAll);
app.get('/api/service/species', specieApi.getAll);
app.get('/api/service/contracts', contractApi.getAll);
app.get('/api/service/employees', employeeApi.getAll);
app.get('/api/service/teams', teamApi.getAll);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;