var path = require('path');

global.MONGOOSE_DRIVER_PATH = path.join(__dirname, 'monckoose-driver');

function MonckooseCollection(array) {
  this.array = array;
}

MonckooseCollection.prototype.insert = function (item, options, callback) {
  this.array.push(item);
  callback();
};

MonckooseCollection.prototype.find = function (selector, options, callback) {
  var that, result, i, key, item, match;
  that = this;
  result = [];
  for (i = 0; i < that.array.length; i++) {
    item = that.array[i];
    match = true;
    for (key in selector) {
      if (item[key] != selector[key]) {
        match = false;
        break;
      }
    }
    if (match) {
      result.push(item);
    }
  }
  callback(null, {
    toArray: function (callback) {
      callback(null, result);
    }
  });
};

MonckooseCollection.prototype.findOne = function (selector, options, callback) {
  var that = this;
  that.find(selector, options, function (err, result) {
    if (err) {
      return callback(err, null);
    }
    result.toArray(function (err, items) {
      if (err) {
        return callback(err, null);
      }
      callback(null, items[0]);
    });
  });
};

MonckooseCollection.prototype.remove = function (selector, options, callback) {
  var that, result, i, key, item, match;
  that = this;
  result = [];
  for (i = 0; i < that.array.length; i++) {
    item = that.array[i];
    match = true;
    for (key in selector) {
      if (item[key] != selector[key]) {
        match = false;
        break;
      }
    }
    if (match) {
      that.array.splice(i, 1);
      i = -1;
    }
  }
  callback();
};

module.exports = exports = {
  MonckooseCollection: MonckooseCollection
};