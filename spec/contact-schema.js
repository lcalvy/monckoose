module.exports = exports = {
  name: {
    type: String
  },
  company: String,
  email: {
    type: String,
    required: true,
    unique: true
  }
};