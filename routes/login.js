// var tokenUtil = require('../auth/token');
var jwt = require('jsonwebtoken');
var User = require('../models/User');
var tokenConfig = require('../token/config');
// var validUntil = 1200;

exports.form = function(req, res) {
	res.render('login', {title: 'Ingreso - Monteverde'});
};

// exports.submit = function(req, res, next){
// 	var data = req.body.user;
// 	authenticate(data.name, data.pass, function(err, user) {
// 		console.log(user)
// 		if (err) return next(err);
// 		if (user) {
// 			var token = tokenUtil.create(user, validUntil);
// 			res
// 		    .status(200)
// 		    .jsonp({
// 		      token : tk
// 		    });
// 		} else {
// 			next("Nombre de usuario o Contraseña no validos.");
// 		}
// 	});
// };

// exports.logout = function(req, res){
// 	var token = req.headers.token;
// 	res
// 	  .status(200)
// 	  .jsonp({
// 	    token : undefined
// 	  });
// 	res.redirect('/login');
// };

var authenticate = function(name, pass, fn) {
	User.findOne({}, function(err, user) {
		if (err) return fn(err);
		if (!user) return fn();
		fn(err, user);
	});
};

exports.authenticate = function (req, res, next) {
  //if is invalid, return 401
  authenticate(req.body.username, req.body.password, function(err, user) {
	  if (err) {
	    res.send(401, 'Usuario o Contraseña incorrectas.');
	    return;
	  }
		console.log(user)
	  // We are sending the profile inside the token
	  var token = jwt.sign(user, tokenConfig.secret, { expiresInMinutes: 60*5 });

	  res.json({ token: token });
	});
};