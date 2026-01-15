const express = require('express');
const { AddJob } = require('./api/addJob');
const { CheckJobStatus } = require('./api/checkJobStatus');
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(express.json());
app.use(cors());

app.post('/jobs', AddJob);
app.get('/jobs/:id', CheckJobStatus);

const port = process.env.PORT || "3000";

app.listen(parseInt(port), () => {
	console.log(`Server listening on port ${port}`);
});

module.exports = { app };
