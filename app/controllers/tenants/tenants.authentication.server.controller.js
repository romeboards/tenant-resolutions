'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  Q = require('q'),
  errorHandler = require('../errors.server.controller'),
  actionsHandler = require('../actions.server.controller'),
  addressHandler = require('../../services/address.server.service'),
  tenantProfileHandler = require('./tenants.profile.server.controller'),
  userAuthHandler = require('../users/users.authentication.server.controller'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  rollbar = require('rollbar'),
  User = mongoose.model('User'),
  Identity = mongoose.model('Identity'),
  Tenant = mongoose.model('Tenant');

mongoose.Promise = require('q').Promise;

/**
 * Signup
 */
exports.signup = function(req, res) {
  // For security measurement we remove the roles from the req.body object
  // This is so the user can't set their own roles, duh
  delete req.body.roles;

  // Init Variables
  // Mongoose will just take what it needs for each model
  var identity = new Identity(req.body);
  var tenant = new Tenant(req.body);
  var user = new User();

  // this is a tenant user
  user.kind = 'Tenant';

  var message = null;

  // Add missing user fields
  identity.provider = 'local';
  tenant.actionFlags.push('initial');

  // new user enabled sharing, so create a key
  // **actually, just create a key regardless**
  // if(user.sharing.enabled) {
    tenantProfileHandler.createPublicView().then(function(newUrl) {
      tenant.sharing.key = newUrl;
    });
  // }

  // make sure this comes before the 'added to checklist card'
  var acctCreatedDate = new Date();
  acctCreatedDate.setSeconds(acctCreatedDate.getSeconds() - 60);

  // self-explanatory?
  tenant.activity.push({
    key: 'createAcount',
    title: 'modules.activity.other.created',
    createdDate: acctCreatedDate,
    startDate: acctCreatedDate
  });

  // // populate advocate information
  // if(tenant.advocate) {
  //   Tenant.populate(tenant, {
  //       path: 'advocate',
  //       select: '-phone -firstName -lastName -created'
  //     })
  //     .then(function (tenant) {
  //       return userAuthHandler.saveNewUser(req, identity, tenant, user);
  //     })
  //     .then(function (userObject) {
  //       rollbar.reportMessage("New User Signup!", "info", req);
  //       res.json(userObject);
  //     })
  //     .catch(function (err) {
  //       rollbar.handleError(errorHandler.getErrorMessage(err), req);
  //       res.status(400).send(errorHandler.getErrorMessage(err));
  //     });
  //
  // // no advocate population
  // } else {
  //   userAuthHandler.saveNewUser(req, identity, tenant, user)
  //     .then(function (userObject) {
  //       rollbar.reportMessage("New User Signup!", "info", req);
  //       res.json(userObject);
  //     })
  //     .catch(function (err) {
  //       rollbar.handleError(errorHandler.getErrorMessage(err), req);
  //       res.status(400).send(errorHandler.getErrorMessage(err));
  //     });
  // }

userAuthHandler.saveNewUser(req, identity, tenant, user)
  .then(function (userObject) {
    rollbar.reportMessage("New User Signup!", "info", req);
    res.json(userObject);
  })
  .catch(function (err) {
    rollbar.handleError(errorHandler.getErrorMessage(err), req);
    res.status(400).send(errorHandler.getErrorMessage(err));
  });

};

/**
 * Signin for tenants
 *
 * If we're here then everything has been authenticated,
 * and we have a flattened userObject to work with
 *
 * Maybe in the future we can flatten it ourselves here?
 */
exports.signin = function(req, res) {

  console.log(res.locals.userObject);
};
