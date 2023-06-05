import dotenv from 'dotenv';
import express from 'express';
import path from 'path';

dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

const port = 3000;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
