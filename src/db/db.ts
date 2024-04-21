import mongoose from 'mongoose'

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log('Db is connected')
  } catch (e) {
    console.log(e, 'error')
  }
}