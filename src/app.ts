import express from 'express';
import cors from 'cors';

import corsConfig from './config/corsConfig';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './utils/errorHandler';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsConfig));

app.get('/health', (_, res) => {
  res.status(201).send('status OK');
});

app.use('/auth', authRoutes);

app.use(errorHandler);

export default app;
