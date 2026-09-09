import { Router } from "express";
import { emailQueue } from "../queues/emailQueue";

const router = Router();

router.post("/queue-test", async (req, res) => {
  try {
    const { recipient, subject, body, delay } = req.body;

    const job = await emailQueue.add(
      "send-email",
      {
        recipient,
        subject,
        body,
      },
      {
        delay: delay || 0,
        removeOnComplete: false,
        removeOnFail: false,
      }
    );

    res.json({
      message: "Email job added to queue",
      jobId: job.id,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to add job",
    });
  }
});

export default router;