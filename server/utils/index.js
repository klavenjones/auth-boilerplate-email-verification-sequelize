const sgMail = require("@sendgrid/mail");

const { Token } = require("../config/sequelize");
const { sendgrid_key, from_email } = require("../config/keys");
const crypto = require("crypto");

sgMail.setApiKey(sendgrid_key);

module.exports = {
  sendEmail: async (user, req, res) => {
    try {
      const token = await generateVerificationToken(user);
      const { email, name } = user.dataValues;
      // console.log("LINE 15", sendgrid_key);
      // //Save Token
      // console.log("LINE 12 util/index.js ", token.token);
      // console.log("LINE 13 util/index.js ", user);
      // console.log("LINE 14", sgMail);
      let link = `http://${req.headers.host}/auth/verify/${token.token}`;
      const mailOptions = {
        to: email,
        from: from_email,
        subject: "Account Verification",
        text: `Hi ${name} \n 
          Please click on the following link ${link} to verify your account. \n\n 
          If you did not request this, please ignore this email.\n`
      };
      sgMail.send(mailOptions, (err, result) => {
        if (err) return res.status(500).json({ message: err.message });

        res.status(200).json({
          message: `A Verfication Email has been sent to ${user.email}`,
          user: user
        });
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  sendPasswordReset: async (user, req, res) => {
    try {
      user.generatePasswordResetToken();

      //Save Token
      await user
        .save()
        .then(user => {
          console.log("LINE 48", user);
          let link = `http://${req.headers.host}/auth/reset/${user.resetPasswordToken}`;
          const mailOptions = {
            to: user.email,
            from: from_email,
            subject: "Password Change Reques",
            text: `Hi ${user.username} \n
              Please click on the following link ${link} to reset your password. \n\n
              If you did not request this, please ignore this email\n
              and your password wiill remain the sane\n`
          };
          sgMail.send(mailOptions, (err, result) => {
            if (err) return res.status(500).json({ message: error.message });
            res.status(200).json({
              message: `A Password Reset Email has been sent to ${user.email}`
            });
          });
        })
        .catch(err => res.status(500).json({ message: error.message }));
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  uploader() {}
};

async function generateVerificationToken(user) {
  try {
    let payload = {
      user_id: user.id,
      token: crypto.randomBytes(20).toString("hex"),
      token_expiration: Date.now() + 1800000 // expires in 30 minutes
    };
    const newToken = await new Token(payload);
    newToken.save();
    return newToken;
  } catch (error) {
    console.log("ERROR, LINE 81, USER.js", error);
  }
}
