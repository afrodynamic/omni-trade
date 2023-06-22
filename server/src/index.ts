/// <reference types="./kucoin-node-sdk" />
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import path from 'path';
import { Server } from 'socket.io';

import { setupSockets } from './controllers/socketController';
import { orderRoutes } from './routes/orderRoutes';

dotenv.config();

const app = express();

app.use(express.json());

app.use(morgan('combined'));

app.use(express.static(path.join(__dirname, '../dist')));

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

const port = 3000;

const unsubscribeConnections = setupSockets(io);

app.use('/api/orders', orderRoutes);

server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

server.on('close', () => {
  unsubscribeConnections();
});
