// User Registration Validation
const isEmpty = require("./isEmpty");
const Validator = require("validator");

module.exports = function validateUserInput(data) {
  let errors = {};

  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  //First name must be atleast 2 characters long
  if (!Validator.isLength(data.firstName, { min: 2, max: 30 })) {
    errors.lastName = "First name must be between 2 and 30 characters";
  }

  //Last name must be atleast 2 characters long
  if (!Validator.isLength(data.lastName, { min: 2, max: 30 })) {
    errors.lastName = "Last name must be between 2 and 30 characters";
  }

  //First name is required
  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = "Firstname field is required";
  }

  //Last name is required
  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = "Lastname field is required";
  }

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

  //Password must be atleast 6 chars long
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }

  //Confirm PW must match
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm Password field is required";
  }

  //Passwords must match
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
