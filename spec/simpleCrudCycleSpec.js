/*global describe: false, it: false, afterEach: false, beforeEach: false, runs: false, waitsFor: false, expect: false */

require('../lib/monckoose');

var path = require('path')
  , mongoose = require('mongoose')
  , Profess = require('profess')
  , contactSchema = require('./contact-schema');

describe('Monckoose simple crud cycle', function () {
  var profess, completed, Contact, jennifer, contactSize;

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
      profess
        .do(function () {
          if (mongoose.connection.readyState) {
            profess.next();
          } else {
            mongoose.connect('mongodb://localhost/mocks', dbOptions, function (err) {
              expect(err).toBeFalsy();
              profess.next();
            });
          }
        })
        .then(function () {
          expect(mongoose.connection.readyState).toBeTruthy();
          Contact = mongoose.model('Contact', contactSchema);
          expect(Contact).toBeTruthy();
          completed = true;
        });
    });
    waitsFor(function () {
      return completed;
    }, 1000);
  });
  it('should return all the contacts including Robert, Jennifer and Michelle', function () {
    var robertFound, jenniferFound, michelleFound;
    completed = false;
    robertFound = jenniferFound = false;
    runs(function () {
      Contact.find(function (err, contacts) {
        expect(err).toBeFalsy();
        expect(contacts).toBeTruthy();
        expect(contacts.length).toBeGreaterThan(0);
        contactSize = contacts.length;
        contacts.forEach(function (contact) {
          if (contact.name === 'Robert') {
            robertFound = true;
          } else if (contact.name === 'Jennifer') {
            jenniferFound = true;
          } else if (contact.name === 'Michelle') {
            michelleFound = true;
          }
        });
        expect(robertFound).toBeTruthy();
        expect(jenniferFound).toBeTruthy();
        expect(michelleFound).toBeTruthy();
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
            contactSize += 2;
            expect(contacts.length).toBe(contactSize);
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
          Contact.findOne({ name: 'Jennifer', email: 'jennifer@fake.net' }, function (err, contact) {
            expect(err).toBeFalsy();
            expect(contact).toBeTruthy();
            if (contact) {
              expect(contact.name).toBe('Jennifer');
            }
            profess.next(contact);
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
            contactSize--;
            expect(contacts.length).toBe(contactSize);
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
  it('should disconnect', function () {
    completed = false;
    runs(function () {
      mongoose.disconnect(function (err) {
        expect(err).toBeFalsy();
        expect(mongoose.connection.readyState).toBeFalsy();
        completed = true;
      });
    });
    waitsFor(function () {
      return completed;
    }, 1000);
  });
});