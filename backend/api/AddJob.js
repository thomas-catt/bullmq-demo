import { Queue } from "bullmq";

const emailQueue = new Queue("email-queue");

export const AddJob =  async (req, res) => {
    const { email } = req.body;
    if (!email)
        return res.status(400).send({ success: false, message: "Email is required" });

    const job  = await emailQueue.add('send-email', { email });

    return res.send({success: true, message: "Email queued.", jobId: job.id});
}