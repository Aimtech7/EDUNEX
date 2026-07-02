import dotenv from "dotenv";

dotenv.config();

type AppNodeEnv = "development" | "test" | "production";

const normalizeNodeEnv = (value?: string): AppNodeEnv => {
  switch (value) {
    case "production":
    case "test":
    case "development":
      return value;
    default:
      return "development";
  }
};

const nodeEnv = normalizeNodeEnv(process.env.NODE_ENV ?? process.env.STAGE);

// Keep legacy env consumers working while centralizing config resolution.
process.env.NODE_ENV = nodeEnv;
process.env.STAGE ??= nodeEnv;

const parsePort = (value?: string): number => {
  const parsed = Number(value ?? 5000);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 5000;
};

const mongoUri =
  process.env.MONGO_URL ??
  process.env.MONGODB_URI ??
  process.env.CLOUD_MONGOPATH ??
  process.env.MONGOPATH ??
  process.env.LOCAL_MONGOPATH ??
  "";

export const env = {
  PORT: parsePort(process.env.PORT),
  NODE_ENV: nodeEnv,
  CLIENT_URL: process.env.CLIENT_URL ?? "http://localhost:5173",
  JWT_SECRET: process.env.JWT_SECRET ?? "",
  MONGO_URI: mongoUri,
  DATABASE_NAME: process.env.DATABASE_NAME ?? "",
  GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? "",
};

export const validateEnv = () => {
  const missing: string[] = [];

  if (!env.MONGO_URI) {
    missing.push("MONGO_URL");
  }

  if (!env.JWT_SECRET) {
    missing.push("JWT_SECRET");
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
};
