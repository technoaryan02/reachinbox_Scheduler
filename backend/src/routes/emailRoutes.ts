import { Router } from "express";
import { randomUUID } from "crypto";
import { pool } from "../config/database";
import { emailQueue } from "../queues/emailQueue";

const router = Router();

router.post("/schedule", async (req, res) => {
  try {
    const {
      recipient,
      subject,
      body,
      scheduledAt
    } = req.body;

    if (!recipient || !subject || !body || !scheduledAt) {
      return res.status(400).json({
        message: "recipient, subject, body and scheduledAt are required"
      });
    }

    const id = randomUUID();

    const scheduledTime = new Date(scheduledAt);
    const delay = Math.max(
      0,
      scheduledTime.getTime() - Date.now()
    );

    await pool.query(
      `
      INSERT INTO emails
      (id, recipient, subject, body, scheduled_at, status)
      VALUES ($1, $2, $3, $4, $5, 'scheduled')
      `,
      [
        id,
        recipient,
        subject,
        body,
        scheduledTime
      ]
    );

    await emailQueue.add(
      "send-email",
      {
        emailId: id
      },
      {
        jobId: id,
        delay
      }
    );

    res.status(201).json({
      message: "Email scheduled successfully",
      emailId: id,
      scheduledAt: scheduledTime
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to schedule email"
    });
  }
});

// Get all scheduled emails
router.get("/scheduled", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM emails
      WHERE status = 'scheduled'
      ORDER BY scheduled_at ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch scheduled emails"
    });
  }
});


// Get all sent emails
router.get("/sent", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM emails
      WHERE status = 'sent'
      ORDER BY sent_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch sent emails"
    });
  }
});


// Get all failed emails
router.get("/failed", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM emails
      WHERE status = 'failed'
      ORDER BY created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch failed emails"
    });
  }
});
export default router;