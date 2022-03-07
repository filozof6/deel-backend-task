const Sequelize = require('sequelize');
const ProfileModel = require('./modules/profile/model');
const ContractModel = require('./modules/contract/model');
const JobModel = require('./modules/job/model');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite3',
});

const Profile = ProfileModel.modelClass(sequelize);
const Contract = ContractModel.modelClass(sequelize);
const Job = JobModel.modelClass(sequelize);

Profile.hasMany(Contract, { as: 'Contractor', foreignKey: 'ContractorId' });
Contract.belongsTo(Profile, { as: 'Contractor' });
Profile.hasMany(Contract, { as: 'Client', foreignKey: 'ClientId' });
Contract.belongsTo(Profile, { as: 'Client' });
Contract.hasMany(Job);
Job.belongsTo(Contract);

module.exports = {
  sequelize,
  Profile,
  Contract,
  Job,
};
