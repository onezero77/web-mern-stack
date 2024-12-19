import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDb Connected:  ${conn.connection.host}");
  } catch (error) {
    console.log("Error: ${error.message}");
    process.exit(1); // process 1 code mean exit with failure , 0 mean success
  }
};
