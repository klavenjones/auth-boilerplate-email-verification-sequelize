/* 
      This function will aid in validating the form input. 
*/

const isEmpty = value =>
  value === undefined || //If value is undefined or
  value === null || // If value is null or
  (typeof value === "object" && Object.keys(value).length === 0) || //If object is empty or
  (typeof value === "string" && value.trim().length === 0); //If string is empty it is empty

module.exports = isEmpty;
