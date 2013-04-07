var MongooseCollection = require('mongoose/lib/collection')
  , Collection = require('mongoose/node_modules/mongodb').Collection;

function MockCollection(name, connection, options) {
  var that = this;
  that.name = name;
  that.connection = connection;
  that.options = options;
  that.collection = null;
  that.debug = that.connection.debug;
  that.debug && console.log('MockCollection - arguments :', arguments);
  MongooseCollection.apply(that, arguments);
}

MockCollection.prototype.__proto__ = MongooseCollection.prototype;

MockCollection.prototype.onOpen = function () {
  var that = this;
  that.debug && console.log('MockCollection.onOpen - arguments :', arguments);
  if (!that.connection.mocks[that.name]) {
    that.connection.mocks[that.name] = [];
  }
  that.collection = that.connection.mocks[that.name];
  MongooseCollection.prototype.onOpen.call(that);
};

MockCollection.prototype.onClose = function () {
  var that = this;
  that.debug && console.log('MockCollection.onClose - arguments :', arguments);
  MongooseCollection.prototype.onClose.call(this);
};

MockCollection.prototype.getIndexes = function () {
  var that = this;
  that.debug && console.log('MockCollection.getIndexes - arguments :', arguments);
};

for (var method in Collection.prototype) {
  (function (method) {
    //console.log('method :', method);
    MockCollection.prototype[method] = function () {
      var that, args;
      that = this;
      args = arguments;
      if (that.buffer) {
        that.addQueue(method, arguments);
        return;
      }
      if (that.collection[method]) {
        that.collection[method].apply(that.collection, args);
      }else{
        throw new Error('Monckoose method ' + method + ' not yet implemented!');
      }
    };
  })(method);
}

module.exports = MockCollection;