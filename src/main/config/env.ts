export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://localhost:27017/voting-system',
  port: process.env.PORT ?? 5051,
  jwtSecret: process.env.JWT_SECRET ?? 'tj670==5H'
}
