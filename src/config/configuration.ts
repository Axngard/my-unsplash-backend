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
  objectStorage: {
    apikey: process.env.IBM_STORAGE_APIKEY,
    endpoint: process.env.IBM_STORAGE_ENDPOINT,
    authEndpoint: process.env.IBM_AUTH_ENDPOINT,
    instanceId: process.env.IBM_STORAGE_INSTANCE_ID,
    bucketName: process.env.IBM_BUCKET_NAME,
  },
})
