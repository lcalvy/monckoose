/*global describe: false, it: false, afterEach: false, beforeEach: false, runs: false, waitsFor: false, expect: false */

require('../lib/monckoose');

var path = require('path')
  , mongoose = require('mongoose')
  , Profess = require('profess')
  , contactSchema;

contactSchema = {
  name: String,
  company: String,
  email: String
};

describe('Monckoose simple crud cycle', function () {
  var profess, completed, Contact, jennifer;

  beforeEach(function () {
    profess = new Profess({ verbose: false });
  });

  it('should connect', function () {
    completed = false;
    runs(function () {
      var dbOptions = {
        mocks: require(path.join(__dirname, 'sample-mocks')),
        debug: false
      };
      mongoose.connect('mongodb://localhost/mocks', dbOptions, function (err) {
        expect(err).toBeFalsy();
        Contact = mongoose.model('Contact', contactSchema);
        completed = true;
      });
    });
    waitsFor(function () {
      return completed;
    }, 1000);
  });
  it('should return Robert and Jennifer', function () {
    var robertFound, jenniferFound;
    completed = false;
    robertFound = jenniferFound = false;
    runs(function () {
      Contact.find(function (err, contacts) {
        if (err) {
          console.error(err);
          return;
        }
        expect(contacts).toBeTruthy();
        expect(contacts.length).toBe(2);
        contacts.forEach(function (contact) {
          if (contact.name === 'Robert') {
            robertFound = true;
          } else if (contact.name === 'Jennifer') {
            jenniferFound = true;
          }
        });
        expect(robertFound).toBeTruthy();
        expect(jenniferFound).toBeTruthy();
        completed = true;
      });
    });
    waitsFor(function () {
      return completed;
    }, 1000);
  });
  it('should add John and Tim', function () {
    completed = false;
    runs(function () {
      profess
        .do(function () {
          var john = new Contact({ name: 'John', company: 'woo', email: 'john@woo.org' });
          john.save(function (err) {
            expect(err).toBeFalsy();
            profess.next();
          });
        })
        .then(function () {
          var tim = new Contact({ name: 'Tim', company: 'woo', email: 'tim@woo.org' });
          tim.save(function (err) {
            expect(err).toBeFalsy();
            profess.next();
          });
        })
        .then(function () {
          var johnFound, timFound;
          johnFound = timFound = false;
          Contact.find(function (err, contacts) {
            expect(err).toBeFalsy();
            expect(contacts).toBeTruthy();
            expect(contacts.length).toBe(4);
            contacts.forEach(function (contact) {
              if (contact.name === 'John') {
                johnFound = true;
              } else if (contact.name === 'Tim') {
                timFound = true;
              }
            });
            expect(johnFound).toBeTruthy();
            expect(timFound).toBeTruthy();
            completed = true;
          });
        });
    });
    waitsFor(function () {
      return completed;
    }, 1000);
  });
  it('should remove Jennifer', function () {
    completed = false;
    runs(function () {
      profess
        .do(function () {
          Contact.findOne({ name: 'Jennifer', email: 'jennifer@fake.net' }, function (err, jennifer) {
            expect(err).toBeFalsy();
            expect(jennifer).toBeTruthy();
            expect(jennifer.name).toBe('Jennifer');
            profess.next(jennifer);
          });
        })
        .then(function (jennifer) {
          jennifer.remove(function (err) {
            expect(err).toBeFalsy();
            profess.next();
          });
        })
        .then(function () {
          Contact.find(function (err, contacts) {
            var robertFound, johnFound, timFound;
            robertFound = johnFound = timFound = false;
            expect(err).toBeFalsy();
            expect(contacts).toBeTruthy();
            expect(contacts.length).toBe(3);
            contacts.forEach(function (contact) {
              if (contact.name === 'Robert') {
                robertFound = true;
              } else if (contact.name === 'John') {
                johnFound = true;
              } else if (contact.name === 'Tim') {
                timFound = true;
              }
            });
            expect(robertFound).toBeTruthy();
            expect(johnFound).toBeTruthy();
            expect(timFound).toBeTruthy();
            profess.next();
          });
        })
        .then(function () {
          Contact.find({ company: 'fake' }, function (err, contacts) {
            var robertFound;
            robertFound = false;
            expect(err).toBeFalsy();
            expect(contacts).toBeTruthy();
            expect(contacts.length).toBe(1);
            contacts.forEach(function (contact) {
              if (contact.name === 'Robert') {
                robertFound = true;
              }
            });
            expect(robertFound).toBeTruthy();
            completed = true;
          });
        });
    });
    waitsFor(function () {
      return completed;
    }, 1000);
  });
  it('should return an empty array', function () {
    completed = false;
    runs(function () {
      Contact.find({ company: 'world' }, function (err, contacts) {
        expect(err).toBeFalsy();
        expect(contacts).toBeTruthy();
        expect(contacts.length).toBe(0);
        completed = true;
      });
    });
    waitsFor(function () {
      return completed;
    }, 1000);
  });
});