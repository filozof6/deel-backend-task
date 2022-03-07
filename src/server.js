const app = require('./app');

let server;
try {
  server = app.listen(3001, () => {
    console.log('Express App Listening on Port 3001');
  });
} catch (error) {
  console.error(`An error occurred: ${JSON.stringify(error)}`);
  process.exit(1);
}

module.exports = server;
