const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { jwt_secret } = require("../config/keys");

const { Token } = require("../config/sequelize");

module.exports = (sequelize, type) => {
  let User = sequelize.define(
    "user",
    {
      id: {
        primaryKey: true,
        type: type.INTEGER,
        allowNull: false,
        autoIncrement: true
      },
      email: {
        type: type.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: type.STRING,
        allowNull: false,
        required: true
      },
      name: {
        type: type.STRING,
        allowNull: false,
        required: true
      },
      isVerified: {
        type: type.BOOLEAN,
        defaultValue: false
      },
      reset_password_token: {
        type: type.STRING
      },
      reset_password_expiration: {
        type: type.DATE
      }
    },
    {
      underscored: true,
      updatedAt: false,
      createdAt: false
    }
  );
  // Creating a custom method for our model.
  // This will check if an unhashed password entered by the
  // user can be compared to the hashed password stored in our database
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Creating a custom method for our model.
  // This will generate a JWT token for Authentication
  User.prototype.generateJWT = function() {
    const payload = {
      id: this.id,
      email: this.email
    };

    return jwt.sign(payload, jwt_secret, {
      expiresIn: "1h" //Token expires in one day
    });
  };

  //Creating a custom method that will create the reset password token and it's expiration for the user
  User.prototype.generatePasswordResetToken = async function() {
    this.reset_password_token = crypto.randomBytes(20).toString("hex");
    this.reset_password_expiration = Date.now() + 3600000; // expires in an hour
  };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  User.beforeCreate(user => {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
  });

  User.beforeUpdate(user => {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
  });

  return User;
};
