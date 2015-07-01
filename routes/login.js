// var tokenUtil = require('../auth/token');
var jwt = require('jsonwebtoken');
var User = require('../models/User');
var tokenConfig = require('../token/config');

exports.form = function(req, res) {
	res.render('login', {title: 'Ingreso - Monteverde'});
};

var authenticate = function(name, pass, fn) {
	User.findOne({username: name}, function(err, user) {
		if (err) return fn(err);
		if (!user) return fn(new Error('Usuario y/o contraseña invalidos.'));
		if (user.password !== pass) return fn(new Error('Usuario y/o contraseña invalidos.'));
		fn(err, user);
	});
};

exports.authenticate = function (req, res, next) {
  authenticate(req.body.username, req.body.pwd, function(err, user) {
	  if (err) {
	    res.send(401, err);
	    return;
	  }
	  // We are sending the profile inside the token
	  var token = jwt.sign(user, tokenConfig.secret, { expiresInMinutes: tokenConfig.expiration });
	  res.json({ token: token });
	});
};