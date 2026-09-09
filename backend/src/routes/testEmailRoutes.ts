import { Router } from "express";
import { sendEmail } from "../services/emailService";

const router = Router();

router.post("/send-test", async (req, res) => {
  try {
    const { recipient, subject, body } = req.body;

    if (!recipient || !subject || !body) {
      return res.status(400).json({
        message: "recipient, subject and body are required",
      });
    }

    const result = await sendEmail(recipient, subject, body);

    res.json({
      message: "Email sent successfully",
      ...result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to send email",
    });
  }
});

export default router;