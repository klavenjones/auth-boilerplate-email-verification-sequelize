const { jwt_secret } = require("../config/keys");
const jwt = require("jsonwebtoken");

module.exports = (sequelize, type) => {
  let LinkedInUser = sequelize.define(
    "linkedin_user",
    {
      id: {
        primaryKey: true,
        type: type.STRING
      },
      user_id: {
        type: type.INTEGER
      },
      email: {
        type: type.STRING
      }
    },
    {
      underscored: true,
      updatedAt: false,
      createdAt: false
    }
  );
  // Creating a custom method for our model.
  // This will generate a JWT token for Authentication
  LinkedInUser.prototype.generateJWT = function() {
    const payload = {
      id: this.id,
      email: this.email
    };

    return jwt.sign(payload, jwt_secret, {
      expiresIn: "1h" //Token expires in one day
    });
  };
  return LinkedInUser;
};
