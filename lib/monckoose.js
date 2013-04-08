var path = require('path');

global.MONGOOSE_DRIVER_PATH = path.join(__dirname, 'monckoose-driver');

function MonckooseCollection(array) {
  this.array = array;
}

MonckooseCollection.prototype.insert = function (item, options, callback) {
  this.array.push(item);
  callback && callback();
};

MonckooseCollection.prototype.find = function (selector, options, callback) {
  var that, result, i, key, item, match, selectorField;
  that = this;
  result = [];
  for (i = 0; i < that.array.length; i++) {
    item = that.array[i];
    match = true;
    for (key in selector) {
      selectorField = selector[key];
      if (key == '_id' && typeof selectorField !== 'string') {
        selectorField = '' + selectorField;
      }
      if (item[key] != selectorField) {
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
      callback && callback(null, result);
    }
  });
};

MonckooseCollection.prototype.findOne = function (selector, options, callback) {
  var that = this;
  that.find(selector, options, function (err, result) {
    if (err) {
      callback && callback(err, null);
      return;
    }
    result.toArray(function (err, items) {
      if (err) {
        callback && callback(err, null);
        return;
      }
      callback && callback(null, items[0]);
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
  callback && callback();
};

MonckooseCollection.prototype.findAndModify = function (selector, sort, update, options, callback) {
  var that = this;
  that.find(selector, options, function (err, result) {
    if (err) {
      callback && callback(err);
      return;
    }
    result.toArray(function (err, items) {
      var doneCounter, i;
      if (err) {
        callback && callback(err);
        return;
      }
      doneCounter = 0;
      for (i = 0; i < items.length; i++) {
        that.update(items[i], update, {}, function () {
          doneCounter++;
          if (doneCounter === items.length) {
            callback && callback();
          }
        });
      }
      callback && callback();
    });
  });
};

MonckooseCollection.prototype.save = function (item, callback) {
  var that = this;
  if (item['_id']) {
    that.update(item, callback);
  } else {
    that.insert(item, {}, callback);
  }
};

MonckooseCollection.prototype.update = function (item, update, options, callback) {
  var that, i, found, setArray, key;
  that = this;
  found = false;
  setArray = update['$set'];
  for (i = 0; i < that.array.length && !found; i++) {
    if (that.array[i]._id == item._id) {
      found = true;
      for (key in setArray) {
        that.array[i][key] = setArray[key];
      }
    }
  }
  callback && callback();
};

module.exports = exports = {
  MonckooseCollection: MonckooseCollection
};