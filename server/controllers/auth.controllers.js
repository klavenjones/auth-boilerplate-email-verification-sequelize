const { User, Token, LinkedInUser } = require("../config/sequelize");
const { sendEmail } = require("../utils");
const crypto = require("crypto");

//Validation
const ValidateSignUp = require("../middleware/validation/user.register");
const ValidateLogIn = require("../middleware/validation/user.login");

// @route POST auth/register
// @desc Register user
// @access Public
exports.signUp = async (req, res, next) => {
  //Validation
  const { errors, isValid } = ValidateSignUp(req.body);
  const { email, password, firstName, lastName } = req.body;
  //Check validation
  if (!isValid) {
    //If not valid send error
    return res.status(400).json(errors);
  }

  //Check it user is already in database
  let user = await User.findOne({ where: { email: email } });
  //If user exists then we send an error
  if (user) {
    errors.message = "Email Already Exists";
    return res.status(400).json(errors);
  }

  //If the user does not exist we will save the user and create a verification token
  //Create New User
  const newUser = new User({
    name: `${firstName} ${lastName}`,
    email: email,
    password: password
  });

  //Save user
  newUser
    .save()
    // .then(user => sendEmail(user, req, res))
    .then(user => {
      //Else generate token and store it in a cookie
      const token = user.generateJWT();
      res.cookie("access_token", token, { httpOnly: true });
      return res.status(200).json({ success: true });
    })
    .catch(err => console.log(err));
};

// @route POST api/auth/login
// @desc Login and set jwt in cookie session
// @access Public
exports.signIn = async (req, res, next) => {
  const { errors, isValid } = ValidateLogIn(req.body);
  const { email, password } = req.body;
  //Check validation
  if (!isValid) {
    //If not valid send error
    return res.status(400).json(errors);
  }
  const user = await User.findOne({ where: { email } });
  //If no user send Error
  if (!user) {
    errors.message = "There is no such user in the system.";
    return res.status(404).json(errors);
  }
  //Check Password
  //If user is found check if the password is matches
  const isMatch = await user.validPassword(password);
  //If not send error
  if (!isMatch) {
    errors.message = "Wrong Email and Password Combination";
    return res.status(401).json(errors);
  }
  //Else generate token and store it in a cookie
  const token = user.generateJWT();
  res.cookie("access_token", token, { httpOnly: true });
  return res.status(200).json({ success: true });
};

// @route POST api/auth/login
// @desc Login and set jwt in cookie session
// @access Public
exports.linkedInOauth = async (req, res, next) => {
  //Look to see if the linkedin user is in the db as a user first
  let user = await User.findOne({ where: { id: req.user.user_id } });
  //If there is such a user then let's sign this user and send a token
  if (user) {
    let token = await user.generateJWT();
    return res.status(200).json({ token });
  }
  //else let us bring the linkedin user
  user = await LinkedInUser.findOne({ where: { id: req.user.id } });
  let token = await user.generateJWT();
  res.cookie("access_token", token, { httpOnly: true });
  return res.status(200).json({ success: true });
};

// @route GET auth/verify/:token
// @desc Verify token
// @access Public
exports.verify = async (req, res) => {
  if (!req.params.token)
    return res.status(400).json({ message: "We were unable to find a token" });

  try {
    //Find matching token
    const token = await Token.findOne({ where: { token: req.params.token } });
    console.log("LINE 84, auth.controllers.js", token);

    if (!token) {
      return res.status(400).json({
        message:
          "We were unable to find a valid token. Your token my have expired."
      });
    }
    //Find User
    const user = await User.findOne({ where: { id: token.user_id } });
    if (user.isVerified)
      return res.status(400).json({ message: "This user has been verified" });
    if (!user)
      return res
        .status(400)
        .json({ message: "We were unable to find a user for this token." });
    //Verify user
    user.isVerified = true;

    user.save(err => {
      if (err) return res.status(500).json({ message: err.message });
    });

    return res
      .status(200)
      .json({ message: "You account has been verified please log in" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET auth/resend
// @desc Verify token
// @access Public
exports.resendToken = async (req, res) => {
  try {
    //Find the user via email
    const { email } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(400).json({
        message: `We were unable to find the user associated with this email. Try again.`
      });
    }
    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "User is already verified. Please Log In" });
    }

    // sendEmail(user, req, res);
  } catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
};

// @route GET api/auth/status
// @desc Check Auth
// @access Public
exports.checkAuth = async (req, res, next) => {
  res.status(200).json({ success: true, user: req.user });
};

// @route GET api/auth/logOut
// @desc Logs User Out
// @access Public
exports.logOut = async (req, res, next) => {
  res.clearCookie("access_token");
  res.json({ success: true });
};

async function generateVerificationToken() {
  try {
    let payload = {
      user_id: this.id,
      token: crypto.randomBytes(20).toString("hex"),
      token_expiration: Date.now() + 1800000 // expires in 30 minutes
    };
    console.log("Line 7 auth.controller.js", Token);
    return new Token(payload);
  } catch (error) {
    console.log("ERROR, LINE 81, USER.js", error);
  }
}

async function signToken(user) {}
