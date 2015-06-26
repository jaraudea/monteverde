// var tokenUtil = require('../auth/token');
var jwt = require('jsonwebtoken');
var User = require('../models/User');
var tokenConfig = require('../token/config');

exports.form = function(req, res) {
	res.render('login', {title: 'Ingreso - Monteverde'});
};

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
	  // We are sending the profile inside the token
	  var token = jwt.sign(user, tokenConfig.secret, { expiresInMinutes: tokenConfig.expiration });
	  res.json({ token: token });
	});
};