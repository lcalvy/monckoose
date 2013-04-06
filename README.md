## What's monckoose?

  Monckoose helps you working with mongoose but without any database.
  It provides a mocky database driver and a collection helper to make it easy to code any entity mocks.

## Usage

First you need to put this line before any require of 'mongoose' :

```javascript
    require('monckoose');
```

Because it sets a global variable to tell mongoose to use the monckoose driver instead of the native one.
Then add the mocks location to options :

```javascript
    mongoose.connect('mongodb://localhost/mocks', { mocks: require(path.join(__dirname, 'myMocks')) });
```

Create a mocks module in myMocks.js, for example :

```javascript
    var monckoose = require('monckoose')
      , mocks, contacts;

    contacts = [
      { name: 'Robert', company: 'fake', email: 'robert@fake.net', _id: '51605fe1779ade6334000009', __v: 0 },
      { name: 'Jennifer', company: 'fake', email: 'jennifer@fake.net', _id: '51605fe1779ade6334000004', __v: 0 }
    ];

    mocks = {
      contacts: new monckoose.MonckooseCollection(contacts)
    };

    module.exports = exports = mocks;
```

That's all! Now you can work as usual with mongoose, for example :

```javascript
    var Contact = mongoose.model('Contact', {
      name: String,
      company: String,
      email: String
    });
    var john = new Contact({ name: 'John', company: 'woo', email: 'john@woo.org' });
    john.save(function (err) {
      ...
    });
```

## Limitations

Currently available methods are limited to : find, findOne, insert and remove.
An Error is thrown when other methods are invoked (contributions are welcome to complete MonckooseCollection.prototype).


See unit tests in spec for more examples

Enjoy !
