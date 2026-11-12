import { ConnectionOptions } from "bullmq";
import "dotenv/config";

const redisUrl = process.env.REDIS_URL;

export const connection: ConnectionOptions = {
  url: redisUrl,
  maxRetriesPerRequest:null
}