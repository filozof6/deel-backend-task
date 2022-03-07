const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const ContractRoutes = require('./modules/contract/routes');
const JobRoutes = require('./modules/job/routes');
const AdminRoutes = require('./modules/admin/routes');

const app = express();

app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

ContractRoutes.endpoints(app);
JobRoutes.endpoints(app);
AdminRoutes.endpoints(app);

module.exports = app;
