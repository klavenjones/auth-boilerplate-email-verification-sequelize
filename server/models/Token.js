module.exports = (sequelize, type) => {
  let Token = sequelize.define(
    "token",
    {
      id: {
        primaryKey: true,
        type: type.INTEGER,
        autoIncrement: true
      },
      user_id: {
        type: type.INTEGER,
        required: true
      },
      token: {
        type: type.STRING
      },
      token_expiration: {
        type: type.DATE
      }
    },
    {
      underscored: true,
      updatedAt: false,
      createdAt: false
    }
  );

  return Token;
};
