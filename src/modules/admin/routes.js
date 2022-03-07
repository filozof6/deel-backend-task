const { QueryTypes } = require('sequelize');
const { DATE_PARAMS_MISSING } = require('../../const/server-messages');
const { getProfile } = require('../../middleware/getProfile');
const { sequelize } = require('../../model');

const ADMIN_API_ENDPOINT = '/admin';

module.exports = {
  ADMIN_API_ENDPOINT,
  endpoints: app => {
    /**
     * Returns the profession that earned the most money
     * (sum of jobs paid) for any contactor that worked
     * in the query time range.
     *
     * @returns string
     */
    app.get(
      `${ADMIN_API_ENDPOINT}/best-profession`,
      getProfile,
      async (req, res) => {
        const { start, end } = req.query;

        if (!(start && end)) {
          return res.status(400).json({ message: DATE_PARAMS_MISSING }).end();
        }

        const bestProfession = await sequelize.query(
          `
          SELECT Profiles.profession
          FROM Jobs 
          INNER JOIN Contracts ON Jobs.ContractId = Contracts.id
          INNER JOIN Profiles ON Contracts.ContractorId = Profiles.id
          WHERE 
                  Jobs.paid = 1 AND 
                  Jobs.paymentDate > :start AND 
                  Jobs.paymentDate < :end
          GROUP BY Contracts.ClientId
          ORDER BY SUM(Jobs.price) DESC
          LIMIT 1
        `,
          {
            type: QueryTypes.SELECT,
            plain: true,
            replacements: {
              start,
              end
            },
            mapToModel: false,
            raw: true
          }
        );

        if (bestProfession) {
          return res.json(bestProfession.profession).end();
        }
        return res.status(404).end();
      }
    );

    /**
     * returns the clients the paid the most for jobs
     * in the query time period. limit query parameter should be
     * applied, default limit is 2.
     * 
     * @returns { id: number, fullName: string, paid: number }[]
     */
    app.get(
      `${ADMIN_API_ENDPOINT}/best-clients`,
      getProfile,
      async (req, res) => {
        const DEFAULT_LIMIT = 2;
        const { start, end } = req.query;
        const limit = req.query.limit || DEFAULT_LIMIT;

        if (!(start && end)) {
          return res.status(400).json({ message: DATE_PARAMS_MISSING }).end();
        }

        const bestClients = await sequelize.query(
          `
            SELECT  Contracts.ClientId AS id,
                    Profiles.firstName, 
                    Profiles.lastName,
                    SUM(Jobs.price) as paid
            FROM Jobs
            INNER JOIN Contracts ON Jobs.ContractId = Contracts.id
            INNER JOIN Profiles ON Contracts.ClientId = Profiles.id
            WHERE
                    Jobs.paid = 1 AND
                    Jobs.paymentDate BETWEEN :start AND :end
            GROUP BY Contracts.ClientId
            ORDER BY paid DESC
            LIMIT :limit
          `,
          {
            type: QueryTypes.SELECT,
            replacements: {
              start,
              end,
              limit
            },
            mapToModel: false,
            raw: true
          }
        );

        return res.json(
          bestClients.map(bestClient => ({
            id: bestClient.id,
            fullName: `${bestClient.firstName} ${bestClient.lastName}`,
            paid: bestClient.paid
          }))
        );
      }
    );
  }
};
