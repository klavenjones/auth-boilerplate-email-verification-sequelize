// User Registration Validation
const isEmpty = require("./isEmpty");
const Validator = require("validator");

module.exports = function validateUserInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  //Must be an email address
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  //Email is required
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  //Password is required
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
