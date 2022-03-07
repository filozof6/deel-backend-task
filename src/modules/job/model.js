const Sequelize = require('sequelize');

const MODEL_NAME = 'Job';

const modelClass = (sequelize) => {
  class Job extends Sequelize.Model {}
  return Job.init(
    {
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      /* 
        this is actually bad table design 
        the column Job.paid should be 
        tinyInt, not nullable, default to 0
      */
      paid: {
        type: Sequelize.BOOLEAN,
        default: false,
      },
      paymentDate: {
        type: Sequelize.DATE,
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
  modelClass,
};
