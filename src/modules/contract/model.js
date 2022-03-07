const Sequelize = require('sequelize');

const MODEL_NAME = 'Contract';
const CONTRACT_STATUSES = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  TERMINATED: 'terminated',
};

const modelClass = (sequelize) => {
  class Contract extends Sequelize.Model {}
  return Contract.init(
    {
      terms: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(...Object.values(CONTRACT_STATUSES)),
      },
    },
    {
      sequelize,
      modelName: MODEL_NAME,
    },
  );
};

module.exports = {
  MODEL_NAME,
  CONTRACT_STATUSES,
  modelClass,
};
