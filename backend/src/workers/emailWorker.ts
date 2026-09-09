import { Worker } from "bullmq";
import IORedis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

import { pool } from "../config/database";
import { sendEmail } from "../services/emailService";
import { checkRateLimit } from "../services/rateLimiter";

const connection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// Minimum delay helper
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const worker = new Worker(
  "email-queue",
  async (job) => {
    console.log("Processing email job:", job.id);

    const { emailId } = job.data;

    // Get email from PostgreSQL
    const result = await pool.query(
      "SELECT * FROM emails WHERE id = $1",
      [emailId]
    );

    if (result.rows.length === 0) {
      throw new Error("Email not found");
    }

    const email = result.rows[0];

    // Idempotency: don't send twice
    if (email.status === "sent") {
      console.log("Email already sent:", emailId);
      return;
    }

    // Mark as processing
    await pool.query(
      "UPDATE emails SET status = 'processing' WHERE id = $1",
      [emailId]
    );

    try {
      // Check hourly rate limit
      const rateLimitResult = await checkRateLimit();

      if (!rateLimitResult.allowed) {
        console.log(
          `Rate limit exceeded: ${rateLimitResult.count}/${rateLimitResult.limit}`
        );

        throw new Error("Rate limit exceeded");
      }

      // Minimum delay between emails
      const delay = Number(
        process.env.MIN_EMAIL_DELAY_MS || 1000
      );

      console.log(`Waiting ${delay}ms before sending...`);

      await sleep(delay);

      // Send email
      const emailResult = await sendEmail(
        email.recipient,
        email.subject,
        email.body
      );

      // Mark as sent
      await pool.query(
        `
        UPDATE emails
        SET status = 'sent',
            sent_at = CURRENT_TIMESTAMP
        WHERE id = $1
        `,
        [emailId]
      );

      console.log("Email sent:", emailResult.messageId);

      return emailResult;

    } catch (error) {

      await pool.query(
        `
        UPDATE emails
        SET status = 'failed',
            error = $2
        WHERE id = $1
        `,
        [emailId, String(error)]
      );

      throw error;
    }
  },
  {
    connection,
    concurrency: Number(
      process.env.WORKER_CONCURRENCY || 5
    ),
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
  console.error(
    `Job ${job?.id} failed:`,
    error.message
  );
});

console.log("Email worker started");