const { Worker } = require('bullmq');

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

const connection = {
	host: '127.0.0.1',
	port: Number.parseInt(process.env.REDIS_PORT || '6379'),
};

const worker = new Worker(
	'email-queue',
	async (job) => {
		const { email } = job.data;
		if (!email) {
			throw { success: false, message: 'Job is missing a valid email' };
		}

		await sleep(5000); // sending mail

		if (email.includes('fail')) {
			throw { success: false, message: "Failed to send email." };
		}

		console.log(`Email sent to ${email}`);
		return { success: true, message: `Email sent to ${email}` };
	},
	{ connection }
);

worker.on('ready', () => {
    console.log("Worker ready.");
})

worker.on('active', (job) => {
    console.log(`Job ${job.id} active`);
})

worker.on('completed', (job) => {
	console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
	console.log(`Job ${job.id} failed: ${err.message}`);
});
