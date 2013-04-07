var monckoose = require('../lib/monckoose')
  , mocks, contacts;

contacts = [
  { name: 'Robert', company: 'fake', email: 'robert@fake.net', _id: '51605fe1779ade6334000009', __v: 0 },
  { name: 'Jennifer', company: 'fake', email: 'jennifer@fake.net', _id: '51605fe1779ade6334000004', __v: 0 },
  { name: 'Michelle', company: 'own', email: 'michelle@own.com', _id: '51605fe1779ade6334000007', __v: 0 }
];

mocks = {
  contacts: new monckoose.MonckooseCollection(contacts)
};

module.exports = exports = mocks;