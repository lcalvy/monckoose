var ObjectId = require('bson').BSONPure.ObjectID;

ObjectId.fromString = function (str) {
  if (!('string' === typeof str && 24 === str.length)) {
    throw new Error('Invalid ObjectId');
  }
  return ObjectId.createFromHexString(str);
};

ObjectId.toString = function (oid) {
  if (!arguments.length) return ObjectIdToString();
  return oid.toHexString();
};

module.exports = exports = ObjectId;