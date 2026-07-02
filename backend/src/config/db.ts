import mongoose from "mongoose";
import { env } from "./env.ts";

// connect our db
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      env.MONGO_URI,
      env.DATABASE_NAME ? { dbName: env.DATABASE_NAME } : undefined
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${(error as Error).message}`);
    process.exit(1); // Exit process with failure
  }
};
