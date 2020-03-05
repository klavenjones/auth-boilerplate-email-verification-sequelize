const express = require("express");
const router = require("express-promise-router")();

const {
  passportJWT,
  passportLinkedIn
} = require("../middleware/auth/auth.middleware");

const authController = require("../controllers/auth.controllers");
const passwordController = require("../controllers/password.controllers");

// @route GET api/auth/status
// @desc Updates Password via email from password reset page
// @access Public
router.get("/status", passportJWT, authController.checkAuth);
// @route POST password/updatePasswordViaEmail
// @desc This will register a user and their role
// @access Public
router.post("/register", authController.signUp);
// @route POST api/auth/login
// @desc This will log in the user and set jwt in the cookie
// @access Public
router.post("/login", authController.signIn);
// @route POST api/auth/oauth/login
// @desc This will log in the user and set jwt in the cookie
// @access Public
router.post("/oauth/login", passportLinkedIn, authController.linkedInOauth);

// @route GET api/auth/sign-out
// @desc This will log in the user and set jwt in the cookie
// @access Public
// router.get("/logOut", authController.logOut);

// @route GET api/auth/verify/:token
// @desc This will verify the user via confirmation email
// @access Public
router.get("/verify/:token", authController.verify);

module.exports = router;
