/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Path = require('./path.model');

exports.register = function(socket) {
  Path.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Path.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('path:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('path:remove', doc);
}

