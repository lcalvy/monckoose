var MongooseConnection = require('mongoose/lib/connection');

function MockConnection(db) {
  var that = this;
  MongooseConnection.apply(that, arguments);
  that._listening = false;
}

MockConnection.prototype.__proto__ = MongooseConnection.prototype;

MockConnection.prototype.doOpen = function (callback) {
  var that = this;
  that.debug && console.log('MockConnection.doOpen :', arguments);
  callback && typeof callback === 'function' && callback();
  return this;
};

MockConnection.prototype.doOpenSet = function (callback) {
  var that = this;
  that.debug && console.log('MockConnection.doOpenSet :', arguments);
  callback && typeof callback === 'function' && callback();
  return that;
};

MockConnection.prototype.doClose = function (callback) {
  var that = this;
  that.debug && console.log('MockConnection.doClose :', arguments);
  callback && typeof callback === 'function' && callback();
  return that;
}

MockConnection.prototype.parseOptions = function (passed, connStrOpts) {
  var that = this;
  that.mocks = passed.mocks;
  that.debug = passed.debug;
  that.options = {
    debug: that.debug
  };
  that.debug && console.log('MockConnection.parseOptions :', arguments);
  return {};
}

/*
 MockConnection.prototype.collection = function () {
 console.log('MockConnection.collection :', arguments);
 return {
 insert: function () {
 console.log('MockConnection.collection.insert :', arguments);
 }
 };
 };
 */

module.exports = MockConnection;