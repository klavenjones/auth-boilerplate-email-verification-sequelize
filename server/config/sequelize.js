const Sequelize = require("sequelize");
const UserModel = require("../models/User");
const TokenModel = require("../models/Token");
const LinkedInModel = require("../models/LinkedInUser");
/* 
    Database Configuration with Sequelize
*/
const { database, user, password } = require("../config/keys");

const sqlize = new Sequelize(database, user, password, {
  host: "localhost",
  dialect: "postgres",
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

/* 
    Models of DB entities. These will create the DB Tables
*/
const User = UserModel(sqlize, Sequelize);
const LinkedInUser = LinkedInModel(sqlize, Sequelize);
const Token = TokenModel(sqlize, Sequelize);

User.hasOne(Token);
Token.belongsTo(User);

User.hasOne(LinkedInUser);
LinkedInUser.belongsTo(User);

sqlize
  .sync({ force: true })
  .then(() => {
    console.log(`Database & tables created!`);
  })
  .catch(err => {
    console.log(err, "Something went wrong");
  });

module.exports = {
  User,
  Token,
  LinkedInUser
};
