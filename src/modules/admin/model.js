const Sequelize = require('sequelize');

const MODEL_NAME = 'Profile';
const PROFILE_TYPES = {
  CLIENT: 'client',
  CONTRACTOR: 'contractor',
};

const modelClass = (sequelize) => {
  const Profile = class Profile extends Sequelize.Model {};
  Profile.init(
    {
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      profession: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      balance: {
        type: Sequelize.DECIMAL(12, 2),
      },
      type: {
        type: Sequelize.ENUM(...Object.values(PROFILE_TYPES)),
      },
    },
    {
      sequelize,
      modelName: MODEL_NAME,
    },
  );

  return Profile;
};

module.exports = {
  MODEL_NAME,
  PROFILE_TYPES,
  modelClass,
};
