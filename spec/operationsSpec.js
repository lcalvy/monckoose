/*global describe: false, it: false, afterEach: false, beforeEach: false, runs: false, waitsFor: false, expect: false */

require('../lib/monckoose');

var path = require('path')
  , mongoose = require('mongoose')
  , Profess = require('profess')
  , contactSchema = require('./contact-schema');

describe('Operations', function () {
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
  it('should return Robert', function () {
    completed = false;
    runs(function () {
      Contact.findById('51605fe1779ade6334000009', function (err, contact) {
          expect(err).toBeFalsy();
          expect(contact).toBeTruthy();
          expect(contact.name).toBe('Robert');
          completed = true;
        }
      )
      ;
    });
    waitsFor(function () {
      return completed;
    }, 1000);
  });
  it('should return Jennifer', function () {
    completed = false;
    runs(function () {
      Contact.findById('51605fe1779ade6334000004', function (err, contact) {
        expect(err).toBeFalsy();
        expect(contact).toBeTruthy();
        if (contact) {
          expect(contact.name).toBe('Jennifer');
        }
        completed = true;
      });
    });
    waitsFor(function () {
      return completed;
    }, 1000);
  });
  it('should update Michelle', function () {
    completed = false;
    runs(function () {
      Contact.findByIdAndUpdate('51605fe1779ade6334000007', { company: 'woo', email: 'michelle@woo.org' }, function (err) {
        expect(err).toBeFalsy();
        completed = true;
      });
    });
    waitsFor(function () {
      return completed;
    }, 1000);
  });
  it('should find updated Michelle', function () {
    completed = false;
    runs(function () {
      Contact.findOne({ name: 'Michelle', email: 'michelle@woo.org'}, function (err, contact) {
        expect(err).toBeFalsy();
        expect(contact).toBeTruthy();
        if (contact) {
          expect(contact.name).toBe('Michelle');
          expect(contact.company).toBe('woo');
          expect(contact.email).toBe('michelle@woo.org');
        }
        completed = true;
      });
    });
    waitsFor(function () {
      return completed;
    }, 1000);
  });
  it('should add Anna, find her and modify her email', function () {
    completed = false;
    runs(function () {
      profess
        .do(function () {
          var contact = new Contact({ name: 'Anna', company: 'woo', email: 'anna@woo.org' });
          contact.save(function (err) {
            expect(err).toBeFalsy();
            profess.next(contact._id);
          });
        })
        .then(function (contactId) {
          Contact.findByIdAndUpdate(contactId, { email: 'anna@waa.com' }, function (err, contact) {
            expect(err).toBeFalsy();
            profess.next(contactId);
          });
        })
        .then(function (contactId) {
          Contact.findById(contactId, function (err, contact) {
            expect(err).toBeFalsy();
            expect(contact).toBeTruthy();
            if (contact) {
              expect(contact.name).toBe('Anna');
              expect(contact.company).toBe('woo');
              expect(contact.email).toBe('anna@waa.com');
            }
            completed = true;
          });
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