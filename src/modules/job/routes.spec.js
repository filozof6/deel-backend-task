const request = require('supertest');
const { JOB_API_ENDPOINT } = require('./routes');
const app = require('../../server');
const SERVER_MESSAGES = require('../../const/server-messages');

describe(`${JOB_API_ENDPOINT} Spec`, () => {
  describe(`${JOB_API_ENDPOINT}`, () => {
    const dataSet = [
      [1, 2],
      [2, 2],
      [3, 0],
    ];
    it.each(dataSet)('returns correct unpaid jobs length', async (profileId, returnedLength) => {
      const res = await request(app).get(`${JOB_API_ENDPOINT}/unpaid`).set('profile_id', profileId);
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(returnedLength);
    });
  });
  describe(`${JOB_API_ENDPOINT}/:job_id/pay`, () => {
    const dataSet = [
      // Profile id paying for contract that belongs to him
      [1, 1, 200, SERVER_MESSAGES.JOB_PAY_SUCCESS],
      // non existent job
      [1, 99, 404, SERVER_MESSAGES.NOT_FOUND],
      // job is already paid
      [2, 6, 406, SERVER_MESSAGES.JOB_ALREADY_PAID],
    ];
    it.each(dataSet)(
      'returns correct HTML code',
      async (profileId, jobId, statusCode, serverMessage) => {
        const res = await request(app)
          .get(`${JOB_API_ENDPOINT}/${jobId}/pay`)
          .set('profile_id', profileId);
        expect(res.statusCode).toEqual(statusCode);
        expect(res.body.message).toEqual(serverMessage);
      },
    );
  });
});
