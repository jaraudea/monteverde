var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var expressJwt = require('express-jwt');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var flow = require('./flow/flow-node.js')('uploaded');

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
var unitApi = require('./routes/api/unit')
var vehicleApi = require('./routes/api/vehicle')

var configServiceApi = require('./routes/api/configservice')
var serviceApi = require('./routes/api/service')

var tokenConfig = require('./token/config');

// Configure access control allow origin header stuff
var ACCESS_CONTROLL_ALLOW_ORIGIN = false;

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
app.get('/api/service/environmentalauthorities', envAuthApi.getAll);
app.get('/api/service/servicetypes', svcTypeApi.getAll);
app.get('/api/service/zones', zoneApi.getAll);
app.get('/api/service/tasks', taskApi.getAll);
app.get('/api/service/species', specieApi.getAll);
app.get('/api/service/contracts', contractApi.getAll);
app.get('/api/service/employees', employeeApi.getAll);
app.get('/api/service/teams', teamApi.getAll);
app.get('/api/service/vehicles', vehicleApi.getAll);
app.get('/api/service/units', unitApi.getAll);
app.get('/api/service/configservice/codes', configServiceApi.getAllConfigCodes);
app.get('/api/service/configservice/:code?', configServiceApi.getByCode);
app.get('/api/service/executeService/:_id?', serviceApi.getExecutedServices);

/*POST*/  
app.post('/api/service/configservice', configServiceApi.create);
app.post('/api/service/scheduleService', serviceApi.scheduleService);
app.post('/api/service/executeService', serviceApi.executeService);

/*PUT*/
app.put('/api/service/configservice/:code', configServiceApi.update);
app.put('/api/service/scheduleService/:_id', serviceApi.updateScheduledService);
app.put('/api/service/executeService/:_id', serviceApi.updateExecutedService);
app.put('/api/service/approveService/:_id', serviceApi.approveService);
app.put('/api/service/disapproveService/:_id', serviceApi.disapproveService);

/*DELETE*/
app.delete('/api/service/executeService/:_id', serviceApi.deleteExecutedService);

/* upload (testing porpouses) this is a basic oute, please move the components to the corect files */
// Handle uploads through Flow.js
app.post('/upload', multipartMiddleware, function(req, res) {
  flow.post(req, function(status, filename, original_filename, identifier) {
    console.log('POST', status, original_filename, identifier);
    if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
      res.header("Access-Control-Allow-Origin", "*");
    }
    res.status(status).send();
  });
});


app.options('/upload', function(req, res){
  console.log('OPTIONS');
  if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
    res.header("Access-Control-Allow-Origin", "*");
  }
  res.status(200).send();
});

// Handle status checks on chunks through Flow.js
app.get('/upload', function(req, res) {
  flow.get(req, function(status, filename, original_filename, identifier) {
    console.log('GET', status);
    if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
      res.header("Access-Control-Allow-Origin", "*");
    }

    if (status == 'found') {
      status = 200;
    } else {
      status = 204;
    }

    res.status(status).send();
  });
});

app.get('/download/:identifier', function(req, res) {
  flow.write(req.params.identifier, res);
});
/*****************/

/*DELETE*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;