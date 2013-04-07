var MongooseConnection = require('mongoose/lib/connection')
  , STATES = require('mongoose/lib/connectionstate')
  , MockCollection = require('./collection');

function MockConnection(base) {
  var that = this;
  that.debug && console.log('MockConnection - arguments :', arguments);
  MongooseConnection.apply(that, arguments);
  that._listening = false;
}

MockConnection.prototype.__proto__ = MongooseConnection.prototype;

MockConnection.prototype.doOpen = function (callback) {
  var that = this;
  that.debug && console.log('MockConnection.doOpen - arguments :', arguments);
  if (STATES.disconnected === that.readyState) {
    that.readyState = STATES.connected;
  }
  that._listening = true;
  callback && typeof callback === 'function' && callback();
  return that;
};

MockConnection.prototype.doOpenSet = function (callback) {
  var that = this;
  that.debug && console.log('MockConnection.doOpenSet - arguments :', arguments);
  if (STATES.disconnected === that.readyState) {
    that.readyState = STATES.connected;
  }
  that._listening = true;
  callback && typeof callback === 'function' && callback();
  return that;
};

MockConnection.prototype.doClose = function (callback) {
  var that = this;
  that.debug && console.log('MockConnection.doClose - arguments :', arguments);
  that._listening = false;
  that.base.models = [];
  that.base.modelSchemas = [];
  that.collections = [];
  callback && typeof callback === 'function' && callback();
  return that;
};

MockConnection.prototype.parseOptions = function (passed, connStrOpts) {
  var that = this;
  that.mocks = passed.mocks;
  that.debug = passed.debug;
  that.options = {
    debug: that.debug
  };
  that.debug && console.log('MockConnection.parseOptions - arguments :', arguments);
  return passed;
};

module.exports = MockConnection;