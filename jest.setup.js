jest.setTimeout(10000); // in milliseconds

let server;

// loading the server
beforeAll(() => {
  server = require('./src/server');
});

// closing the server
afterAll(async () => {
  await server.close();
});
