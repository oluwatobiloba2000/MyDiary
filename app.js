import express from 'express';

import dotenv from 'dotenv';

import { json, urlencoded } from 'body-parser';

import morgan from 'morgan';

import cors from 'cors';

import authRoutes from './src/routes/auth';

const app = express();
dotenv.config();
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.status(200).json({
  status: 'okay',
  code: 200,
  message: 'welcome to users api',
}));

app.use('/api/', authRoutes);

app.all('*', (req, res) => res.status(404).json({
  status: 'error',
  message: 'not found',
  code: 404,
}));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`app is listening on localhost:${PORT}`);
});
