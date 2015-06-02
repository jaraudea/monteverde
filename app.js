var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var expressJwt = require('express-jwt');

var restObserver = require('./middleware/restObserver');

var main = require('./routes/index');
var login = require('./routes/login');

var envAuthApi = require('./routes/api/environmentalauthority');
var svcTypeApi = require('./routes/api/servicetype');
var zoneApi = require('./routes/api/zone');
var taskApi = require('./routes/api/task');
var specieApi = require('./routes/api/specie');
var contractApi = require('./routes/api/contract')
var teamApi = require('./routes/api/team')
var employeeApi = require('./routes/api/employee')
var configServiceApi = require('./routes/api/configservice')

var tokenConfig = require('./token/config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', expressHbs({extname:'hbs', defaultLayout:'template.hbs'}));
app.set('view engine', 'hbs');

// We are going to protect /api routes with JWT
app.use('/api', expressJwt({secret: tokenConfig.secret}));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares
app.use(restObserver);

// routes
/*VIEW*/
app.get('/', main.index);
app.post('/login', login.authenticate);

/*API*/
/*GET*/
app.get('/api/restricted', function (req, res) {
  console.log('user ' + req.user.name + ' is calling /api/restricted');
  res.json({
    name: req.user.name
  });
});
app.get('/api/service/environmentalauthorities', envAuthApi.getAll);
app.get('/api/service/servicetypes', svcTypeApi.getAll);
app.get('/api/service/zones', zoneApi.getAll);
app.get('/api/service/tasks', taskApi.getAll);
app.get('/api/service/species', specieApi.getAll);
app.get('/api/service/contracts', contractApi.getAll);
app.get('/api/service/employees', employeeApi.getAll);
app.get('/api/service/teams', teamApi.getAll);
app.get('/api/service/configservice/:code', configServiceApi.getByCode);

/*POST*/
app.post('/api/service/configservice/:code', configServiceApi.create);

/*PUT*/
app.put('/api/service/configservice/:code', configServiceApi.update);

/*DELETE*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    console.log(req);
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;