const passport = require("passport");

const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const LinkedInTokenStrategy = require("passport-linkedin-token-v2");

const { User, LinkedInUser } = require("../config/sequelize");

const { jwt_secret, linkedin } = require("./keys");

//Options
const opts = {};

//IN CASE I DECIDE TO PUT jwt tokens in cookies
const cookieExtractor = req => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["access_token"];
  }
  return token;
};
// opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
// opts.jwtFromRequest = ExtractJWT.fromHeader("authorization");
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = jwt_secret;

module.exports = passport => {
  passport.use(
    new JWTStrategy(opts, async (payload, done) => {
      try {
        //Find the user specified in token
        let user = await User.findOne({
          where: { email: payload.email },
          attributes: ["id", "name", "email"]
        });
        //If the user does not exist
        if (user) {
          return done(null, user);
        }
        //Check for LinkedIn User
        user = await LinkedInUser.findOne({ where: { email: payload.email } });
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (error) {
        done(error, false);
      }
    })
  );

  //Linkedin OAUTH SIGN IN STRATEGY
  passport.use(
    "linkedin-token",
    new LinkedInTokenStrategy(
      {
        clientID: linkedin.clientID,
        clientSecret: linkedin.clientSecret,
        redirectURL: linkedin.SignInRedirectURL,
        scope: ["r_emailaddress", "r_liteprofile"]
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          //Check if user exists in our database
          let existingUser = await LinkedInUser.findOne({ id: profile.id });
          if (existingUser) {
            return done(null, existingUser);
          }
          // Check if we have someone with the same email
          existingUser = await User.findOne({
            where: { email: profile.emails[0].value }
          });

          if (existingUser) {
            //Lets Associate this linkedin account with the current user
            let mergedUser = new LinkedInUser({
              id: profile.id,
              user_id: existingUser.id,
              email: profile.emails[0].value
            });

            await mergedUser.save();
            done(null, mergedUser);
          }

          //If User Does Not Exist Create New LinkedIn User
          let newUser = new LinkedInUser({
            id: profile.id,
            email: profile.emails[0].value
          });

          //Saving user
          await newUser.save();
          done(null, newUser);
        } catch (error) {
          done(error, false, error.message);
        }
      }
    )
  );
};
