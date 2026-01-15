import { Queue } from "bullmq";

const emailQueue = new Queue("email-queue");

export const CheckJobStatus = async (req, res) => {
    const jobId = req.params.id;

    if (!jobId)
        return res.status(400).send({ success: false, message: `Missing jobId.` });

    const job = await emailQueue.getJob(jobId);

    if (!job)
        return res.status(404).send({ success: false, message: `No job found against given jobId ${jobId}.` })

    const state = await job.getState();
    res.send({ success: true, status: state });
}