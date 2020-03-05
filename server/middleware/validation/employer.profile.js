const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateEmployerInput(data) {
  let errors = {};

  data.website = !isEmpty(data.website) ? data.website : "";
  data.linkedin = !isEmpty(data.linkedin) ? data.linkedin : "";

  /* 
    CHECKING VALID URLs
  */

  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = "Not a valid URL";
    }
  }

  if (!isEmpty(data.linkedin)) {
    if (!Validator.isURL(data.linkedin)) {
      errors.linkedin = "Not a valid URL";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
