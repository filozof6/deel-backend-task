const request = require('supertest');
const { ADMIN_API_ENDPOINT } = require('./routes');
const app = require('../../server');

const TEST_PROFILE_ID = 1;

describe(`${ADMIN_API_ENDPOINT} Spec`, () => {
  describe(`${ADMIN_API_ENDPOINT}/best-profession`, () => {
    const dataSet = [
      ['2019-01-15 00:00:00.000 +00:00', '2023-10-15 00:00:00.000 +00:00', 'Programmer'],
      ['2020-08-09 19:00:00.000 -05:00', '2020-08-11 19:00:00.000 -05:00', 'Musician'],
    ];
    it.each(dataSet)(
      'returns correct profession string',
      async (startDate, endDate, professionString) => {
        const res = await request(app)
          .get(
            `${ADMIN_API_ENDPOINT}/best-profession?start=${encodeURIComponent(
              startDate,
            )}&end=${encodeURIComponent(endDate)}`,
          )
          .set('profile_id', TEST_PROFILE_ID);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(professionString);
      },
    );
  });

  describe(`${ADMIN_API_ENDPOINT}/best-clients`, () => {
    const dataSet = [
      ['2019-01-15 00:00:00.000 +00:00', '2023-10-15 00:00:00.000 +00:00', 1, 1],
      ['2020-10-15 00:00:00.000 +00:00', '2023-10-15 00:00:00.000 +00:00', 2, 0],
      ['2000-10-15 00:00:00.000 +00:00', '2000-10-16 00:00:00.000 +00:00', 3, 0],
    ];

    it.each(dataSet)(
      'returns correct best client list',
      async (startDate, endDate, limit, realRowsCount) => {
        const res = await request(app)
          .get(
            `${ADMIN_API_ENDPOINT}/best-clients?start=${encodeURIComponent(
              startDate,
            )}&end=${encodeURIComponent(endDate)}&limit=${limit}`,
          )
          .set('profile_id', TEST_PROFILE_ID);
        console.log({
          res: res.body,
          wtf: res.body.length,
          expected: realRowsCount,
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(realRowsCount);
      },
    );
  });
});
