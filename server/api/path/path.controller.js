'use strict';

var _ = require('lodash');
var Path = require('./path.model');

// Get list of paths
exports.index = function(req, res) {
  Path.find(function (err, paths) {
    if(err) { return handleError(res, err); }
    return res.json(200, paths);
  });
  // return res.json(200, paths);
};

// Get a single path
exports.show = function(req, res) {
  Path.findById(req.params.id, function (err, path) {
    if(err) { return handleError(res, err); }
    if(!path) { return res.send(404); }
    return res.json(path);
  });
};

// Creates a new path in the DB.
exports.create = function(req, res) {
  Path.create(req.body, function(err, path) {
    if(err) { return handleError(res, err); }
    return res.json(201, path);
  });
};

// Updates an existing path in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Path.findById(req.params.id, function (err, path) {
    if (err) { return handleError(res, err); }
    if(!path) { return res.send(404); }
    var updated = _.merge(path, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, path);
    });
  });
};

// Deletes a path from the DB.
exports.destroy = function(req, res) {
  Path.findById(req.params.id, function (err, path) {
    if(err) { return handleError(res, err); }
    if(!path) { return res.send(404); }
    path.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}