const { Op } = require('sequelize');
const { getProfile } = require('../../middleware/getProfile');
const { MODEL_NAME: CONTRACT_MODEL_NAME } = require('../contract/model');
const SERVER_MESSAGES = require('../../const/server-messages');
const { sequelize } = require('../../model');

const JOB_API_ENDPOINT = '/jobs';

module.exports = {
  JOB_API_ENDPOINT,
  endpoints: app => {
    /**
     * Get all unpaid jobs for a user (either a client or contractor),
     * for active contracts only.
     *
     * @returns Job[]
     */
    app.get(`${JOB_API_ENDPOINT}/unpaid`, getProfile, async (req, res) => {
      const { Job, Contract } = req.app.get('models');

      const jobs = await Job.findAll({
        where: {
          /* 
            this is actually a bad table design 
            the column Job.paid should be 
            tinyInt, not nullable, default to 0
          */
          [Op.or]: [{ paid: null }, { paid: 0 }]
        },
        include: [
          {
            model: Contract,
            as: CONTRACT_MODEL_NAME,
            where: {
              [Op.or]: [
                { contractorId: req.profile.id },
                { clientId: req.profile.id }
              ]
            }
          }
        ]
      });

      res.json(jobs);
    });

    /**
     * Pay for a job,
     * a client can only pay if his balance >= the amount to pay.
     * The amount will be moved from the client's balance
     * to the contractor balance.
     *
     * @returns { message: string }
     */
    app.get(`${JOB_API_ENDPOINT}/:job_id/pay`, getProfile, async (req, res) => {
      const { Contract, Job, Profile } = req.app.get('models');
      const jobId = req.params.job_id;
      const profileId = req.profile.id;

      const job = await Job.findOne({
        where: {
          id: jobId
        },
        include: [
          {
            model: Contract,
            as: CONTRACT_MODEL_NAME,
            include: [
              {
                model: Profile,
                as: 'Client'
              },
              {
                model: Profile,
                as: 'Contractor'
              }
            ]
          }
        ]
      });

      if (!job) {
        return res.status(404).json({ message: SERVER_MESSAGES.NOT_FOUND });
      }
      if (job.paid) {
        return res
          .status(406)
          .json({ message: SERVER_MESSAGES.JOB_ALREADY_PAID })
          .end();
      }
      if (job.Contract.Client.balance < job.price) {
        return res
          .status(406)
          .json({ message: SERVER_MESSAGES.INSUFFICIENT_FUNDS })
          .end();
      }
      if (profileId !== job.Contract.Client.id) {
        return res
          .status(404)
          .json({ message: SERVER_MESSAGES.NOT_FOUND })
          .end();
      }

      try {
        await sequelize.transaction(async () => {
          await Profile.update(
            { balance: job.Contract.Client.balance - job.price },
            {
              where: {
                id: job.Contract.Client.id
              }
            }
          );

          await Profile.update(
            { balance: job.Contract.Client.balance + job.price },
            {
              where: {
                id: job.Contract.Client.id
              }
            }
          );

          await Job.update(
            { paid: 1, paymentDate: new Date() },
            {
              where: {
                id: job.id
              }
            }
          );
        });
      } catch (error) {
        return res
          .status(500)
          .json({ message: SERVER_MESSAGES.SERVER_ERROR })
          .end();
      }

      res.status(200).json({ message: SERVER_MESSAGES.JOB_PAY_SUCCESS }).end();
    });
  }
};
