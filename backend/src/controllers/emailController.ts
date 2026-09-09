import { Request, Response } from "express"
import { pool } from "../config/database"
import { emailQueue } from "../queues/emailQueue"

export const scheduleEmail = async (req: Request, res: Response) => {
  try {
    const {
      sender_email,
      recipient_email,
      subject,
      body,
      scheduled_at,
    } = req.body

    if (
      !sender_email ||
      !recipient_email ||
      !subject ||
      !body ||
      !scheduled_at
    ) {
      return res.status(400).json({
        message: "All fields are required",
      })
    }

    const result = await pool.query(
      `INSERT INTO emails
       (sender_email, recipient_email, subject, body, scheduled_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        sender_email,
        recipient_email,
        subject,
        body,
        scheduled_at,
      ]
    )

    res.status(201).json({
      message: "Email scheduled successfully",
      email: result.rows[0],
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Failed to schedule email",
    })
  }
}