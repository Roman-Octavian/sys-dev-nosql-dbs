import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import studentRouter from './routers/student.js';
import topicRouter from './routers/topic.js';
import activityRouter from './routers/activity.js';

const app = express();

app.use(
  cors({
    origin: true,
  }),
);
app.use(express.json());

app.use(studentRouter);
app.use('/api/v1', topicRouter);
app.use(activityRouter);

const PORT = process.env.PORT ?? 8080;

const server = app.listen(PORT, () =>
  console.log('Server is running on port', server.address().port),
);
