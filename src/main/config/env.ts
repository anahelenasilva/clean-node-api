export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb+srv://ana:ana123@cluster0.yzgzr.azure.mongodb.net/voting-system?retryWrites=true&w=majority',
  port: process.env.PORT ?? 5051,
  jwtSecret: process.env.JWT_SECRET ?? 'tj670==5H'
}
