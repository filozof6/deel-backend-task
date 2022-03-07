const request = require('supertest');
const { CONTRACT_API_ENDPOINT } = require('./routes');
const app = require('../../server');

const TEST_PROFILE_ID = 1;

describe(`${CONTRACT_API_ENDPOINT} Spec`, () => {
  describe(`${CONTRACT_API_ENDPOINT}`, () => {
    it('should return all contracts for profile', async () => {
      const res = await request(app).get(CONTRACT_API_ENDPOINT).set('profile_id', TEST_PROFILE_ID);
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2);
    });
  });

  describe(`${CONTRACT_API_ENDPOINT}/:id`, () => {
    const dataSet = [
      // Profile id retrieving contract that belongs to him
      [TEST_PROFILE_ID, 1, 200],
      // Profile id retrieving contract that does not belongs to him
      [TEST_PROFILE_ID, 3, 404],
    ];
    it.each(dataSet)('returns correct HTML code', async (profileId, contractId, responseCode) => {
      const res = await request(app)
        .get(`${CONTRACT_API_ENDPOINT}/${contractId}`)
        .set('profile_id', profileId);

      expect(res.statusCode).toEqual(responseCode);
    });
  });
});
