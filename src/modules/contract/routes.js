const { Op } = require('sequelize');
const { getProfile } = require('../../middleware/getProfile');
const { CONTRACT_STATUSES } = require('./model');

const CONTRACT_API_ENDPOINT = '/contracts';

module.exports = {
  CONTRACT_API_ENDPOINT,
  endpoints: app => {
    /**
     * Returns a list of non terminated contracts belonging to a user
     * (client or contractor)
     *
     * @returns Contract[]
     */
    app.get(CONTRACT_API_ENDPOINT, getProfile, async (req, res) => {
      const { Contract } = req.app.get('models');
      const contracts = await Contract.findAll({
        where: {
          [Op.or]: [
            { ContractorId: req.profile.id },
            { ClientId: req.profile.id }
          ],
          status: {
            [Op.not]: CONTRACT_STATUSES.TERMINATED
          }
        }
      });

      res.json(contracts);
    });

    /**
     * should return the contract only if it belongs to the
     * profile calling.
     *
     * @returns Contract
     */
    app.get(`${CONTRACT_API_ENDPOINT}/:id`, getProfile, async (req, res) => {
      const { Contract } = req.app.get('models');
      const { id } = req.params;
      const contract = await Contract.findOne({
        where: {
          id,
          [Op.or]: [
            { ContractorId: req.profile.id },
            { ClientId: req.profile.id }
          ]
        }
      });

      if (!contract) return res.status(404).end();
      res.json(contract);
    });
  }
};
