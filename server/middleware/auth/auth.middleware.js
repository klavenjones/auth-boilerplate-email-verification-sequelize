const passport = require("passport");

module.exports = {
  passportJWT: passport.authenticate("jwt", { session: false }),
  passportLocal: passport.authenticate("local", { session: false }),
  passportLinkedIn: passport.authenticate("linkedin-token", {
    session: false
  })
};
