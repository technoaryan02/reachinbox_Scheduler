import IORedis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redis = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

const LIMIT = Number(process.env.MAX_EMAILS_PER_HOUR || 10);

export async function checkRateLimit() {
  const key = "email-rate-limit:" + new Date().toISOString().slice(0, 13);

  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 3600);
  }

  console.log(`Hourly email count: ${count}/${LIMIT}`);

  return {
    allowed: count <= LIMIT,
    count,
    limit: LIMIT,
  };
}