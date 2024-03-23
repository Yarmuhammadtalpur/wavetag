// import { MongoClient } from "mongodb";
import { connect } from 'mongoose';

export const connectToDatabase = async () => {
  try {
    const mongoURL: string = String(process.env.MONGO_DB_URI);
    const client = await connect(mongoURL);
    console.log(`Connected to the MongoDB server at ${client.connection.host}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
};

export default connectToDatabase;
