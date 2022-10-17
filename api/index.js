const app = require('./src/app');
const sequelize = require('./src/config/database');

sequelize.sync().then(() => {
  console.log(`env: ${process.env.NODE_ENV}`);
  return app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});
