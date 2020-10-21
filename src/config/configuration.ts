export default () => ({
  port: process.env.PORT,
  database: {
    host: process.env.MONGO_HOST,
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD,
    name: process.env.MONGO_DB_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
});
