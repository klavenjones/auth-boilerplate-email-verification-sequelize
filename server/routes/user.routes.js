const express = require("express");
const router = require("express-promise-router")();

const {
  passportJWT,
  passportLocal
} = require("../middleware/auth/auth.middleware");

const userController = require("../controllers/auth.controllers");
const passwordController = require("../controllers/password.controllers");

// @route POST api/user/forgot-password
// @desc Recover Password - Generates token and sends email for password link
// @access Public
router.post("/forgot-password", passwordController.recover);

// @route GET password/reset
// @desc  This will receive the user's token from the client once they receive the email
// @access Public
router.get("/reset/:token", passwordController.reset);

// @route PUT api/user/update-password
// @desc Updates Password via email from password reset page
// @access Public
router.put("/update-password", passwordController.updatePasswordViaEmail);

module.exports = router;
